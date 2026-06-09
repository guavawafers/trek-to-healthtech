const search = document.querySelector("#librarySearch");
const filters = document.querySelectorAll(".library-filter");
const articles = document.querySelectorAll(".library-article");
const sections = document.querySelectorAll(".library-section");
const saved = new Set(JSON.parse(localStorage.getItem("savedReading") || "[]"));
localStorage.setItem("readingLibraryCount", articles.length);
let activeFilter = new URLSearchParams(window.location.search).get("filter") || "all";
if (activeFilter === "saved") {
  document.querySelector(".reading-page-hero h1").textContent = "Saved Reading";
}
const newArticleWindow = 30 * 24 * 60 * 60 * 1000;
const articleAddedDates = {
  "rock-hospital-ai": "2026-06-07",
  "rock-innovation-2026": "2026-06-07",
  "rock-h1-2025": "2026-06-07",
  "mckinsey-ai-model": "2026-06-07",
  "mckinsey-digital-transformation": "2026-06-07",
  "jmir-participatory-codesign": "2026-06-07",
  "jmir-patient-facing": "2026-06-07",
  "jmir-older-adults": "2026-06-07",
  "pmc-autistic-accessibility": "2026-06-07",
  "pmc-workflow-hf": "2026-06-07",
  "pmc-global-equity": "2026-06-07"
};

function addNewArticleBadges() {
  const now = Date.now();
  articles.forEach((article) => {
    const added = articleAddedDates[article.dataset.id];
    if (!added || now - new Date(`${added}T00:00:00`).getTime() > newArticleWindow) return;
    const badge = document.createElement("span");
    badge.className = "new-article-tag";
    badge.textContent = "New";
    article.querySelector(".article-type .tag").insertAdjacentElement("afterend", badge);
  });
}

function updateSavedUI() {
  articles.forEach((article) => article.querySelector(".save-article").classList.toggle("saved", saved.has(article.dataset.id)));
}

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  articles.forEach((article) => {
    const filterMatch = activeFilter === "all" || article.dataset.type === activeFilter || (activeFilter === "saved" && saved.has(article.dataset.id));
    const searchMatch = article.dataset.search.includes(query) || article.innerText.toLowerCase().includes(query);
    const show = filterMatch && searchMatch;
    article.classList.toggle("hidden", !show);
    if (show) visible += 1;
  });
  sections.forEach((section) => {
    const sectionVisible = [...section.querySelectorAll(".library-article")].some((article) => !article.classList.contains("hidden"));
    section.hidden = !sectionVisible;
  });
  document.querySelector("#resultCount").textContent = `${visible} ${visible === 1 ? "article" : "articles"}`;
  document.querySelector("#emptyLibrary").hidden = visible !== 0;
}

filters.forEach((button) => {
  if (button.dataset.filter === activeFilter) {
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
  }
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((filter) => filter.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});
search.addEventListener("input", applyFilters);
articles.forEach((article) => article.querySelector(".save-article").addEventListener("click", () => {
  saved.has(article.dataset.id) ? saved.delete(article.dataset.id) : saved.add(article.dataset.id);
  localStorage.setItem("savedReading", JSON.stringify([...saved]));
  updateSavedUI();
  applyFilters();
}));
addNewArticleBadges();
updateSavedUI();
applyFilters();
