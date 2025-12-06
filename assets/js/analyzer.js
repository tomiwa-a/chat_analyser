document.addEventListener("DOMContentLoaded", () => {
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
