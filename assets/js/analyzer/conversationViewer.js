import { getParsedMessages, getParticipantsList } from "./dataProcessor.js";
import { getParticipantColor } from "./utils.js";
import { 
  getDisplayName, 
  setParticipantName, 
  refreshAllParticipantNames 
} from "./participantNames.js";

// Re-export getDisplayName for backward compatibility
export { getDisplayName } from "./participantNames.js";

let currentPage = 0;
const PAGE_SIZE = 50;
let filteredMessages = [];

export function initializeRenameParticipants() {
  const btn = document.getElementById("renameParticipantsBtn");
  const modal = document.getElementById("renameParticipantsModal");
  const closeBtn = document.getElementById("closeRenameModal");
  const cancelBtn = document.getElementById("cancelRename");
  const saveBtn = document.getElementById("saveRename");
  const backdrop = modal?.querySelector(".modal-backdrop");

  if (!btn || !modal) return;

  btn.addEventListener("click", () => {
    openRenameModal();
  });

  const close = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };
  
  closeBtn?.addEventListener("click", close);
  cancelBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  saveBtn?.addEventListener("click", () => {
    saveParticipantNames();
    close();
  });
}

function openRenameModal() {
  const modal = document.getElementById("renameParticipantsModal");
  const container = document.getElementById("renameParticipantsContainer");
  
  if (!modal || !container) return;

  const participants = getParticipantsList();

  if (!participants || participants.length === 0) {
    container.innerHTML = '<p class="no-data-message">No participants found. Please upload a chat file first.</p>';
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    return;
  }

  container.innerHTML = participants
    .map((participant, index) => {
      const displayName = getDisplayName(participant);
      const color = getParticipantColor(index);
      const initials = displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return `
        <div class="rename-participant-item">
          <div class="rename-participant-avatar" style="background-color: ${color}">
            ${initials}
          </div>
          <div class="rename-participant-info">
            <label>Original: ${participant}</label>
            <input 
              type="text" 
              class="rename-participant-input filter-input" 
              data-original="${participant}"
              value="${displayName}"
              placeholder="Enter display name"
            />
          </div>
        </div>
      `;
    })
    .join("");

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function saveParticipantNames() {
  const inputs = document.querySelectorAll(".rename-participant-input");
  
  inputs.forEach((input) => {
    const original = input.dataset.original;
    const newName = input.value.trim();
    setParticipantName(original, newName);
  });

  // Update all participant name displays across the page
  refreshAllParticipantNames();
  
  // Update conversation viewer if open
  if (document.getElementById("conversationViewerModal")?.classList.contains("active")) {
    renderConversationMessages();
  }
}

export function initializeConversationViewer() {
  const btn = document.getElementById("viewFullConversationBtn");
  const modal = document.getElementById("conversationViewerModal");
  const closeBtn = document.getElementById("closeConversationModal");
  const backdrop = modal?.querySelector(".modal-backdrop");

  if (!btn || !modal) return;

  btn.addEventListener("click", () => {
    openConversationViewer();
  });

  const close = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };
  
  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  // Filter controls
  document.getElementById("applyConversationFilters")?.addEventListener("click", applyFilters);
  document.getElementById("clearConversationFilters")?.addEventListener("click", clearFilters);
  document.getElementById("loadMoreMessages")?.addEventListener("click", loadMoreMessages);
  
  // Live search with debounce
  const searchInput = document.getElementById("conversationSearch");
  searchInput?.addEventListener("input", debounce(applyFilters, 300));
}

