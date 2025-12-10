import { setupFileUpload } from "./analyzer/fileUpload.js";
import {
  initializeActivityZoom,
  initializeHourlyZoom,
} from "./analyzer/chartRenderer.js";

document.addEventListener("DOMContentLoaded", () => {
  setupFileUpload();
  initializeActivityZoom();
  initializeHourlyZoom();
});
