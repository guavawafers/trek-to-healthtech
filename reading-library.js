const search = document.querySelector("#librarySearch");
const filters = document.querySelectorAll(".library-filter");
const saved = new Set(JSON.parse(localStorage.getItem("savedReading") || "[]"));
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

function getArticles() {
  return document.querySelectorAll(".library-article");
}

function getSections() {
  return document.querySelectorAll(".library-section");
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value || "";
  return element.innerHTML;
}

function escapeAttribute(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function safeArticleUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? escapeAttribute(url.href) : "#";
  } catch {
    return "#";
  }
}

function renderGeneratedArticle(article) {
  const date = new Date(article.date);
  const addedDate = new Date(article.addedAt);
  const dateLabel = Number.isNaN(date.getTime()) ? "Recently published" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const addedLabel = Number.isNaN(addedDate.getTime()) ? "Recently added" : `Added to library ${addedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  return `<article class="note-card article-card ${article.type === "research" ? "research-card " : ""}library-article" data-id="${escapeAttribute(article.id)}" data-type="${escapeAttribute(article.type)}" data-added="${escapeAttribute(article.addedAt?.slice(0, 10))}" data-search="${escapeAttribute(`${article.title} ${article.source} ${article.summary}`.toLowerCase())}">
    <div class="source-row"><span class="source-logo ${escapeAttribute(article.sourceClass)}">${escapeHtml(article.sourceMark)}</span><div><strong>${escapeHtml(article.source)}</strong><span>Published ${dateLabel} · ${addedLabel}</span></div><button class="save-article" aria-label="Save article"><svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z"/></svg></button></div>
    <div class="article-type"><span class="tag strategy">${escapeHtml(article.label)}</span><span>${escapeHtml(article.readingTime)}</span></div>
    <h3><a href="${safeArticleUrl(article.url)}" target="_blank" rel="noopener">${escapeHtml(article.title)} <span>→</span></a></h3>
    <p>${escapeHtml(article.summary)}</p><div class="article-footer"><span>Why it matters for design</span><strong>${escapeHtml(article.designValue)}</strong></div>
  </article>`;
}

async function loadDailyArticles() {
  try {
    const response = await fetch("data/generated-articles.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Generated reading feed unavailable");
    const feed = await response.json();
    if (!feed.articles?.length) return;
    document.querySelector("#dailyArticles").innerHTML = feed.articles.map(renderGeneratedArticle).join("");
    document.querySelector(".daily-reading-section").hidden = false;
    document.querySelector("#dailyUpdatedAt").textContent = `Updated ${new Date(feed.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  } catch (error) {
    document.querySelector("#libraryStatus").textContent = "Showing curated reads; daily updates are temporarily unavailable";
  }
}

function addNewArticleBadges() {
  const now = Date.now();
  getArticles().forEach((article) => {
    const added = article.dataset.added || articleAddedDates[article.dataset.id];
    const age = now - new Date(`${added}T00:00:00`).getTime();
    if (!added || age < 0 || age > newArticleWindow) return;
    const badge = document.createElement("span");
    badge.className = "new-article-tag";
    badge.textContent = "New";
    article.querySelector(".article-type .tag").insertAdjacentElement("afterend", badge);
  });
}

function updateSavedUI() {
  getArticles().forEach((article) => article.querySelector(".save-article").classList.toggle("saved", saved.has(article.dataset.id)));
}

function applyFilters() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;
  getArticles().forEach((article) => {
    const filterMatch = activeFilter === "all" || article.dataset.type === activeFilter || (activeFilter === "saved" && saved.has(article.dataset.id));
    const searchMatch = article.dataset.search.includes(query) || article.innerText.toLowerCase().includes(query);
    const show = filterMatch && searchMatch;
    article.classList.toggle("hidden", !show);
    if (show) visible += 1;
  });
  getSections().forEach((section) => {
    const sectionVisible = [...section.querySelectorAll(".library-article")].some((article) => !article.classList.contains("hidden"));
    section.hidden = !sectionVisible;
  });
  document.querySelector("#resultCount").textContent = `${visible} ${visible === 1 ? "article" : "articles"}`;
  document.querySelector("#emptyLibrary").hidden = visible !== 0;
  localStorage.setItem("readingLibraryCount", getArticles().length);
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
document.querySelector(".reading-library-page").addEventListener("click", (event) => {
  const button = event.target.closest(".save-article");
  if (!button) return;
  const article = button.closest(".library-article");
  saved.has(article.dataset.id) ? saved.delete(article.dataset.id) : saved.add(article.dataset.id);
  localStorage.setItem("savedReading", JSON.stringify([...saved]));
  updateSavedUI();
  applyFilters();
});

loadDailyArticles().finally(() => {
  addNewArticleBadges();
  updateSavedUI();
  applyFilters();
});
