import { getParticipantsList, getParsedMessages } from "./dataProcessor.js";

// Initialize date range filters for a modal
export function initializeDateRangeFilter(modalId, dateFromId, dateToId) {
  const messages = getParsedMessages();
  
  if (!messages || messages.length === 0) return;
  
  const dates = messages.map((m) => new Date(m.date));
  const maxDate = new Date(Math.max(...dates));
  const minDate = new Date(Math.min(...dates));
  
  // Set default to last 90 days or all data if less
  const defaultFromDate = new Date(maxDate);
  defaultFromDate.setDate(defaultFromDate.getDate() - 90);
  const actualFromDate = defaultFromDate < minDate ? minDate : defaultFromDate;
  
  const dateFrom = document.getElementById(dateFromId);
  const dateTo = document.getElementById(dateToId);
  
  if (dateFrom && dateTo) {
    const maxDateStr = maxDate.toISOString().split("T")[0];
    const minDateStr = minDate.toISOString().split("T")[0];
    const defaultFromStr = actualFromDate.toISOString().split("T")[0];
    
    dateFrom.value = defaultFromStr;
    dateTo.value = maxDateStr;
    dateFrom.min = minDateStr;
    dateFrom.max = maxDateStr;
    dateTo.min = minDateStr;
    dateTo.max = maxDateStr;
  }
}

// Initialize participant filters for a modal
export function initializeParticipantFilter(containerId, checkboxPrefix) {
  const participants = getParticipantsList();
  const container = document.querySelector(containerId);
  
  if (!container || participants.length === 0) return;
  
  container.innerHTML = participants
    .map(
      (p, index) => `
    <label class="checkbox-label">
      <input type="checkbox" class="participant-checkbox ${checkboxPrefix}" value="${p}" data-index="${index}">
      <span class="checkbox-custom"></span>
      <span class="participant-name">${p}</span>
    </label>
  `
    )
    .join("");
}

// Get selected participants from a modal
export function getSelectedParticipants(checkboxClass) {
  const checkboxes = document.querySelectorAll(`.${checkboxClass}:checked`);
  return Array.from(checkboxes).map((cb) => cb.value);
}

// Get filtered messages based on date range and participants
export function getFilteredMessages(dateFromId, dateToId, allParticipantsId, checkboxClass) {
  const messages = getParsedMessages();
  if (!messages) return [];
  
  const dateFrom = document.getElementById(dateFromId)?.value;
  const dateTo = document.getElementById(dateToId)?.value;
  const allParticipants = document.getElementById(allParticipantsId)?.checked;
  
  let filtered = messages;
  
  // Filter by date range
  if (dateFrom && dateTo) {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999); // Include end of day
    
    filtered = filtered.filter((m) => {
      const msgDate = new Date(m.date);
      return msgDate >= fromDate && msgDate <= toDate;
    });
  }
  
  // Filter by participants
  if (!allParticipants) {
    const selectedParticipants = getSelectedParticipants(checkboxClass);
    if (selectedParticipants.length > 0) {
      filtered = filtered.filter((m) => selectedParticipants.includes(m.author));
    }
  }
  
  return filtered;
}

// Setup modal open/close handlers
export function setupModalHandlers(
  openBtnId,
  modalId,
  closeBtnId,
  onOpen = null,
  onClose = null
) {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);
  const backdrop = modal?.querySelector(".modal-backdrop");
  
  if (!openBtn || !modal) return;
  
  const openModal = () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (onOpen) onOpen();
  };
  
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (onClose) onClose();
  };
  
  openBtn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

// Setup "All Participants" checkbox toggle
export function setupAllParticipantsToggle(allCheckboxId, individualCheckboxClass) {
  const allCheckbox = document.getElementById(allCheckboxId);
  
  if (!allCheckbox) return;
  
  allCheckbox.addEventListener("change", () => {
    const individualCheckboxes = document.querySelectorAll(`.${individualCheckboxClass}`);
    individualCheckboxes.forEach((cb) => {
      cb.disabled = allCheckbox.checked;
      if (allCheckbox.checked) {
        cb.checked = false;
      }
    });
  });
  
  // Also listen to individual checkboxes to uncheck "All" if any individual is selected
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains(individualCheckboxClass)) {
      const anyChecked = document.querySelector(`.${individualCheckboxClass}:checked`);
      if (anyChecked) {
        allCheckbox.checked = false;
      }
    }
  });
}

// Update slider value display
export function setupSliderValueDisplay(sliderId, valueDisplayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(valueDisplayId);
  
  if (!slider || !display) return;
  
  slider.addEventListener("input", () => {
    display.textContent = slider.value;
  });
}
