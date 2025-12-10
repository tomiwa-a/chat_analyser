import { setupFileUpload } from "./analyzer/fileUpload.js";
import {
  initializeActivityZoom,
  initializeHourlyZoom,
} from "./analyzer/chartRenderer.js";

function initializeConsentModal() {
  const unlockBtn = document.getElementById("unlockInsightsBtn");
  const modal = document.getElementById("consentModal");
  const closeBtn = document.getElementById("closeConsentModal");
  const cancelBtn = document.getElementById("cancelConsent");
  const backdrop = modal?.querySelector(".modal-backdrop");
  const checkbox = document.getElementById("consentCheckbox");
  const googleBtn = document.getElementById("continueGoogle");
  const emailBtn = document.getElementById("continueEmail");

  if (!modal || !unlockBtn) return;

  const openModal = () => modal.classList.add("active");
  const closeModal = () => modal.classList.remove("active");

  unlockBtn.addEventListener("click", openModal);
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  checkbox?.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    if (googleBtn) googleBtn.disabled = !isChecked;
    if (emailBtn) emailBtn.disabled = !isChecked;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupFileUpload();
  initializeActivityZoom();
  initializeHourlyZoom();
  initializeConsentModal();
});
