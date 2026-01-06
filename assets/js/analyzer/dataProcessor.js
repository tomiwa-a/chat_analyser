import { formatDate } from "./utils.js";

let parsedMessages = null;

export function getParsedMessages() {
  return parsedMessages;
}

export function getParticipantsList() {
  if (!parsedMessages || parsedMessages.length === 0) return [];
  return [...new Set(parsedMessages.map((m) => m.author))].filter(Boolean);
}

function calculateLongestStreak(messages) {
  if (!messages || messages.length === 0) return 0;

  const dates = messages.map((m) => {
    const d = new Date(m.date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  });

  const uniqueDates = [...new Set(dates)].sort();

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function findBusiestDay(messages) {
  if (!messages || messages.length === 0) return { date: null, count: 0 };

  const dateCount = {};

  messages.forEach((m) => {
    const d = new Date(m.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
  });

  let maxCount = 0;
  let busiestDate = null;

  for (const [date, count] of Object.entries(dateCount)) {
    if (count > maxCount) {
      maxCount = count;
      busiestDate = date;
    }
  }

  return { date: busiestDate, count: maxCount };
}

function calculateAverageWords(messages, participant = null) {
  if (!messages || messages.length === 0) return 0;

  let filteredMessages = messages;
  if (participant) {
    filteredMessages = messages.filter((m) => m.author === participant);
  }

  const wordCounts = filteredMessages
    .filter((m) => m.message && m.message.trim() !== "")
    .map((m) => m.message.trim().split(/\s+/).length);

  if (wordCounts.length === 0) return 0;

  const sum = wordCounts.reduce((a, b) => a + b, 0);
  return sum / wordCounts.length;
}

function getMostActiveHour(messages, participant = null) {
  if (!messages || messages.length === 0) return { hour: 0, count: 0 };

  let filteredMessages = messages;
  if (participant) {
    filteredMessages = messages.filter((m) => m.author === participant);
  }

  const hourCount = {};

  filteredMessages.forEach((m) => {
    const d = new Date(m.date);
    const hour = d.getHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });

  let maxCount = 0;
  let mostActiveHour = 0;

  for (const [hour, count] of Object.entries(hourCount)) {
    if (count > maxCount) {
      maxCount = count;
      mostActiveHour = parseInt(hour);
    }
  }

  return { hour: mostActiveHour, count: maxCount };
}

function formatHourRange(hour) {
  const nextHour = (hour + 1) % 24;
  const formatHour = (h) => {
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}${period}`;
  };
  return `${formatHour(hour)}-${formatHour(nextHour)}`;
}

function calculateDailyAverage(messages) {
  if (!messages || messages.length === 0) return 0;

  const dates = [
    ...new Set(
      messages.map((m) => {
        const d = new Date(m.date);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      })
    ),
  ];

  return Math.round(messages.length / dates.length);
}

function calculateResponseSpeed(messages, participant = null) {
  if (!messages || messages.length < 2)
    return { minutes: 0, formatted: "0 min" };

  const responseTimes = [];

  for (let i = 1; i < messages.length; i++) {
    const current = messages[i];
    const previous = messages[i - 1];

    if (participant) {
      if (current.author !== participant) continue;
      if (previous.author === participant) continue;
    }

    const timeDiff = new Date(current.date) - new Date(previous.date);
    const minutes = timeDiff / (1000 * 60);

    if (minutes > 0 && minutes < 1440) {
      responseTimes.push(minutes);
    }
  }

  if (responseTimes.length === 0) return { minutes: 0, formatted: "0 min" };

  const avgMinutes =
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

  let formatted;
  if (avgMinutes < 60) {
    formatted = `${Math.round(avgMinutes)} min`;
  } else if (avgMinutes < 1440) {
    formatted = `${(avgMinutes / 60).toFixed(1)} hr`;
  } else {
    formatted = `${(avgMinutes / 1440).toFixed(1)} days`;
  }

  return { minutes: avgMinutes, formatted };
}

function calculateWeekendActivity(messages, participant) {
  const participantMessages = messages.filter((m) => m.author === participant);

  if (participantMessages.length === 0)
    return { percentage: 0, weekendCount: 0, weekdayCount: 0 };

  const weekendMessages = participantMessages.filter((m) => {
    const date = new Date(m.date);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  });

  const percentage = Math.round(
    (weekendMessages.length / participantMessages.length) * 100
  );

  return {
    percentage,
    weekendCount: weekendMessages.length,
    weekdayCount: participantMessages.length - weekendMessages.length,
  };
}

function calculateConversationStarter(messages, participant) {
  if (!messages || messages.length === 0) return { percentage: 0, started: 0 };

  const participantMessages = messages.filter((m) => m.author === participant);
  if (participantMessages.length === 0) return { percentage: 0, started: 0 };

  let conversationsStarted = 0;
  const GAP_THRESHOLD = 3 * 60 * 60 * 1000;

  for (let i = 1; i < messages.length; i++) {
    const current = messages[i];
    const previous = messages[i - 1];

    if (current.author !== participant) continue;

    const timeDiff = new Date(current.date) - new Date(previous.date);

    if (timeDiff > GAP_THRESHOLD && previous.author !== participant) {
      conversationsStarted++;
    }
  }

  if (messages[0]?.author === participant) {
    conversationsStarted++;
  }

  const totalConversations =
    conversationsStarted +
    messages.filter((m, i) => {
      if (i === 0) return false;
      const timeDiff = new Date(m.date) - new Date(messages[i - 1].date);
      return timeDiff > GAP_THRESHOLD && m.author !== participant;
    }).length;

  const percentage =
    totalConversations > 0
      ? Math.round((conversationsStarted / totalConversations) * 100)
      : 0;

  return { percentage, started: conversationsStarted };
}

function extractEmojis(text) {
  if (!text) return [];
  const emojiRegex = /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
  const emojis = text.match(emojiRegex) || [];
  return emojis;
}

function getTopEmojis(messages, participant, count = 4) {
  const emojiCount = {};

  const participantMessages = messages.filter((m) => m.author === participant);

  participantMessages.forEach((msg) => {
    const emojis = extractEmojis(msg.message || "");
    emojis.forEach((emoji) => {
      emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
    });
  });

  return Object.entries(emojiCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([emoji, count]) => ({ emoji, count }));
}

let STOPWORDS = new Set();

async function loadStopwords() {
  try {
    const response = await fetch("assets/json/english.json");
    const words = await response.json();
    STOPWORDS = new Set([
      ...words,
      "omitted",
      "media",
      "sticker",
      "image",
      "video",
      "audio",
      "document",
    ]);
  } catch (error) {
    console.warn("Could not load stopwords, using fallback");
    STOPWORDS = new Set([
      "the",
      "a",
      "an",
      "and",
      "is",
      "it",
      "to",
      "of",
      "omitted",
      "media",
    ]);
  }
}

loadStopwords();

export function calculateWordFrequency(messages, participant = null) {
  let filteredMessages = messages;
  if (participant) {
    filteredMessages = messages.filter((m) => m.author === participant);
  }

  const wordCount = {};
  let totalWords = 0;

  filteredMessages.forEach((m) => {
    if (!m.message || m.message.includes("<Media omitted>")) return;

    const words = m.message
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => {
        return word.length > 2 && !STOPWORDS.has(word) && !/^\d+$/.test(word);
      });

    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
      totalWords++;
    });
  });

  const sortedWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 60);

  return {
    words: sortedWords,
    totalWords,
    uniqueWords: Object.keys(wordCount).length,
  };
}

export function getActivityOverTime(messages, days = 30) {
  if (!messages || messages.length === 0) return { labels: [], data: [] };

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  const dateCount = {};

  messages.forEach((m) => {
    const msgDate = new Date(m.date);
    if (msgDate >= startDate) {
      const dateKey = msgDate.toISOString().split("T")[0];
      dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
    }
  });

  const labels = [];
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];

    labels.push(formatDate(date));
    data.push(dateCount[dateKey] || 0);
  }

  return { labels, data };
}

export function getHourlyActivity(messages) {
  if (!messages || messages.length === 0) {
    return { labels: [], data: [] };
  }

  const hourCount = new Array(24).fill(0);

  messages.forEach((m) => {
    const hour = new Date(m.date).getHours();
    hourCount[hour]++;
  });

  const labels = [];
  for (let i = 0; i < 24; i++) {
    const period = i >= 12 ? "PM" : "AM";
    const displayHour = i % 12 || 12;
    labels.push(`${displayHour}${period}`);
  }

  return { labels, data: hourCount };
}

export function getMonthlyActivity(messages) {
  if (!messages || messages.length === 0) {
    return { labels: [], data: [] };
  }

  const monthCount = {};

  messages.forEach((m) => {
    const date = new Date(m.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
  });

  const sortedMonths = Object.keys(monthCount).sort();
  const labels = sortedMonths.map((key) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  });
  const data = sortedMonths.map((key) => monthCount[key]);

  return { labels, data };
}

// Get monthly activity grouped by participants
export function getMonthlyActivityByParticipants(
  messages,
  selectedParticipants
) {
  if (!messages || messages.length === 0) {
    return { labels: [], datasets: [] };
  }

  const participants =
    selectedParticipants && selectedParticipants.length > 0
      ? selectedParticipants
      : getParticipantsList();

  // Get all months
  const monthSet = new Set();
  messages.forEach((m) => {
    const date = new Date(m.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthSet.add(monthKey);
  });

  const sortedMonths = Array.from(monthSet).sort();
  const labels = sortedMonths.map((key) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  });

  // Get data for each participant
  const datasets = participants.map((participant) => {
    const monthCount = {};
    messages
      .filter((m) => m.author === participant)
      .forEach((m) => {
        const date = new Date(m.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
      });

    const data = sortedMonths.map((key) => monthCount[key] || 0);
    return { participant, data };
  });

  return { labels, datasets };
}

// Get response time data for each participant
export function getResponseTimeByParticipant(messages) {
  const participants = getParticipantsList();
  const labels = [];
  const data = [];

  participants.forEach((participant) => {
    const responseSpeed = calculateResponseSpeed(messages, participant);
    // Use only first name (first word) for better display
    const firstName = participant.split(" ")[0];
    labels.push(firstName);
    data.push(responseSpeed.minutes);
  });

  return { labels, data };
}

// Get message length distribution
export function getMessageLengthDistribution(messages) {
  const buckets = {
    short: 0, // < 10 words
    medium: 0, // 10-30 words
    long: 0, // 30-50 words
    veryLong: 0, // > 50 words
  };

  messages.forEach((m) => {
    if (!m.message || m.message.trim() === "") return;
    const wordCount = m.message.trim().split(/\s+/).length;

    if (wordCount < 10) buckets.short++;
    else if (wordCount < 30) buckets.medium++;
    else if (wordCount < 50) buckets.long++;
    else buckets.veryLong++;
  });

  return {
    labels: ["< 10 words", "10-30 words", "30-50 words", "> 50 words"],
    data: [buckets.short, buckets.medium, buckets.long, buckets.veryLong],
  };
}

// Get weekly pattern (day of week distribution)
export function getWeeklyPattern(messages) {
  const dayCount = new Array(7).fill(0);

  messages.forEach((m) => {
    const day = new Date(m.date).getDay();
    dayCount[day]++;
  });

  return {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    data: dayCount,
  };
}

// Get busiest days (top 10)
export function getBusiestDays(messages, count = 10) {
  const dateCount = {};

  messages.forEach((m) => {
    const d = new Date(m.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
  });

  const sorted = Object.entries(dateCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count);

  const labels = sorted.map(([date]) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const data = sorted.map(([, count]) => count);

  return { labels, data };
}

export function renderWordCloud(wordData) {
  const canvas = document.getElementById("wordCloud");
  if (!canvas || !wordData.words.length) return;

  const colors = ["#7C3AED", "#06B6D4", "#10B981", "#F43F5E", "#F97316"];
  const canvasWidth = canvas.offsetWidth || 800;

  WordCloud(canvas, {
    list: wordData.words,
    gridSize: 16,
    weightFactor: function (size) {
      return Math.pow(size, 0.6) * 3;
    },
    fontFamily: "Inter, system-ui, sans-serif",
    color: function (word, weight) {
      return colors[Math.floor(Math.random() * colors.length)];
    },
    rotateRatio: 0.3,
    rotationSteps: 2,
    backgroundColor: "transparent",
    minSize: 10,
    drawOutOfBound: false,
    shrinkToFit: true,
  });
}

// Get average daily messages over time (by week)
export function getAverageDailyMessages(messages) {
  if (!messages || messages.length === 0) return { labels: [], data: [] };

  const dates = messages.map((m) => new Date(m.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Group by week
  const weekData = {};

  messages.forEach((m) => {
    const msgDate = new Date(m.date);
    const weekStart = new Date(msgDate);
    weekStart.setDate(msgDate.getDate() - msgDate.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weekData[weekKey]) {
      weekData[weekKey] = { count: 0, days: new Set() };
    }

    weekData[weekKey].count++;
    weekData[weekKey].days.add(msgDate.toISOString().split("T")[0]);
  });

  const sortedWeeks = Object.keys(weekData).sort();
  const labels = sortedWeeks.map((key, i) => `Week ${i + 1}`);
  const data = sortedWeeks.map((key) => {
    const daysInWeek = weekData[key].days.size;
    return Math.round(weekData[key].count / daysInWeek);
  });

  return { labels: labels.slice(-6), data: data.slice(-6) };
}

// Get weekend vs weekday data
export function getWeekendVsWeekday(messages) {
  let weekdayCount = 0;
  let weekendCount = 0;

  messages.forEach((m) => {
    const day = new Date(m.date).getDay();
    if (day === 0 || day === 6) {
      weekendCount++;
    } else {
      weekdayCount++;
    }
  });

  return {
    labels: ["Weekday", "Weekend"],
    data: [weekdayCount, weekendCount],
  };
}

// Get peak times (time of day buckets)
export function getPeakTimes(messages) {
  const timeBuckets = {
    morning: 0, // 6-12
    afternoon: 0, // 12-18
    evening: 0, // 18-24
    night: 0, // 0-6
  };

  messages.forEach((m) => {
    const hour = new Date(m.date).getHours();
    if (hour >= 6 && hour < 12) timeBuckets.morning++;
    else if (hour >= 12 && hour < 18) timeBuckets.afternoon++;
    else if (hour >= 18) timeBuckets.evening++;
    else timeBuckets.night++;
  });

  return {
    labels: [
      "Morning\n(6-12)",
      "Afternoon\n(12-18)",
      "Evening\n(18-24)",
      "Night\n(0-6)",
    ],
    data: [
      timeBuckets.morning,
      timeBuckets.afternoon,
      timeBuckets.evening,
      timeBuckets.night,
    ],
  };
}

// Get peak times grouped by participants
export function getPeakTimesByParticipants(messages, selectedParticipants) {
  const participants =
    selectedParticipants && selectedParticipants.length > 0
      ? selectedParticipants
      : getParticipantsList();

  const labels = [
    "Morning\n(6-12)",
    "Afternoon\n(12-18)",
    "Evening\n(18-24)",
    "Night\n(0-6)",
  ];

  const datasets = participants.map((participant) => {
    const timeBuckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    messages
      .filter((m) => m.author === participant)
      .forEach((m) => {
        const hour = new Date(m.date).getHours();
        if (hour >= 6 && hour < 12) timeBuckets.morning++;
        else if (hour >= 12 && hour < 18) timeBuckets.afternoon++;
        else if (hour >= 18) timeBuckets.evening++;
        else timeBuckets.night++;
      });

    return {
      participant,
      data: [
        timeBuckets.morning,
        timeBuckets.afternoon,
        timeBuckets.evening,
        timeBuckets.night,
      ],
    };
  });

  return { labels, datasets };
}

// Get weekly pattern grouped by participants
export function getWeeklyPatternByParticipants(messages, selectedParticipants) {
  const participants =
    selectedParticipants && selectedParticipants.length > 0
      ? selectedParticipants
      : getParticipantsList();

  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const datasets = participants.map((participant) => {
    const dayCount = new Array(7).fill(0);

    messages
      .filter((m) => m.author === participant)
      .forEach((m) => {
        const day = new Date(m.date).getDay();
        dayCount[day]++;
      });

    return { participant, data: dayCount };
  });

  return { labels, datasets };
}

// Get busiest days grouped by participants
export function getBusiestDaysByParticipants(
  messages,
  selectedParticipants,
  count = 10
) {
  const participants =
    selectedParticipants && selectedParticipants.length > 0
      ? selectedParticipants
      : getParticipantsList();

  // Get all unique dates
  const allDates = new Set();
  messages.forEach((m) => {
    const d = new Date(m.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    allDates.add(dateKey);
  });

  const sortedDates = Array.from(allDates).sort().slice(-count);
  const labels = sortedDates.map((date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const datasets = participants.map((participant) => {
    const dateCount = {};

    messages
      .filter((m) => m.author === participant)
      .forEach((m) => {
        const d = new Date(m.date);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
        dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
      });

    const data = sortedDates.map((date) => dateCount[date] || 0);
    return { participant, data };
  });

  return { labels, datasets };
}

// Get average daily messages grouped by participants
export function getAverageDailyMessagesByParticipants(
  messages,
  selectedParticipants
) {
  const participants =
    selectedParticipants && selectedParticipants.length > 0
      ? selectedParticipants
      : getParticipantsList();

  if (!messages || messages.length === 0) return { labels: [], datasets: [] };

  const dates = messages.map((m) => new Date(m.date));

  // Group by week
  const weekKeys = new Set();
  messages.forEach((m) => {
    const msgDate = new Date(m.date);
    const weekStart = new Date(msgDate);
    weekStart.setDate(msgDate.getDate() - msgDate.getDay());
    weekKeys.add(weekStart.toISOString().split("T")[0]);
  });

  const sortedWeeks = Array.from(weekKeys).sort().slice(-6);
  const labels = sortedWeeks.map((key, i) => `Week ${i + 1}`);

  const datasets = participants.map((participant) => {
    const weekData = {};

    messages
      .filter((m) => m.author === participant)
      .forEach((m) => {
        const msgDate = new Date(m.date);
        const weekStart = new Date(msgDate);
        weekStart.setDate(msgDate.getDate() - msgDate.getDay());
        const weekKey = weekStart.toISOString().split("T")[0];

        if (!weekData[weekKey]) {
          weekData[weekKey] = { count: 0, days: new Set() };
        }

        weekData[weekKey].count++;
        weekData[weekKey].days.add(msgDate.toISOString().split("T")[0]);
      });

    const data = sortedWeeks.map((key) => {
      if (!weekData[key]) return 0;
      const daysInWeek = weekData[key].days.size;
      return Math.round(weekData[key].count / daysInWeek);
    });

    return { participant, data };
  });

  return { labels, datasets };
}

// Get weekend vs weekday grouped by participants
export function getWeekendVsWeekdayByParticipants(
  messages,
  selectedParticipants
) {
  const participants =
    selectedParticipants && selectedParticipants.length > 0
      ? selectedParticipants
      : getParticipantsList();

  const labels = ["Weekday", "Weekend"];

  const datasets = participants.map((participant) => {
    let weekdayCount = 0;
    let weekendCount = 0;

    messages
      .filter((m) => m.author === participant)
      .forEach((m) => {
        const day = new Date(m.date).getDay();
        if (day === 0 || day === 6) {
          weekendCount++;
        } else {
          weekdayCount++;
        }
      });

    return { participant, data: [weekdayCount, weekendCount] };
  });

  return { labels, datasets };
}

// Get conversation snippets (sample exchanges)
export function getConversationSnippets(messages, count = 1) {
  if (!messages || messages.length < 4) return [];

  const snippets = [];
  const participants = getParticipantsList();

  if (participants.length < 2) return [];

  // Find exchanges where participants alternate
  for (let i = 0; i < messages.length - 3 && snippets.length < count; i++) {
    const exchange = messages.slice(i, i + 4);

    // Check if it's a good exchange (alternating participants)
    const authors = exchange.map((m) => m.author);
    const hasExchange = authors[0] !== authors[1] || authors[2] !== authors[3];

    if (
      hasExchange &&
      exchange.every((m) => m.message && !m.message.includes("<Media omitted>"))
    ) {
      snippets.push(exchange);
    }
  }

  return snippets;
}

// Update conversation snippets display
function updateConversationSnippets(snippets) {
  const container = document.querySelector(".chat-briefs-section");
  if (!container || snippets.length === 0) return;

  const participants = getParticipantsList();

  container.innerHTML = snippets
    .map((exchange) => {
      const messagesHTML = exchange
        .map((msg) => {
          const isFirstParticipant = msg.author === participants[0];
          const time = new Date(msg.date).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });

          return `
        <div class="chat-message ${isFirstParticipant ? "sent" : "received"}">
          <div class="message-bubble">
            <p>${msg.message}</p>
            <span class="message-time">${time}</span>
          </div>
        </div>
      `;
        })
        .join("");

      return `
      <div class="chat-brief-card compact">
        <div class="chat-messages">
          ${messagesHTML}
        </div>
      </div>
    `;
    })
    .join("");
}

// Export data as JSON
export function exportAsJSON(messages, stats) {
  const exportData = {
    exportDate: new Date().toISOString(),
    statistics: stats,
    messages: messages.map((m) => ({
      date: m.date,
      author: m.author,
      message: m.message,
    })),
    charts: {
      activityOverTime: getActivityOverTime(messages, 30),
      hourlyActivity: getHourlyActivity(messages),
      monthlyActivity: getMonthlyActivity(messages),
      weeklyPattern: getWeeklyPattern(messages),
      peakTimes: getPeakTimes(messages),
      weekendVsWeekday: getWeekendVsWeekday(messages),
    },
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat-analysis-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Setup export button handlers
function setupExportButtons(messages, stats) {
  const jsonBtn = document.querySelector(".export-buttons .btn-primary");
  const pdfBtn = document.querySelector(".export-buttons .btn-secondary");

  if (jsonBtn) {
    // Remove old listeners
    const newJsonBtn = jsonBtn.cloneNode(true);
    jsonBtn.parentNode.replaceChild(newJsonBtn, jsonBtn);

    newJsonBtn.addEventListener("click", () => {
      exportAsJSON(messages, stats);
    });
  }

  if (pdfBtn) {
    // Remove old listeners
    const newPdfBtn = pdfBtn.cloneNode(true);
    pdfBtn.parentNode.replaceChild(newPdfBtn, pdfBtn);

    newPdfBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

export function calculateStats(messages) {
  const participants = [...new Set(messages.map((m) => m.author))].filter(
    Boolean
  );

  return {
    totalMessages: messages.length,
    participants: participants.length,
    participantsList: participants,
    dateRange: {
      start: messages[0]?.date,
      end: messages[messages.length - 1]?.date,
    },
    longestStreak: calculateLongestStreak(messages),
    busiestDay: findBusiestDay(messages),
    mostActiveHour: getMostActiveHour(messages),
    dailyAverage: calculateDailyAverage(messages),
    responseSpeed: calculateResponseSpeed(messages),
    averageWords: calculateAverageWords(messages),
  };
}

export function updateStatCards(stats) {
  const totalMsgValue = document.querySelector(
    ".stat-card:nth-child(1) .stat-value"
  );
  if (totalMsgValue)
    totalMsgValue.textContent = stats.totalMessages.toLocaleString();

  const participantsValue = document.querySelector(
    ".stat-card:nth-child(2) .stat-value"
  );
  if (participantsValue) participantsValue.textContent = stats.participants;

  const streakValue = document.querySelector(
    ".kpi-card:nth-child(1) .kpi-value"
  );
  const streakLabel = document.querySelector(
    ".kpi-card:nth-child(1) .kpi-sublabel"
  );
  if (streakValue) streakValue.textContent = `${stats.longestStreak} days`;
  if (streakLabel) streakLabel.textContent = "Consecutive days chatting";

  const busiestValue = document.querySelector(
    ".kpi-card:nth-child(2) .kpi-value"
  );
  const busiestLabel = document.querySelector(
    ".kpi-card:nth-child(2) .kpi-sublabel"
  );
  if (busiestValue) busiestValue.textContent = stats.busiestDay.count;
  if (busiestLabel && stats.busiestDay.date) {
    const dateObj = new Date(stats.busiestDay.date);
    busiestLabel.textContent = `Messages on ${formatDate(dateObj)}`;
  }

  const activeHourValue = document.querySelector(
    ".kpi-card:nth-child(3) .kpi-value"
  );
  const activeHourLabel = document.querySelector(
    ".kpi-card:nth-child(3) .kpi-sublabel"
  );
  if (activeHourValue)
    activeHourValue.textContent = formatHourRange(stats.mostActiveHour.hour);
  if (activeHourLabel) {
    activeHourLabel.textContent = `${stats.mostActiveHour.count} messages in this hour`;
  }

  const wordsValue = document.querySelector(
    ".kpi-card:nth-child(4) .kpi-value"
  );
  const wordsLabel = document.querySelector(
    ".kpi-card:nth-child(4) .kpi-sublabel"
  );
  if (wordsValue) wordsValue.textContent = Math.round(stats.averageWords);
  if (wordsLabel) wordsLabel.textContent = "Overall average";

  const dailyAvgValue = document.querySelector(
    ".kpi-card:nth-child(5) .kpi-value"
  );
  if (dailyAvgValue) dailyAvgValue.textContent = stats.dailyAverage;

  const responseSpeedValue = document.querySelector(
    ".kpi-card:nth-child(6) .kpi-value"
  );
  if (responseSpeedValue)
    responseSpeedValue.textContent = stats.responseSpeed.formatted;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(index) {
  const colors = ["purple", "blue", "green", "orange", "rose"];
  return colors[index % colors.length];
}

export function updateParticipantCards(messages, stats) {
  const participantsGrid = document.querySelector(".participants-grid");
  if (!participantsGrid) return;

  participantsGrid.innerHTML = "";

  stats.participantsList.forEach((participant, index) => {
    const participantMessages = messages.filter(
      (m) => m.author === participant
    );
    const messageCount = participantMessages.length;
    const percentage = ((messageCount / stats.totalMessages) * 100).toFixed(1);
    const avgWords = calculateAverageWords(messages, participant);

    const mostActiveHour = getMostActiveHour(messages, participant);
    const responseSpeed = calculateResponseSpeed(messages, participant);
    const weekendActivity = calculateWeekendActivity(messages, participant);
    const conversationStarter = calculateConversationStarter(
      messages,
      participant
    );
    const topEmojis = getTopEmojis(messages, participant, 4);

    const card = document.createElement("div");
    card.className = "participant-card";

    const emojiListHTML =
      topEmojis.length > 0
        ? topEmojis
            .map(
              ({ emoji, count }) => `
          <div class="emoji-item">
            <span class="emoji">${emoji}</span>
            <span class="emoji-count">${count}</span>
          </div>
        `
            )
            .join("")
        : `<div class="emoji-item">
           <span class="emoji">--</span>
           <span class="emoji-count">--</span>
         </div>`;

    card.innerHTML = `
      <div class="participant-header">
        <div class="participant-avatar ${getAvatarColor(index)}">${getInitials(
      participant
    )}</div>
        <div class="participant-info">
          <h3 class="participant-name">${participant}</h3>
          <p class="participant-meta">${messageCount.toLocaleString()} messages • ${percentage}%</p>
        </div>
      </div>
      <div class="participant-stats">
        <div class="participant-stat">
          <span class="participant-stat-label">Avg Length</span>
          <span class="participant-stat-value">${Math.round(
            avgWords
          )} words</span>
        </div>
        <div class="participant-stat">
          <span class="participant-stat-label">Most Active</span>
          <span class="participant-stat-value">${formatHourRange(
            mostActiveHour.hour
          )}</span>
        </div>
        <div class="participant-stat">
          <span class="participant-stat-label">Sentiment</span>
          <span class="participant-stat-value positive">--</span>
        </div>
      </div>
      <div class="participant-kpis">
        <div class="participant-kpi-card">
          <div class="participant-kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14H11L11 21L20 10L13 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="participant-kpi-content">
            <span class="participant-kpi-value">${
              responseSpeed.formatted
            }</span>
            <span class="participant-kpi-label">Response Speed</span>
          </div>
        </div>
        <div class="participant-kpi-card">
          <div class="participant-kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 5 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="participant-kpi-content">
            <span class="participant-kpi-value">${
              weekendActivity.percentage
            }% Weekend</span>
            <span class="participant-kpi-label">Activity Split</span>
          </div>
        </div>
        <div class="participant-kpi-card">
          <div class="participant-kpi-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="participant-kpi-content">
            <span class="participant-kpi-value">${
              conversationStarter.percentage
            }%</span>
            <span class="participant-kpi-label">Starts Convos</span>
          </div>
        </div>
      </div>
      <div class="participant-emojis">
        <h4 class="participant-emoji-title">Top Emojis</h4>
        <div class="emoji-list">
          ${emojiListHTML}
        </div>
      </div>
    `;
    participantsGrid.appendChild(card);
  });
}

export function updateDashboard(messages) {
  parsedMessages = messages;
  const stats = calculateStats(messages);
  const wordFreq = calculateWordFrequency(messages);

  const chartData = {
    activityOverTime: getActivityOverTime(messages, 30),
    hourlyActivity: getHourlyActivity(messages),
    monthlyActivity: getMonthlyActivity(messages),
    responseTimeByParticipant: getResponseTimeByParticipant(messages),
    messageLengthDistribution: getMessageLengthDistribution(messages),
    weeklyPattern: getWeeklyPattern(messages),
    busiestDays: getBusiestDays(messages),
    averageDailyMessages: getAverageDailyMessages(messages),
    weekendVsWeekday: getWeekendVsWeekday(messages),
    peakTimes: getPeakTimes(messages),
    conversationSnippets: getConversationSnippets(messages),
  };

  updateStatCards(stats);
  updateParticipantCards(messages, stats);
  renderWordCloud(wordFreq);

  // Show chart cards
  document.querySelectorAll(".chart-card").forEach((card) => {
    card.style.display = "block";
  });

  // Update conversation snippets section
  updateConversationSnippets(chartData.conversationSnippets);

  // Setup export buttons
  setupExportButtons(messages, stats);

  import("./chartRenderer.js").then((module) => {
    module.initializeCharts(chartData);
  });

  console.log("Dashboard updated with stats:", stats);
  console.log("Chart data:", chartData);
}
