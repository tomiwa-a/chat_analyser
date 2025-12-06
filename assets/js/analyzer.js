let parsedMessages = null;

// File Upload Functionality
function setupFileUpload() {
  const uploadButton = document.querySelector(".upload-card .btn-primary");
  const uploadCard = document.querySelector(".upload-card");
  const uploadSection = document.querySelector(".upload-section");
  const demoLabel = document.querySelector(".demo-label");

  if (!uploadButton || !uploadCard) return;

  // Create hidden file input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt,.zip";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // Browse files button click
  uploadButton.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  });

  // Drag and drop events
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
  // Validate file type
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

  // Validate file size (50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("File size must be less than 50MB");
    return;
  }

  // Read and parse file
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;

      // Parse using whatsapp-chat-parser
      if (typeof whatsappChatParser !== "undefined") {
        parsedMessages = whatsappChatParser.parseString(content);

        if (parsedMessages && parsedMessages.length > 0) {
          console.log("Parsed messages:", parsedMessages);

          // Hide upload section, show demo label
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

          // Update dashboard with real data
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

function updateDashboard(messages) {
  // Calculate stats
  const stats = calculateStats(messages);

  // Update stat cards
  updateStatCards(stats);

  console.log("Dashboard updated with stats:", stats);
}

function calculateStats(messages) {
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
  };
}

function updateStatCards(stats) {
  // Update total messages
  const totalMsgValue = document.querySelector(
    ".stat-card:nth-child(1) .stat-value"
  );
  if (totalMsgValue)
    totalMsgValue.textContent = stats.totalMessages.toLocaleString();

  // Update participants
  const participantsValue = document.querySelector(
    ".stat-card:nth-child(2) .stat-value"
  );
  if (participantsValue) participantsValue.textContent = stats.participants;
}

document.addEventListener("DOMContentLoaded", () => {
  // Setup file upload
  setupFileUpload();

  const chartColors = {
    primary: "#7C3AED",
    secondary: "#06B6D4",
    accent: "#10B981",
    rose: "#F43F5E",
    orange: "#F97316",
    purple: "#A78BFA",
    blue: "#38BDF8",
    green: "#34D399",
  };

  const activityCtx = document.getElementById("activityChart");
  if (activityCtx) {
    new Chart(activityCtx, {
      type: "line",
      data: {
        labels: [
          "Jan 1",
          "Jan 5",
          "Jan 10",
          "Jan 15",
          "Jan 20",
          "Jan 25",
          "Jan 30",
        ],
        datasets: [
          {
            label: "Messages",
            data: [45, 89, 120, 95, 142, 108, 156],
            borderColor: chartColors.primary,
            backgroundColor: `${chartColors.primary}20`,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const hourlyCtx = document.getElementById("hourlyChart");
  if (hourlyCtx) {
    new Chart(hourlyCtx, {
      type: "bar",
      data: {
        labels: [
          "00",
          "02",
          "04",
          "06",
          "08",
          "10",
          "12",
          "14",
          "16",
          "18",
          "20",
          "22",
        ],
        datasets: [
          {
            label: "Messages",
            data: [12, 8, 5, 15, 45, 67, 89, 123, 145, 167, 189, 98],
            backgroundColor: chartColors.secondary,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const sentimentCtx = document.getElementById("sentimentChart");
  if (sentimentCtx) {
    new Chart(sentimentCtx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            label: "Positive",
            data: [72, 78, 75, 82],
            borderColor: chartColors.accent,
            backgroundColor: `${chartColors.accent}20`,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Neutral",
            data: [20, 15, 18, 12],
            borderColor: chartColors.orange,
            backgroundColor: `${chartColors.orange}20`,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Negative",
            data: [8, 7, 7, 6],
            borderColor: chartColors.rose,
            backgroundColor: `${chartColors.rose}20`,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 15,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const lengthCtx = document.getElementById("lengthChart");
  if (lengthCtx) {
    new Chart(lengthCtx, {
      type: "doughnut",
      data: {
        labels: ["< 10 words", "10-30 words", "30-50 words", "> 50 words"],
        datasets: [
          {
            data: [340, 1205, 780, 222],
            backgroundColor: [
              chartColors.primary,
              chartColors.secondary,
              chartColors.accent,
              chartColors.rose,
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 10,
            },
          },
        },
      },
    });
  }

  const responseCtx = document.getElementById("responseChart");
  if (responseCtx) {
    new Chart(responseCtx, {
      type: "bar",
      data: {
        labels: ["John", "Jane"],
        datasets: [
          {
            label: "Avg Response (minutes)",
            data: [3.2, 4.5],
            backgroundColor: [chartColors.primary, chartColors.secondary],
            borderRadius: 8,
            barThickness: 60,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const weeklyCtx = document.getElementById("weeklyChart");
  if (weeklyCtx) {
    new Chart(weeklyCtx, {
      type: "radar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Messages",
            data: [320, 410, 380, 450, 420, 280, 190],
            borderColor: chartColors.primary,
            backgroundColor: `${chartColors.primary}20`,
            borderWidth: 2,
            pointBackgroundColor: chartColors.primary,
            pointBorderColor: "#fff",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
            angleLines: {
              color: "#E4E4E7",
            },
          },
        },
      },
    });
  }

  const monthlyCtx = document.getElementById("monthlyChart");
  if (monthlyCtx) {
    new Chart(monthlyCtx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Messages",
            data: [180, 220, 310, 290, 420, 380, 450, 390, 410, 360, 330, 280],
            borderColor: chartColors.primary,
            backgroundColor: `${chartColors.primary}20`,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const peakTimesCtx = document.getElementById("peakTimesChart");
  if (peakTimesCtx) {
    new Chart(peakTimesCtx, {
      type: "bar",
      data: {
        labels: [
          "Morning\n(6-12)",
          "Afternoon\n(12-18)",
          "Evening\n(18-24)",
          "Night\n(0-6)",
        ],
        datasets: [
          {
            label: "Messages",
            data: [420, 680, 1240, 207],
            backgroundColor: [
              chartColors.orange,
              chartColors.secondary,
              chartColors.primary,
              chartColors.purple,
            ],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const emotionCtx = document.getElementById("emotionChart");
  if (emotionCtx) {
    new Chart(emotionCtx, {
      type: "doughnut",
      data: {
        labels: ["Happy", "Excited", "Neutral", "Sad", "Angry"],
        datasets: [
          {
            data: [920, 680, 560, 250, 137],
            backgroundColor: [
              chartColors.accent,
              chartColors.orange,
              chartColors.secondary,
              chartColors.blue,
              chartColors.rose,
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 10,
            },
          },
        },
      },
    });
  }

  const conversationCtx = document.getElementById("conversationChart");
  if (conversationCtx) {
    new Chart(conversationCtx, {
      type: "bar",
      data: {
        labels: ["John", "Jane"],
        datasets: [
          {
            label: "Conversations Started",
            data: [62, 58],
            backgroundColor: [chartColors.primary, chartColors.secondary],
            borderRadius: 8,
            barThickness: 80,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const messageTypesCtx = document.getElementById("messageTypesChart");
  if (messageTypesCtx) {
    new Chart(messageTypesCtx, {
      type: "pie",
      data: {
        labels: ["Text", "Images", "Videos", "Links", "Voice Messages"],
        datasets: [
          {
            data: [1980, 320, 89, 112, 46],
            backgroundColor: [
              chartColors.primary,
              chartColors.secondary,
              chartColors.accent,
              chartColors.orange,
              chartColors.rose,
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 12,
              padding: 10,
            },
          },
        },
      },
    });
  }

  const busiestDaysCtx = document.getElementById("busiestDaysChart");
  if (busiestDaysCtx) {
    new Chart(busiestDaysCtx, {
      type: "bar",
      data: {
        labels: [
          "Jan 15",
          "Feb 3",
          "Mar 22",
          "Apr 8",
          "May 12",
          "Jun 5",
          "Jul 18",
          "Aug 9",
          "Sep 14",
          "Oct 2",
        ],
        datasets: [
          {
            label: "Messages",
            data: [89, 84, 78, 76, 73, 71, 69, 67, 65, 63],
            backgroundColor: chartColors.primary,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const avgDailyCtx = document.getElementById("avgDailyChart");
  if (avgDailyCtx) {
    new Chart(avgDailyCtx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        datasets: [
          {
            label: "Avg Messages/Day",
            data: [35, 42, 38, 45, 40, 37],
            borderColor: chartColors.secondary,
            backgroundColor: `${chartColors.secondary}30`,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: chartColors.secondary,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const weekendCtx = document.getElementById("weekendChart");
  if (weekendCtx) {
    new Chart(weekendCtx, {
      type: "bar",
      data: {
        labels: ["Weekday", "Weekend"],
        datasets: [
          {
            label: "Total Messages",
            data: [1820, 727],
            backgroundColor: [chartColors.primary, chartColors.accent],
            borderRadius: 8,
            barThickness: 100,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E4E4E7",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }
});
