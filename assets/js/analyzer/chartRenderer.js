import { chartColors } from "./utils.js";
import {
  getParsedMessages,
  getParticipantsList,
  getActivityOverTime,
} from "./dataProcessor.js";

let chartInstances = {};
let modalChartInstance = null;

export function initializeCharts(chartData = {}) {
  Object.values(chartInstances).forEach((chart) => {
    if (chart) chart.destroy();
  });
  chartInstances = {};

  const activityCtx = document.getElementById("activityChart");
  if (activityCtx && chartData.activityOverTime) {
    chartInstances.activity = new Chart(activityCtx, {
      type: "line",
      data: {
        labels: chartData.activityOverTime.labels,
        datasets: [
          {
            label: "Messages",
            data: chartData.activityOverTime.data,
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  const hourlyCtx = document.getElementById("hourlyChart");
  if (hourlyCtx && chartData.hourlyActivity) {
    chartInstances.hourly = new Chart(hourlyCtx, {
      type: "bar",
      data: {
        labels: chartData.hourlyActivity.labels,
        datasets: [
          {
            label: "Messages",
            data: chartData.hourlyActivity.data,
            backgroundColor: chartColors.secondary,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } },
        },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 10 } },
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true,
            grid: { color: "#E4E4E7" },
            angleLines: { color: "#E4E4E7" },
          },
        },
      },
    });
  }

  const monthlyCtx = document.getElementById("monthlyChart");
  if (monthlyCtx && chartData.monthlyActivity) {
    chartInstances.monthly = new Chart(monthlyCtx, {
      type: "line",
      data: {
        labels: chartData.monthlyActivity.labels,
        datasets: [
          {
            label: "Messages",
            data: chartData.monthlyActivity.data,
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 10 } },
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
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
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
          x: { grid: { display: false } },
        },
      },
    });
  }
}

const PARTICIPANT_COLORS = [
  "#6366F1",
  "#06B6D4",
  "#10B981",
  "#F97316",
  "#F43F5E",
];

export function initializeActivityZoom() {
  const zoomBtn = document.getElementById("activityZoomBtn");
  const modal = document.getElementById("activityChartModal");
  const closeBtn = document.getElementById("closeActivityModal");
  const backdrop = modal?.querySelector(".modal-backdrop");
  const applyFiltersBtn = document.getElementById("applyFilters");
  const resetFiltersBtn = document.getElementById("resetFilters");

  if (!zoomBtn || !modal) return;

  zoomBtn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    initializeModalFilters();
    renderModalChart();
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  applyFiltersBtn?.addEventListener("click", applyDateFilters);
  resetFiltersBtn?.addEventListener("click", resetFilters);
}

function initializeModalFilters() {
  const messages = getParsedMessages();

  if (messages && messages.length > 0) {
    const dates = messages.map((m) => new Date(m.date));
    const maxDate = new Date(Math.max(...dates));
    const minDate = new Date(maxDate);
    minDate.setDate(minDate.getDate() - 90);

    const absoluteMinDate = new Date(Math.min(...dates));

    const dateFrom = document.getElementById("dateFrom");
    const dateTo = document.getElementById("dateTo");

    if (dateFrom && dateTo) {
      const defaultFromStr = minDate.toISOString().split("T")[0];
      const maxDateStr = maxDate.toISOString().split("T")[0];
      const absoluteMinStr = absoluteMinDate.toISOString().split("T")[0];

      dateFrom.value = defaultFromStr;
      dateTo.value = maxDateStr;
      dateFrom.min = absoluteMinStr;
      dateFrom.max = maxDateStr;
      dateTo.min = absoluteMinStr;
      dateTo.max = maxDateStr;
    }

    const participants = getParticipantsList();
    const modal = document.getElementById("activityChartModal");
    const individualContainer = modal?.querySelector(
      ".individual-participants"
    );

    if (individualContainer && participants.length > 0) {
      individualContainer.innerHTML = participants
        .map(
          (p, index) => `
        <label class="checkbox-label">
          <input type="checkbox" class="participant-checkbox" value="${p}" data-index="${index}">
          <span class="checkbox-custom"></span>
          <span class="participant-name">${p}</span>
        </label>
      `
        )
        .join("");

      setupParticipantListeners();
    }
  }
}

function setupParticipantListeners() {
  const allCheckbox = document.getElementById("allParticipants");
  const individualCheckboxes = document.querySelectorAll(
    ".participant-checkbox"
  );

  allCheckbox?.addEventListener("change", () => {
    if (allCheckbox.checked) {
      individualCheckboxes.forEach((cb) => (cb.checked = false));
      updateChartFromCheckboxes();
    }
  });

  individualCheckboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      if (cb.checked) {
        allCheckbox.checked = false;
      }

      const anyChecked = Array.from(individualCheckboxes).some(
        (checkbox) => checkbox.checked
      );
      if (!anyChecked) {
        allCheckbox.checked = true;
      }

      updateChartFromCheckboxes();
    });
  });
}