function openConversationViewer() {
  const modal = document.getElementById("conversationViewerModal");
  if (!modal) return;

  // Populate participant filter
  const participantSelect = document.getElementById("conversationParticipant");
  if (participantSelect) {
    const participants = getParticipantsList();
    participantSelect.innerHTML = `
      <option value="all">All Participants</option>
      ${participants.map((p) => `<option value="${p}">${getDisplayName(p)}</option>`).join("")}
    `;
  }

  // Set date range to full conversation
  const messages = getParsedMessages();
  if (messages && messages.length > 0) {
    const dates = messages.map((m) => new Date(m.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const dateFrom = document.getElementById("conversationDateFrom");
    const dateTo = document.getElementById("conversationDateTo");

    if (dateFrom && dateTo) {
      dateFrom.value = minDate.toISOString().split("T")[0];
      dateTo.value = maxDate.toISOString().split("T")[0];
    }
  }

  currentPage = 0;
  applyFilters();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function applyFilters() {
  const messages = getParsedMessages();
  if (!messages || messages.length === 0) {
    const container = document.getElementById("conversationMessagesList");
    if (container) {
      container.innerHTML = '<div class="no-data-message">No messages found. Please upload a chat file first.</div>';
    }
    return;
  }

  const searchTerm = document.getElementById("conversationSearch")?.value.toLowerCase() || "";
  const dateFrom = document.getElementById("conversationDateFrom")?.value;
  const dateTo = document.getElementById("conversationDateTo")?.value;
  const participant = document.getElementById("conversationParticipant")?.value;
  const sortOrder = document.getElementById("conversationSort")?.value;

  // Filter messages
  filteredMessages = messages.filter((msg) => {
    // Search filter
    if (searchTerm && !msg.message?.toLowerCase().includes(searchTerm)) {
      return false;
    }

    // Date filter
    if (dateFrom || dateTo) {
      const msgDate = new Date(msg.date);
      if (dateFrom && msgDate < new Date(dateFrom)) return false;
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59);
        if (msgDate > endDate) return false;
      }
    }

    // Participant filter
    if (participant && participant !== "all" && msg.author !== participant) {
      return false;
    }

    return true;
  });

  // Sort messages
  if (sortOrder === "newest") {
    filteredMessages = [...filteredMessages].reverse();
  }

  // Update stats
  const countEl = document.getElementById("conversationCount");
  const matchesEl = document.getElementById("conversationMatches");
  const matchCountEl = document.getElementById("matchCount");

  if (countEl) countEl.textContent = filteredMessages.length;
  
  if (searchTerm && matchesEl && matchCountEl) {
    matchesEl.style.display = "inline";
    matchCountEl.textContent = filteredMessages.length;
  } else if (matchesEl) {
    matchesEl.style.display = "none";
  }

  currentPage = 0;
  renderConversationMessages();
}

function renderConversationMessages() {
  const container = document.getElementById("conversationMessagesList");
  const loadMoreBtn = document.getElementById("loadMoreMessages");
  
  if (!container) return;

  const startIdx = 0;
  const endIdx = (currentPage + 1) * PAGE_SIZE;
  const messagesToShow = filteredMessages.slice(startIdx, endIdx);

  if (messagesToShow.length === 0) {
    container.innerHTML = '<div class="no-data-message">No messages found matching your filters.</div>';
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    return;
  }

  const participants = getParticipantsList();

  container.innerHTML = messagesToShow
    .map((msg) => {
      const participantIndex = participants.indexOf(msg.author);
      const color = getParticipantColor(participantIndex >= 0 ? participantIndex : 0);
      const displayName = getDisplayName(msg.author);
      const initials = displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const date = new Date(msg.date);
      const timeString = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return `
        <div class="conversation-message">
          <div class="message-avatar" style="background-color: ${color}">${initials}</div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-author">${escapeHtml(displayName)}</span>
              <span class="message-timestamp">${dateString} at ${timeString}</span>
            </div>
            <div class="message-text">${escapeHtml(msg.message || "<media omitted>")}</div>
          </div>
        </div>
      `;
    })
    .join("");

  // Show/hide load more button
  if (loadMoreBtn) {
    loadMoreBtn.style.display = endIdx < filteredMessages.length ? "block" : "none";
  }
}

function loadMoreMessages() {
  currentPage++;
  renderConversationMessages();
}

function clearFilters() {
  const searchInput = document.getElementById("conversationSearch");
  const participantSelect = document.getElementById("conversationParticipant");
  const sortSelect = document.getElementById("conversationSort");
  
  if (searchInput) searchInput.value = "";
  if (participantSelect) participantSelect.value = "all";
  if (sortSelect) sortSelect.value = "oldest";
  
  // Reset date range to full conversation
  const messages = getParsedMessages();
  if (messages && messages.length > 0) {
    const dates = messages.map((m) => new Date(m.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const dateFrom = document.getElementById("conversationDateFrom");
    const dateTo = document.getElementById("conversationDateTo");
    
    if (dateFrom) dateFrom.value = minDate.toISOString().split("T")[0];
    if (dateTo) dateTo.value = maxDate.toISOString().split("T")[0];
  }

  applyFilters();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
