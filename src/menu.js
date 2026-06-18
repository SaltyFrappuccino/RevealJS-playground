export function decorateMenuHierarchy() {
  translateMenuLabels();

  const slides = [...document.querySelectorAll(".reveal .slides section")].filter((section) => !section.querySelector("section"));
  const items = [...document.querySelectorAll(".slide-menu-items li")].filter((item) => item.classList.contains("slide-menu-item") || item.classList.contains("slide-menu-item-vertical"));

  if (!slides.length || slides.length !== items.length) return;

  let currentSection = "";

  items.forEach((item, index) => {
    const slide = slides[index];
    const title = slide.querySelector("h1, h2")?.textContent?.trim() || item.querySelector(".slide-menu-item-title")?.textContent?.trim() || "";
    const isSection = Boolean(slide.querySelector(".section-kicker"));
    const isCover = index === 0;
    const isFinal = title === "Заключение";

    item.classList.remove("menu-cover", "menu-section", "menu-child", "menu-final");

    if (isCover) {
      item.classList.add("menu-cover");
      currentSection = "";
      return;
    }

    if (isSection) {
      currentSection = title;
      item.classList.add("menu-section");
      item.dataset.section = title;
      return;
    }

    item.classList.add("menu-child");
    item.dataset.section = currentSection;

    if (isFinal) {
      item.classList.remove("menu-child");
      item.classList.add("menu-final");
    }
  });
}

function translateMenuLabels() {
  document.querySelectorAll(".slide-menu .slide-menu-toolbar-label").forEach((label) => {
    const text = label.textContent.trim().toLowerCase();
    if (text === "slides") label.textContent = "Слайды";
    if (text === "close") label.textContent = "Закрыть";
  });
}
