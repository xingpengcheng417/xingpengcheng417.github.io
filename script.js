const themeButton = document.querySelector(".theme-toggle");
let savedTheme;
try {
  savedTheme = localStorage.getItem("resume-theme");
} catch {
  // The page remains usable when browser storage is unavailable.
}
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let theme =
  savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemTheme.matches
      ? "dark"
      : "light";

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute(
    "aria-label",
    theme === "dark" ? "切换到浅色主题" : "切换到深色主题",
  );
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#141922" : "#f7f8fa";
}
applyTheme();
themeButton.hidden = false;
themeButton.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
  try {
    localStorage.setItem("resume-theme", theme);
  } catch {
    // Theme switching also works without persistence.
  }
});

const filters = document.querySelector(".project-filters");
filters.hidden = false;
filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  for (const filter of filters.querySelectorAll("button")) {
    const active = filter === button;
    filter.classList.toggle("active", active);
    filter.setAttribute("aria-pressed", String(active));
  }
  for (const project of document.querySelectorAll(".project")) {
    project.hidden =
      button.dataset.filter !== "all" &&
      project.dataset.category !== button.dataset.filter;
  }
});

if ("IntersectionObserver" in window) {
  const navLinks = [...document.querySelectorAll(".nav a")];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navLinks) {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
  );
  for (const link of navLinks)
    observer.observe(document.querySelector(link.hash));
}
