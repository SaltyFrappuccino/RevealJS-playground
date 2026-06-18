import { renderDocumentMath } from "./core/latex.js";
import { initSolver } from "./ui.js?v=20260618";
import { initFragments } from "./fragments.js?v=20260618";
import { initInteractions, refreshInteractiveElements } from "./interactions.js?v=20260618";
import { decorateMenuHierarchy } from "./menu.js?v=20260618";

Reveal.initialize({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: "c/t",
  width: 1280,
  height: 720,
  margin: 0.045,
  minScale: 0.2,
  maxScale: 1.7,
  transition: "slide",
  backgroundTransition: "fade",
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMenu],
  menu: {
    side: "left",
    width: "390px",
    numbers: "c/t",
    titleSelector: "h1, h2",
    useTextContentForMissingTitles: true,
    hideMissingTitles: false,
    markers: true,
    openButton: true,
    openSlideNumber: false,
    keyboard: true,
    themes: false,
    transitions: false
  }
}).then(() => {
  renderDocumentMath();
  initSolver();
  initFragments();
  initInteractions();
  decorateMenuHierarchy();
  refreshInteractiveElements();
});

Reveal.on("slidechanged", () => {
  renderDocumentMath();
  initSolver();
  initFragments();
  decorateMenuHierarchy();
  refreshInteractiveElements();
});

document.querySelector(".reveal")?.addEventListener("menu-ready", () => {
  decorateMenuHierarchy();
});
