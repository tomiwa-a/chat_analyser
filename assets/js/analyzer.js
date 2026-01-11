import { setupFileUpload } from "./analyzer/fileUpload.js";
import {
  initializeActivityZoom,
  initializeHourlyZoom,
  initializeAllModals,
} from "./analyzer/chartRenderer.js";
import {
  initializeRenameParticipants,
  initializeConversationViewer,
} from "./analyzer/conversationViewer.js";

document.addEventListener("DOMContentLoaded", () => {
  setupFileUpload();
  initializeActivityZoom();
  initializeHourlyZoom();
  initializeAllModals();
  initializeRenameParticipants();
  initializeConversationViewer();
});
