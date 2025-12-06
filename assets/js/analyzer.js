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
});
