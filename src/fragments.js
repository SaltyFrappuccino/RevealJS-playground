const selectors = [
  ".flow > div",
  ".algorithm > div",
  ".file-tree > div",
  ".closing-grid > div",
  ".three-columns > .mini-card",
  ".two-columns.compact > div"
];

export function initFragments() {
  let changed = false;
  document.querySelectorAll(".reveal .slides section").forEach((slide) => {
    let index = 0;
    selectors.forEach((selector) => {
      slide.querySelectorAll(selector).forEach((element) => {
        if (element.classList.contains("fragment")) return;
        element.classList.add("fragment", "highlight-current-blue");
        element.dataset.fragmentIndex = String(index);
        changed = true;
        index += 1;
      });
    });
  });

  if (changed) Reveal.sync();
}
