import { setupFileUpload } from "./analyzer/fileUpload.js";
import { initializeActivityZoom } from "./analyzer/chartRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  setupFileUpload();
  initializeActivityZoom();
});
