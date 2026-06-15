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

function sortArticlesByAddedDate(grid) {
  [...grid.querySelectorAll(".library-article")]
    .map((article, index) => {
      const added = article.dataset.added || articleAddedDates[article.dataset.id];
      const publishedText = article.dataset.published || article.querySelector(".source-row div span")?.textContent || "";
      const publishedMatch = publishedText.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}|\b\d{4}\b/);
      return {
        article,
        index,
        added: added ? new Date(added).getTime() : 0,
        published: publishedMatch ? new Date(publishedMatch[0]).getTime() : 0,
      };
    })
    .sort((a, b) => b.added - a.added || b.published - a.published || a.index - b.index)
    .forEach(({ article }) => grid.appendChild(article));
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

function generatedArticleTopic(article) {
  const text = `${article.title} ${article.summary}`.toLowerCase();
  const topics = [
    ["Accessibility", ["accessibility", "accessible", "disability", "inclusive"]],
    ["Clinical workflows", ["clinical workflow", "workflow", "clinician"]],
    ["Health equity", ["health equity", "equity", "underserved"]],
    ["Human-centered AI", ["health ai", "healthcare ai", "artificial intelligence", "human-machine", " ai "]],
    ["Patient experience", ["patient experience", "patient-facing", "patient"]],
    ["Health data", ["health data", "interoperability", "ehr"]],
    ["Product design", ["product design", "user experience", "usability", "interface", "design"]],
  ];
  return topics.find(([, terms]) => terms.some((term) => text.includes(term)))?.[0] || "Healthtech";
}

function renderGeneratedArticle(article) {
  const date = new Date(article.date);
  const addedDate = new Date(article.addedAt);
  const dateLabel = Number.isNaN(date.getTime()) ? "Recently published" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const addedLabel = Number.isNaN(addedDate.getTime()) ? "Recently added" : `Added ${addedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  return `<article class="note-card article-card ${article.type === "research" ? "research-card " : ""}library-article" data-generated="true" data-id="${escapeAttribute(article.id)}" data-type="${escapeAttribute(article.type)}" data-added="${escapeAttribute(article.addedAt?.slice(0, 10))}" data-published="${escapeAttribute(article.date)}" data-search="${escapeAttribute(`${article.title} ${article.source} ${article.summary}`.toLowerCase())}">
    <div class="source-row"><span class="source-logo ${escapeAttribute(article.sourceClass)}">${escapeHtml(article.sourceMark)}</span><div><strong>${escapeHtml(article.source)}</strong><span>Published ${dateLabel}</span></div><button class="save-article" aria-label="Save article"><svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z"/></svg></button></div>
    <div class="article-type generated-article-type"><span class="tag strategy">${generatedArticleTopic(article)}</span><span class="new-article-tag">New</span><span class="added-date-tag">${addedLabel}</span><span class="article-reading-time">${escapeHtml(article.readingTime)}</span></div>
    <h3><a href="${safeArticleUrl(article.url)}" target="_blank" rel="noopener">${escapeHtml(article.title)} <span>→</span></a></h3>
    <p>${escapeHtml(article.summary)}</p><div class="article-footer"><span>Why it matters for design</span><strong>${escapeHtml(article.designValue)}</strong></div>
  </article>`;
}

async function loadGeneratedArticles() {
  try {
    const response = await fetch("data/generated-articles.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Generated reading feed unavailable");
    const feed = await response.json();
    if (!feed.articles?.length) return;
    const newestFirst = [...feed.articles].sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    document.querySelector("#industryArticles").insertAdjacentHTML("afterbegin", newestFirst.filter((article) => article.type === "industry").map(renderGeneratedArticle).join(""));
    document.querySelector("#researchArticles").insertAdjacentHTML("afterbegin", newestFirst.filter((article) => article.type === "research").map(renderGeneratedArticle).join(""));
    [document.querySelector("#industryArticles"), document.querySelector("#researchArticles")].forEach(sortArticlesByAddedDate);
  } catch (error) {
    document.querySelector("#libraryStatus").textContent = "Showing curated reads; daily updates are temporarily unavailable";
  }
}

function addNewArticleBadges() {
  const now = Date.now();
  getArticles().forEach((article) => {
    const added = article.dataset.added || articleAddedDates[article.dataset.id];
    const age = now - new Date(`${added}T00:00:00`).getTime();
    if (!added || age < 0 || age > newArticleWindow || article.querySelector(".new-article-tag")) return;
    const badge = document.createElement("span");
    badge.className = "new-article-tag";
    badge.textContent = "New";
    article.querySelector(".article-type .tag")?.insertAdjacentElement("afterend", badge);
    if (!article.querySelector(".added-date-tag")) {
      const addedDate = new Date(`${added}T00:00:00`);
      badge.insertAdjacentHTML("afterend", `<span class="added-date-tag">Added ${addedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>`);
    }
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

document.querySelectorAll(".library-grid").forEach(sortArticlesByAddedDate);
loadGeneratedArticles().finally(() => {
  addNewArticleBadges();
  updateSavedUI();
  applyFilters();
});
