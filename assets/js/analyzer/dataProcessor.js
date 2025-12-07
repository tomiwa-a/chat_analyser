import { formatDate } from "./utils.js";

let parsedMessages = null;

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

function getMostActiveHour(messages) {
  if (!messages || messages.length === 0) return { hour: 0, count: 0 };

  const hourCount = {};

  messages.forEach((m) => {
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

    const responseSpeed = calculateResponseSpeed(messages, participant);
    const weekendActivity = calculateWeekendActivity(messages, participant);
    const conversationStarter = calculateConversationStarter(
      messages,
      participant
    );

    const card = document.createElement("div");
    card.className = "participant-card";
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
          <span class="participant-stat-value">--:--</span>
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
          <div class="emoji-item">
            <span class="emoji">--</span>
            <span class="emoji-count">--</span>
          </div>
        </div>
      </div>
    `;
    participantsGrid.appendChild(card);
  });
}

export function updateDashboard(messages) {
  parsedMessages = messages;
  const stats = calculateStats(messages);
  updateStatCards(stats);
  updateParticipantCards(messages, stats);
  console.log("Dashboard updated with stats:", stats);
}
