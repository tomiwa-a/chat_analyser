import { updateDashboard } from "./dataProcessor.js";

export function setupFileUpload() {
  const uploadButton = document.querySelector(".upload-card .btn-primary");
  const uploadCard = document.querySelector(".upload-card");

  if (!uploadButton || !uploadCard) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt,.zip";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  uploadButton.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  });

  uploadCard.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadCard.classList.add("dragover");
  });

  uploadCard.addEventListener("dragleave", () => {
    uploadCard.classList.remove("dragover");
  });

  uploadCard.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadCard.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });
}

function handleFileUpload(file) {
  const validTypes = [
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
  ];
  if (
    !validTypes.includes(file.type) &&
    !file.name.endsWith(".txt") &&
    !file.name.endsWith(".zip")
  ) {
    alert("Please upload a valid WhatsApp chat export file (.txt or .zip)");
    return;
  }

  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("File size must be less than 50MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;

      if (typeof whatsappChatParser !== "undefined") {
        const parsedMessages = whatsappChatParser.parseString(content);

        if (parsedMessages && parsedMessages.length > 0) {
          console.log("Parsed messages:", parsedMessages);

          const uploadSection = document.querySelector(".upload-section");
          const demoLabel = document.querySelector(".demo-label");

          if (uploadSection) uploadSection.style.display = "none";
          if (demoLabel) {
            demoLabel.style.display = "block";
            const demoBadge = demoLabel.querySelector(".demo-badge");
            const demoText = demoLabel.querySelector("p");
            if (demoBadge) demoBadge.textContent = "Live Data";
            if (demoText)
              demoText.textContent = `Showing analysis from your conversation with ${parsedMessages.length.toLocaleString()} messages`;
          }

          updateDashboard(parsedMessages);
        } else {
          alert("No messages found in the file. Please check the file format.");
        }
      } else {
        alert("Chat parser library not loaded. Please refresh the page.");
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert(
        "Error parsing file. Please ensure it's a valid WhatsApp chat export."
      );
    }
  };

  reader.readAsText(file);
}
