import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;

let sentimentPipeline = null;
let isModelLoading = false;
let modelLoadPromise = null;

async function loadModel() {
  if (sentimentPipeline) return sentimentPipeline;
  if (modelLoadPromise) return modelLoadPromise;

  isModelLoading = true;
  console.log("Loading sentiment model from HuggingFace Hub...");

  modelLoadPromise = pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    {
      dtype: "q8",
      progress_callback: (progress) => {
        if (progress.status === "progress") {
          console.log(
            `Downloading: ${progress.file} - ${Math.round(
              progress.progress || 0
            )}%`
          );
        } else if (progress.status === "done") {
          console.log(`Downloaded: ${progress.file}`);
        } else if (progress.status === "ready") {
          console.log("Model ready!");
        }
      },
    }
  );

  try {
    sentimentPipeline = await modelLoadPromise;
    isModelLoading = false;
    console.log("Sentiment pipeline loaded successfully!");
    return sentimentPipeline;
  } catch (error) {
    isModelLoading = false;
    modelLoadPromise = null;
    console.error("Failed to load sentiment model:", error);
    throw error;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getParticipantSentiment(
  messages,
  participant,
  onProgress
) {
  const MAX_MESSAGES = 200;
  const BATCH_SIZE = 8;
  const BATCH_DELAY_MS = 50;

  let participantMessages = messages
    .filter((m) => m.author === participant)
    .map((m) => m.message)
    .filter((text) => text && text.length > 3 && text.length < 256);

  if (participantMessages.length === 0) {
    return { score: 0, label: "neutral", percentage: "0%", totalAnalyzed: 0 };
  }

  if (participantMessages.length > MAX_MESSAGES) {
    const step = Math.floor(participantMessages.length / MAX_MESSAGES);
    participantMessages = participantMessages
      .filter((_, i) => i % step === 0)
      .slice(0, MAX_MESSAGES);
  }

  console.log(
    `Analyzing ${participantMessages.length} messages for ${participant}...`
  );

  const classifier = await loadModel();

  let positiveCount = 0;
  let analyzed = 0;

  for (let i = 0; i < participantMessages.length; i += BATCH_SIZE) {
    const batch = participantMessages.slice(i, i + BATCH_SIZE);

    try {
      const results = await classifier(batch);

      results.forEach((result) => {
        if (result.label === "POSITIVE") {
          positiveCount++;
        }
      });

      analyzed += batch.length;

      if (onProgress) {
        onProgress({
          analyzed,
          total: participantMessages.length,
          percentage: Math.round((analyzed / participantMessages.length) * 100),
        });
      }

      await sleep(BATCH_DELAY_MS);
    } catch (error) {
      console.warn("Batch analysis failed:", error);
      analyzed += batch.length;
    }
  }

  if (analyzed === 0) {
    return { score: 0, label: "neutral", percentage: "0%", totalAnalyzed: 0 };
  }

  const positivePercentage = Math.round((positiveCount / analyzed) * 100);
  const label = positivePercentage >= 50 ? "positive" : "negative";
  const displayScore =
    positivePercentage >= 50
      ? `+${positivePercentage}%`
      : `-${100 - positivePercentage}%`;

  console.log(`${participant}: ${displayScore} (${analyzed} messages)`);

  return {
    score: positivePercentage / 100,
    label,
    percentage: displayScore,
    totalAnalyzed: analyzed,
  };
}

export function isModelReady() {
  return sentimentPipeline !== null;
}

export function isLoading() {
  return isModelLoading;
}

export async function preloadModel() {
  console.log("Preloading sentiment model...");
  await loadModel();
  console.log("Sentiment model cached and ready!");
}
