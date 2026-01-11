// Shared participant name mapping state
let participantNameMap = {};

export function setParticipantName(original, displayName) {
  if (displayName && displayName !== original) {
    participantNameMap[original] = displayName;
  } else {
    delete participantNameMap[original];
  }
}

export function getDisplayName(originalName) {
  return participantNameMap[originalName] || originalName;
}

export function getAllMappings() {
  return { ...participantNameMap };
}

export function clearMappings() {
  participantNameMap = {};
}

// Update all participant name displays across the page
export function refreshAllParticipantNames() {
  // Update participant name spans in modal filters
  document.querySelectorAll(".participant-name[data-original]").forEach((el) => {
    const original = el.dataset.original;
    if (original) {
      el.textContent = getDisplayName(original);
    }
  });

  // Update participant cards
  document.querySelectorAll(".participant-card").forEach((card) => {
    const nameEl = card.querySelector(".participant-name");
    const avatarEl = card.querySelector(".participant-avatar");
    if (nameEl) {
      const original = nameEl.dataset.original || nameEl.textContent;
      const displayName = getDisplayName(original);
      nameEl.textContent = displayName;
      nameEl.dataset.original = original;
      
      // Update avatar initials
      if (avatarEl) {
        const initials = displayName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        avatarEl.textContent = initials;
      }
    }
  });
}
