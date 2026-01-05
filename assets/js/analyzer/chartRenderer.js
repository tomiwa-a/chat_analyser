import { chartColors } from "./utils.js";
import {
  getParsedMessages,
  getParticipantsList,
  getActivityOverTime,
  getHourlyActivity,
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

  const lengthCtx = document.getElementById("lengthChart");
  if (lengthCtx && chartData.messageLengthDistribution) {
    chartInstances.length = new Chart(lengthCtx, {
      type: "doughnut",
      data: {
        labels: chartData.messageLengthDistribution.labels,
        datasets: [
          {
            data: chartData.messageLengthDistribution.data,
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
  if (responseCtx && chartData.responseTimeByParticipant) {
    chartInstances.response = new Chart(responseCtx, {
      type: "bar",
      data: {
        labels: chartData.responseTimeByParticipant.labels,
        datasets: [
          {
            label: "Avg Response (minutes)",
            data: chartData.responseTimeByParticipant.data,
            backgroundColor: chartData.responseTimeByParticipant.labels.map((_, i) => 
              [chartColors.primary, chartColors.secondary, chartColors.accent, chartColors.orange, chartColors.rose][i % 5]
            ),
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
  if (weeklyCtx && chartData.weeklyPattern) {
    chartInstances.weekly = new Chart(weeklyCtx, {
      type: "radar",
      data: {
        labels: chartData.weeklyPattern.labels,
        datasets: [
          {
            label: "Messages",
            data: chartData.weeklyPattern.data,
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
            ticks: {
              display: false
            },
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
  if (peakTimesCtx && chartData.peakTimes) {
    chartInstances.peakTimes = new Chart(peakTimesCtx, {
      type: "bar",
      data: {
        labels: chartData.peakTimes.labels,
        datasets: [
          {
            label: "Messages",
            data: chartData.peakTimes.data,
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

  const busiestDaysCtx = document.getElementById("busiestDaysChart");
  if (busiestDaysCtx && chartData.busiestDays) {
    chartInstances.busiestDays = new Chart(busiestDaysCtx, {
      type: "bar",
      data: {
        labels: chartData.busiestDays.labels,
        datasets: [
          {
            label: "Messages",
            data: chartData.busiestDays.data,
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
  if (avgDailyCtx && chartData.averageDailyMessages) {
    chartInstances.avgDaily = new Chart(avgDailyCtx, {
      type: "line",
      data: {
        labels: chartData.averageDailyMessages.labels,
        datasets: [
          {
            label: "Avg Messages/Day",
            data: chartData.averageDailyMessages.data,
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
  if (weekendCtx && chartData.weekendVsWeekday) {
    chartInstances.weekend = new Chart(weekendCtx, {
      type: "bar",
      data: {
        labels: chartData.weekendVsWeekday.labels,
        datasets: [
          {
            label: "Total Messages",
            data: chartData.weekendVsWeekday.data,
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

let hourlyChartInstances = [];

export function initializeHourlyZoom() {
  const zoomBtn = document.getElementById("hourlyZoomBtn");
  const modal = document.getElementById("hourlyChartModal");
  const closeBtn = document.getElementById("closeHourlyModal");
  const backdrop = modal?.querySelector(".modal-backdrop");
  const applyFiltersBtn = document.getElementById("applyHourlyFilters");
  const resetFiltersBtn = document.getElementById("resetHourlyFilters");

  if (!zoomBtn || !modal) return;

  zoomBtn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    initializeHourlyFilters();
    renderHourlyModalCharts();
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    hourlyChartInstances.forEach((chart) => chart?.destroy());
    hourlyChartInstances = [];
  };

  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  applyFiltersBtn?.addEventListener("click", applyHourlyDateFilters);
  resetFiltersBtn?.addEventListener("click", resetHourlyFilters);
}

function initializeHourlyFilters() {
  const messages = getParsedMessages();

  if (messages && messages.length > 0) {
    const dates = messages.map((m) => new Date(m.date));
    const maxDate = new Date(Math.max(...dates));
    const minDate = new Date(maxDate);
    minDate.setDate(minDate.getDate() - 90);

    const absoluteMinDate = new Date(Math.min(...dates));

    const dateFrom = document.getElementById("hourlyDateFrom");
    const dateTo = document.getElementById("hourlyDateTo");

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
    const modal = document.getElementById("hourlyChartModal");
    const individualContainer = modal?.querySelector(
      ".individual-participants-hourly"
    );

    if (individualContainer && participants.length > 0) {
      individualContainer.innerHTML = participants
        .map(
          (p, index) => `
        <label class="checkbox-label">
          <input type="checkbox" class="participant-checkbox-hourly" value="${p}" data-index="${index}">
          <span class="checkbox-custom"></span>
          <span class="participant-name">${p}</span>
        </label>
      `
        )
        .join("");

      setupHourlyParticipantListeners();
    }
  }
}

function setupHourlyParticipantListeners() {
  const allCheckbox = document.getElementById("hourlyAllParticipants");
  const individualCheckboxes = document.querySelectorAll(
    ".participant-checkbox-hourly"
  );

  allCheckbox?.addEventListener("change", () => {
    if (allCheckbox.checked) {
      individualCheckboxes.forEach((cb) => (cb.checked = false));
      renderHourlyModalCharts();
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

      renderHourlyModalCharts();
    });
  });
}

function renderHourlyModalCharts() {
  const messages = getParsedMessages();
  if (!messages || messages.length === 0) return;

  const dateFromInput = document.getElementById("hourlyDateFrom");
  const dateToInput = document.getElementById("hourlyDateTo");

  if (!dateFromInput?.value || !dateToInput?.value) return;

  const dateFrom = new Date(dateFromInput.value);
  const dateTo = new Date(dateToInput.value);
  dateTo.setHours(23, 59, 59, 999);

  const filteredMessages = messages.filter((m) => {
    const msgDate = new Date(m.date);
    return msgDate >= dateFrom && msgDate <= dateTo;
  });

  const allCheckbox = document.getElementById("hourlyAllParticipants");
  const individualCheckboxes = Array.from(
    document.querySelectorAll(".participant-checkbox-hourly:checked")
  );

  const container = document.getElementById("hourlyChartsContainer");
  container.innerHTML = "";

  hourlyChartInstances.forEach((chart) => chart?.destroy());
  hourlyChartInstances = [];

  if (allCheckbox.checked) {
    const chartData = getHourlyActivityForMessages(filteredMessages);
    createHourlyChart(container, "All Participants", chartData, "#7C3AED");
  } else if (individualCheckboxes.length > 0) {
    individualCheckboxes.forEach((cb) => {
      const participant = cb.value;
      const participantMessages = filteredMessages.filter(
        (m) => m.author === participant
      );
      const chartData = getHourlyActivityForMessages(participantMessages);
      const colorIndex = parseInt(cb.dataset.index);
      const color = PARTICIPANT_COLORS[colorIndex % PARTICIPANT_COLORS.length];
      createHourlyChart(container, participant, chartData, color);
    });
  }
}

function getHourlyActivityForMessages(messages) {
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

function createHourlyChart(container, title, chartData, color) {
  const chartWrapper = document.createElement("div");
  chartWrapper.className = "hourly-participant-chart";
  chartWrapper.innerHTML = `
    <h4>${title}</h4>
    <canvas class="hourly-chart-canvas"></canvas>
  `;
  container.appendChild(chartWrapper);

  const canvas = chartWrapper.querySelector("canvas");
  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Messages",
          data: chartData.data,
          backgroundColor: `${color}40`,
          borderColor: color,
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => items[0].label,
            label: (item) => `${item.parsed.y} messages`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#E4E4E7" },
          ticks: { precision: 0 },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });

  hourlyChartInstances.push(chart);
}

function applyHourlyDateFilters() {
  renderHourlyModalCharts();
}

function resetHourlyFilters() {
  const allCheckbox = document.getElementById("hourlyAllParticipants");
  const individualCheckboxes = document.querySelectorAll(
    ".participant-checkbox-hourly"
  );

  allCheckbox.checked = true;
  individualCheckboxes.forEach((cb) => (cb.checked = false));

  initializeHourlyFilters();
  renderHourlyModalCharts();
}

// Import modal utilities
import {
  setupModalHandlers,
  initializeDateRangeFilter,
  initializeParticipantFilter,
  setupAllParticipantsToggle,
  getFilteredMessages,
  setupSliderValueDisplay
} from "./modalUtils.js";

import {
  getMonthlyActivity,
  getPeakTimes,
  getMessageLengthDistribution,
  getResponseTimeByParticipant,
  getWeeklyPattern,
  getBusiestDays,
  getAverageDailyMessages,
  getWeekendVsWeekday,
  calculateWordFrequency,
  renderWordCloud as renderWordCloudData
} from "./dataProcessor.js";

let modalChartInstances = {};

// Initialize all modals
export function initializeAllModals() {
  initializeMonthlyModal();
  initializePeakTimesModal();
  initializeLengthModal();
  initializeResponseModal();
  initializeWeeklyModal();
  initializeBusiestDaysModal();
  initializeAvgDailyModal();
  initializeWeekendModal();
  initializeWordCloudModal();
}

// Monthly Activity Modal
function initializeMonthlyModal() {
  setupModalHandlers(
    "monthlyZoomBtn",
    "monthlyChartModal",
    "closeMonthlyModal",
    () => {
      initializeDateRangeFilter("monthlyChartModal", "monthlyDateFrom", "monthlyDateTo");
      initializeParticipantFilter(".individual-participants-monthly", "participant-checkbox-monthly");
      setupAllParticipantsToggle("monthlyAllParticipants", "participant-checkbox-monthly");
      renderMonthlyModalChart();
    }
  );
  
  document.getElementById("applyMonthlyFilters")?.addEventListener("click", renderMonthlyModalChart);
  document.getElementById("resetMonthlyFilters")?.addEventListener("click", () => {
    document.getElementById("monthlyAllParticipants").checked = true;
    initializeDateRangeFilter("monthlyChartModal", "monthlyDateFrom", "monthlyDateTo");
    renderMonthlyModalChart();
  });
}

function renderMonthlyModalChart() {
  const filtered = getFilteredMessages(
    "monthlyDateFrom",
    "monthlyDateTo",
    "monthlyAllParticipants",
    "participant-checkbox-monthly"
  );
  
  const chartData = getMonthlyActivity(filtered);
  const canvas = document.getElementById("monthlyChartModal-canvas");
  
  if (modalChartInstances.monthly) {
    modalChartInstances.monthly.destroy();
  }
  
  modalChartInstances.monthly = new Chart(canvas, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [{
        label: "Messages",
        data: chartData.data,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        fill: true,
        tension: 0.4,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Peak Times Modal
function initializePeakTimesModal() {
  setupModalHandlers(
    "peakTimesZoomBtn",
    "peakTimesChartModal",
    "closePeakTimesModal",
    () => {
      initializeDateRangeFilter("peakTimesChartModal", "peakTimesDateFrom", "peakTimesDateTo");
      initializeParticipantFilter(".individual-participants-peakTimes", "participant-checkbox-peakTimes");
      setupAllParticipantsToggle("peakTimesAllParticipants", "participant-checkbox-peakTimes");
      renderPeakTimesModalChart();
    }
  );
  
  document.getElementById("applyPeakTimesFilters")?.addEventListener("click", renderPeakTimesModalChart);
  document.getElementById("resetPeakTimesFilters")?.addEventListener("click", () => {
    document.getElementById("peakTimesAllParticipants").checked = true;
    document.getElementById("peakTimesChartType").value = "bar";
    initializeDateRangeFilter("peakTimesChartModal", "peakTimesDateFrom", "peakTimesDateTo");
    renderPeakTimesModalChart();
  });
  
  document.getElementById("peakTimesChartType")?.addEventListener("change", renderPeakTimesModalChart);
}

function renderPeakTimesModalChart() {
  const filtered = getFilteredMessages(
    "peakTimesDateFrom",
    "peakTimesDateTo",
    "peakTimesAllParticipants",
    "participant-checkbox-peakTimes"
  );
  
  const chartData = getPeakTimes(filtered);
  const chartType = document.getElementById("peakTimesChartType")?.value || "bar";
  const canvas = document.getElementById("peakTimesChartModal-canvas");
  
  if (modalChartInstances.peakTimes) {
    modalChartInstances.peakTimes.destroy();
  }
  
  modalChartInstances.peakTimes = new Chart(canvas, {
    type: chartType,
    data: {
      labels: chartData.labels,
      datasets: [{
        label: "Messages",
        data: chartData.data,
        backgroundColor: [
          chartColors.orange,
          chartColors.secondary,
          chartColors.primary,
          chartColors.purple
        ],
        borderRadius: chartType === "bar" ? 8 : 0,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: chartType === "doughnut" ? {} : {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Message Length Modal
function initializeLengthModal() {
  setupModalHandlers(
    "lengthZoomBtn",
    "lengthChartModal",
    "closeLengthModal",
    () => {
      initializeDateRangeFilter("lengthChartModal", "lengthDateFrom", "lengthDateTo");
      initializeParticipantFilter(".individual-participants-length", "participant-checkbox-length");
      setupAllParticipantsToggle("lengthAllParticipants", "participant-checkbox-length");
      renderLengthModalChart();
    }
  );
  
  document.getElementById("applyLengthFilters")?.addEventListener("click", renderLengthModalChart);
  document.getElementById("resetLengthFilters")?.addEventListener("click", () => {
    document.getElementById("lengthAllParticipants").checked = true;
    initializeDateRangeFilter("lengthChartModal", "lengthDateFrom", "lengthDateTo");
    renderLengthModalChart();
  });
}

function renderLengthModalChart() {
  const filtered = getFilteredMessages(
    "lengthDateFrom",
    "lengthDateTo",
    "lengthAllParticipants",
    "participant-checkbox-length"
  );
  
  const chartData = getMessageLengthDistribution(filtered);
  const canvas = document.getElementById("lengthChartModal-canvas");
  
  if (modalChartInstances.length) {
    modalChartInstances.length.destroy();
  }
  
  modalChartInstances.length = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.data,
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.accent,
          chartColors.rose
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 12, padding: 10 } }
      }
    }
  });
}

// Response Time Modal
function initializeResponseModal() {
  setupModalHandlers(
    "responseZoomBtn",
    "responseChartModal",
    "closeResponseModal",
    () => {
      initializeDateRangeFilter("responseChartModal", "responseDateFrom", "responseDateTo");
      renderResponseModalChart();
    }
  );
  
  document.getElementById("applyResponseFilters")?.addEventListener("click", renderResponseModalChart);
  document.getElementById("resetResponseFilters")?.addEventListener("click", () => {
    document.getElementById("responseTimeUnit").value = "minutes";
    initializeDateRangeFilter("responseChartModal", "responseDateFrom", "responseDateTo");
    renderResponseModalChart();
  });
  
  document.getElementById("responseTimeUnit")?.addEventListener("change", renderResponseModalChart);
}

function renderResponseModalChart() {
  const filtered = getFilteredMessages(
    "responseDateFrom",
    "responseDateTo",
    "allParticipants", // Not used for response time
    "participant-checkbox"
  );
  
  const chartData = getResponseTimeByParticipant(filtered);
  const timeUnit = document.getElementById("responseTimeUnit")?.value || "minutes";
  const canvas = document.getElementById("responseChartModal-canvas");
  
  // Convert data based on time unit
  const convertedData = chartData.data.map(minutes => {
    if (timeUnit === "hours") return minutes / 60;
    if (timeUnit === "days") return minutes / 1440;
    return minutes;
  });
  
  if (modalChartInstances.response) {
    modalChartInstances.response.destroy();
  }
  
  modalChartInstances.response = new Chart(canvas, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [{
        label: `Avg Response (${timeUnit})`,
        data: convertedData,
        backgroundColor: chartData.labels.map((_, i) => 
          [chartColors.primary, chartColors.secondary, chartColors.accent, chartColors.orange, chartColors.rose][i % 5]
        ),
        borderRadius: 8,
        barThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Weekly Pattern Modal
function initializeWeeklyModal() {
  setupModalHandlers(
    "weeklyZoomBtn",
    "weeklyChartModal",
    "closeWeeklyModal",
    () => {
      initializeDateRangeFilter("weeklyChartModal", "weeklyDateFrom", "weeklyDateTo");
      initializeParticipantFilter(".individual-participants-weekly", "participant-checkbox-weekly");
      setupAllParticipantsToggle("weeklyAllParticipants", "participant-checkbox-weekly");
      renderWeeklyModalChart();
    }
  );
  
  document.getElementById("applyWeeklyFilters")?.addEventListener("click", renderWeeklyModalChart);
  document.getElementById("resetWeeklyFilters")?.addEventListener("click", () => {
    document.getElementById("weeklyAllParticipants").checked = true;
    initializeDateRangeFilter("weeklyChartModal", "weeklyDateFrom", "weeklyDateTo");
    renderWeeklyModalChart();
  });
}

function renderWeeklyModalChart() {
  const filtered = getFilteredMessages(
    "weeklyDateFrom",
    "weeklyDateTo",
    "weeklyAllParticipants",
    "participant-checkbox-weekly"
  );
  
  const chartData = getWeeklyPattern(filtered);
  const canvas = document.getElementById("weeklyChartModal-canvas");
  
  if (modalChartInstances.weekly) {
    modalChartInstances.weekly.destroy();
  }
  
  modalChartInstances.weekly = new Chart(canvas, {
    type: "radar",
    data: {
      labels: chartData.labels,
      datasets: [{
        label: "Messages",
        data: chartData.data,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        borderWidth: 2,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: "#fff",
        pointRadius: 4
      }]
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
          ticks: { display: false }
        }
      }
    }
  });
}

// Busiest Days Modal
function initializeBusiestDaysModal() {
  setupModalHandlers(
    "busiestDaysZoomBtn",
    "busiestDaysChartModal",
    "closeBusiestDaysModal",
    () => {
      initializeDateRangeFilter("busiestDaysChartModal", "busiestDaysDateFrom", "busiestDaysDateTo");
      initializeParticipantFilter(".individual-participants-busiestDays", "participant-checkbox-busiestDays");
      setupAllParticipantsToggle("busiestDaysAllParticipants", "participant-checkbox-busiestDays");
      setupSliderValueDisplay("busiestDaysTopN", "busiestDaysTopNValue");
      renderBusiestDaysModalChart();
    }
  );
  
  document.getElementById("applyBusiestDaysFilters")?.addEventListener("click", renderBusiestDaysModalChart);
  document.getElementById("resetBusiestDaysFilters")?.addEventListener("click", () => {
    document.getElementById("busiestDaysAllParticipants").checked = true;
    document.getElementById("busiestDaysTopN").value = "10";
    document.getElementById("busiestDaysTopNValue").textContent = "10";
    initializeDateRangeFilter("busiestDaysChartModal", "busiestDaysDateFrom", "busiestDaysDateTo");
    renderBusiestDaysModalChart();
  });
  
  document.getElementById("busiestDaysTopN")?.addEventListener("input", renderBusiestDaysModalChart);
}

function renderBusiestDaysModalChart() {
  const filtered = getFilteredMessages(
    "busiestDaysDateFrom",
    "busiestDaysDateTo",
    "busiestDaysAllParticipants",
    "participant-checkbox-busiestDays"
  );
  
  const topN = parseInt(document.getElementById("busiestDaysTopN")?.value || "10");
  const chartData = getBusiestDays(filtered, topN);
  const canvas = document.getElementById("busiestDaysChartModal-canvas");
  
  if (modalChartInstances.busiestDays) {
    modalChartInstances.busiestDays.destroy();
  }
  
  modalChartInstances.busiestDays = new Chart(canvas, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [{
        label: "Messages",
        data: chartData.data,
        backgroundColor: chartColors.primary,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Average Daily Messages Modal
function initializeAvgDailyModal() {
  setupModalHandlers(
    "avgDailyZoomBtn",
    "avgDailyChartModal",
    "closeAvgDailyModal",
    () => {
      initializeDateRangeFilter("avgDailyChartModal", "avgDailyDateFrom", "avgDailyDateTo");
      initializeParticipantFilter(".individual-participants-avgDaily", "participant-checkbox-avgDaily");
      setupAllParticipantsToggle("avgDailyAllParticipants", "participant-checkbox-avgDaily");
      renderAvgDailyModalChart();
    }
  );
  
  document.getElementById("applyAvgDailyFilters")?.addEventListener("click", renderAvgDailyModalChart);
  document.getElementById("resetAvgDailyFilters")?.addEventListener("click", () => {
    document.getElementById("avgDailyAllParticipants").checked = true;
    document.getElementById("avgDailyGrouping").value = "weekly";
    initializeDateRangeFilter("avgDailyChartModal", "avgDailyDateFrom", "avgDailyDateTo");
    renderAvgDailyModalChart();
  });
  
  document.getElementById("avgDailyGrouping")?.addEventListener("change", renderAvgDailyModalChart);
}

function renderAvgDailyModalChart() {
  const filtered = getFilteredMessages(
    "avgDailyDateFrom",
    "avgDailyDateTo",
    "avgDailyAllParticipants",
    "participant-checkbox-avgDaily"
  );
  
  const chartData = getAverageDailyMessages(filtered);
  const canvas = document.getElementById("avgDailyChartModal-canvas");
  
  if (modalChartInstances.avgDaily) {
    modalChartInstances.avgDaily.destroy();
  }
  
  modalChartInstances.avgDaily = new Chart(canvas, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [{
        label: "Avg Messages/Day",
        data: chartData.data,
        borderColor: chartColors.secondary,
        backgroundColor: `${chartColors.secondary}30`,
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: chartColors.secondary
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Weekend vs Weekday Modal
function initializeWeekendModal() {
  setupModalHandlers(
    "weekendZoomBtn",
    "weekendChartModal",
    "closeWeekendModal",
    () => {
      initializeDateRangeFilter("weekendChartModal", "weekendDateFrom", "weekendDateTo");
      initializeParticipantFilter(".individual-participants-weekend", "participant-checkbox-weekend");
      setupAllParticipantsToggle("weekendAllParticipants", "participant-checkbox-weekend");
      renderWeekendModalChart();
    }
  );
  
  document.getElementById("applyWeekendFilters")?.addEventListener("click", renderWeekendModalChart);
  document.getElementById("resetWeekendFilters")?.addEventListener("click", () => {
    document.getElementById("weekendAllParticipants").checked = true;
    document.getElementById("weekendChartType").value = "bar";
    initializeDateRangeFilter("weekendChartModal", "weekendDateFrom", "weekendDateTo");
    renderWeekendModalChart();
  });
  
  document.getElementById("weekendChartType")?.addEventListener("change", renderWeekendModalChart);
}

function renderWeekendModalChart() {
  const filtered = getFilteredMessages(
    "weekendDateFrom",
    "weekendDateTo",
    "weekendAllParticipants",
    "participant-checkbox-weekend"
  );
  
  const chartData = getWeekendVsWeekday(filtered);
  const chartType = document.getElementById("weekendChartType")?.value || "bar";
  const canvas = document.getElementById("weekendChartModal-canvas");
  
  if (modalChartInstances.weekend) {
    modalChartInstances.weekend.destroy();
  }
  
  modalChartInstances.weekend = new Chart(canvas, {
    type: chartType === "grouped" ? "bar" : chartType,
    data: {
      labels: chartData.labels,
      datasets: [{
        label: "Total Messages",
        data: chartData.data,
        backgroundColor: [chartColors.primary, chartColors.accent],
        borderRadius: chartType === "bar" || chartType === "grouped" ? 8 : 0,
        barThickness: 100,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: chartType === "doughnut" ? {} : {
        y: { beginAtZero: true, grid: { color: "#E4E4E7" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Word Cloud Modal
function initializeWordCloudModal() {
  setupModalHandlers(
    "wordCloudZoomBtn",
    "wordCloudModal",
    "closeWordCloudModal",
    () => {
      initializeDateRangeFilter("wordCloudModal", "wordCloudDateFrom", "wordCloudDateTo");
      initializeParticipantFilter(".individual-participants-wordCloud", "participant-checkbox-wordCloud");
      setupAllParticipantsToggle("wordCloudAllParticipants", "participant-checkbox-wordCloud");
      setupSliderValueDisplay("wordCloudMinLength", "wordCloudMinLengthValue");
      renderWordCloudModal();
    }
  );
  
  document.getElementById("applyWordCloudFilters")?.addEventListener("click", renderWordCloudModal);
  document.getElementById("resetWordCloudFilters")?.addEventListener("click", () => {
    document.getElementById("wordCloudAllParticipants").checked = true;
    document.getElementById("wordCloudCount").value = "50";
    document.getElementById("wordCloudMinLength").value = "3";
    document.getElementById("wordCloudMinLengthValue").textContent = "3";
    initializeDateRangeFilter("wordCloudModal", "wordCloudDateFrom", "wordCloudDateTo");
    renderWordCloudModal();
  });
  
  document.getElementById("wordCloudCount")?.addEventListener("change", renderWordCloudModal);
  document.getElementById("wordCloudMinLength")?.addEventListener("input", renderWordCloudModal);
}

function renderWordCloudModal() {
  const filtered = getFilteredMessages(
    "wordCloudDateFrom",
    "wordCloudDateTo",
    "wordCloudAllParticipants",
    "participant-checkbox-wordCloud"
  );
  
  const wordCount = parseInt(document.getElementById("wordCloudCount")?.value || "50");
  const wordData = calculateWordFrequency(filtered);
  
  // Limit to top N words
  wordData.words = wordData.words.slice(0, wordCount);
  
  const canvas = document.getElementById("wordCloudModal-canvas");
  if (canvas) {
    // Clear canvas
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render word cloud
    renderWordCloudData(wordData);
  }
}