function updateChartFromCheckboxes() {
  const messages = getParsedMessages();
  if (!messages || messages.length === 0) return;

  const dateFromInput = document.getElementById("dateFrom");
  const dateToInput = document.getElementById("dateTo");

  if (!dateFromInput?.value || !dateToInput?.value) return;

  const dateFrom = new Date(dateFromInput.value);
  const dateTo = new Date(dateToInput.value);
  dateTo.setHours(23, 59, 59, 999);

  const allCheckbox = document.getElementById("allParticipants");
  const individualCheckboxes = Array.from(
    document.querySelectorAll(".participant-checkbox:checked")
  );

  const daysDiff = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24)) + 1;

  if (allCheckbox.checked) {
    const filteredMessages = messages.filter((m) => {
      const msgDate = new Date(m.date);
      return msgDate >= dateFrom && msgDate <= dateTo;
    });

    const chartData = getActivityOverTimeCustom(
      filteredMessages,
      dateFrom,
      daysDiff
    );
    updateModalChartSingle(chartData);
  } else if (individualCheckboxes.length > 0) {
    const datasets = individualCheckboxes.map((cb) => {
      const participant = cb.value;
      const participantMessages = messages.filter((m) => {
        const msgDate = new Date(m.date);
        const dateMatch = msgDate >= dateFrom && msgDate <= dateTo;
        const participantMatch = m.author === participant;
        return dateMatch && participantMatch;
      });

      const colorIndex = parseInt(cb.dataset.index);
      const chartData = getActivityOverTimeCustom(
        participantMessages,
        dateFrom,
        daysDiff
      );

      return {
        label: participant,
        data: chartData.data,
        borderColor: PARTICIPANT_COLORS[colorIndex % PARTICIPANT_COLORS.length],
        backgroundColor: `${
          PARTICIPANT_COLORS[colorIndex % PARTICIPANT_COLORS.length]
        }20`,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      };
    });

    const firstData = getActivityOverTimeCustom([], dateFrom, daysDiff);
    updateModalChartMultiple(firstData.labels, datasets);
  }
}

function applyDateFilters() {
  updateChartFromCheckboxes();
}

function resetFilters() {
  const allCheckbox = document.getElementById("allParticipants");
  const individualCheckboxes = document.querySelectorAll(
    ".participant-checkbox"
  );

  allCheckbox.checked = true;
  individualCheckboxes.forEach((cb) => (cb.checked = false));

  initializeModalFilters();
  renderModalChart();
}

function getActivityOverTimeCustom(messages, startDate, days) {
  const dateCount = {};

  messages.forEach((m) => {
    const msgDate = new Date(m.date);
    const dateKey = msgDate.toISOString().split("T")[0];
    dateCount[dateKey] = (dateCount[dateKey] || 0) + 1;
  });

  const labels = [];
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split("T")[0];

    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    labels.push(`${month} ${day}`);
    data.push(dateCount[dateKey] || 0);
  }

  return { labels, data };
}

function updateModalChartSingle(chartData) {
  if (modalChartInstance) {
    modalChartInstance.data.labels = chartData.labels;
    modalChartInstance.data.datasets = [
      {
        label: "All Participants",
        data: chartData.data,
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124, 58, 237, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ];
    modalChartInstance.options.plugins.legend.display = false;
    modalChartInstance.update();
  }
}

function updateModalChartMultiple(labels, datasets) {
  if (modalChartInstance) {
    modalChartInstance.data.labels = labels;
    modalChartInstance.data.datasets = datasets;
    modalChartInstance.options.plugins.legend.display = true;
    modalChartInstance.update();
  }
}

function renderModalChart() {
  const canvas = document.getElementById("activityChartModal-canvas");
  if (!canvas) return;

  const messages = getParsedMessages();
  let chartData;

  if (messages && messages.length > 0) {
    chartData = getActivityOverTime(messages, 90);
  } else {
    chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      data: [320, 410, 380, 450, 420, 380, 460, 490],
    };
  }

  if (modalChartInstance) {
    modalChartInstance.destroy();
  }

  modalChartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "All Participants",
          data: chartData.data,
          borderColor: "#7C3AED",
          backgroundColor: "rgba(124, 58, 237, 0.2)",
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
          position: "top",
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } },
      },
    },
  });
}
