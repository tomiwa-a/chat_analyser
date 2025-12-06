import { setupFileUpload } from "./analyzer/fileUpload.js";
import { initializeCharts } from "./analyzer/chartRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  setupFileUpload();
  initializeCharts();
});
