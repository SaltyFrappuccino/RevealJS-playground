const interactiveSelector = [
  ".mini-card",
  ".flow div",
  ".algorithm div",
  ".file-tree div",
  ".closing-grid div",
  ".solver-card",
  ".compare-row",
  ".accent-panel",
  ".formula-wall",
  ".solver-toolbar button",
  ".solver-actions button"
].join(",");

let ready = false;
let activeElement = null;
let pointerEvent = null;
let frame = 0;

export function initInteractions() {
  if (ready) return;
  ready = true;

  document.addEventListener("pointerover", (event) => {
    const element = event.target.closest?.("[data-reactive]");
    if (!element) return;
    activeElement = element;
    element.classList.add("is-reactive");
  });

  document.addEventListener("pointerout", (event) => {
    const element = event.target.closest?.("[data-reactive]");
    if (!element) return;
    if (activeElement === element) activeElement = null;
    element.classList.remove("is-reactive");
    element.style.removeProperty("--mx");
    element.style.removeProperty("--my");
    element.style.removeProperty("--rx");
    element.style.removeProperty("--ry");
  });

  document.addEventListener("pointermove", (event) => {
    pointerEvent = event;
    if (!frame) frame = requestAnimationFrame(updateReactiveElement);
  });
}

function updateReactiveElement() {
  frame = 0;
  if (!activeElement || !pointerEvent) return;

  const rect = activeElement.getBoundingClientRect();
  const x = (pointerEvent.clientX - rect.left) / rect.width;
  const y = (pointerEvent.clientY - rect.top) / rect.height;
  activeElement.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  activeElement.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  activeElement.style.setProperty("--rx", `${((0.5 - y) * 3).toFixed(2)}deg`);
  activeElement.style.setProperty("--ry", `${((x - 0.5) * 4).toFixed(2)}deg`);
}

export function refreshInteractiveElements() {
  document.querySelectorAll(interactiveSelector).forEach((element) => {
    element.dataset.reactive = "true";
  });
}
