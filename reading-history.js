const historyList = document.querySelector("#historyList");
const starterHistory = [
  { title: "Designing digital patient experiences", source: "TU Delft Research", date: "June 4, 2026", url: "https://research.tudelft.nl/en/publications/designing-digital-patient-experiences-the-digital-health-design-f" },
  { title: "Q1 2025 market overview: Ready, set, leap", source: "Rock Health", date: "May 29, 2026", url: "https://rockhealth.com/insights/q1-2025-market-overview-ready-set-leap/" }
];
const history = JSON.parse(localStorage.getItem("readingHistory") || JSON.stringify(starterHistory));
const emptyHistory = document.querySelector("#emptyHistory");
const knownArticleUrls = Object.fromEntries(starterHistory.map((item) => [item.title, item.url]));

function formatMarkedRead(item) {
  if (!item.markedAt) return item.date;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(item.markedAt));
}

function renderHistory() {
  historyList.replaceChildren();

  history.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "history-item";
    const url = item.url || knownArticleUrls[item.title];
    const title = url ? `<a class="history-article-link" href="${url}" target="_blank" rel="noopener">${item.title} <span>→</span></a>` : `<strong>${item.title}</strong>`;
    article.innerHTML = `<span class="history-check">✓</span><div>${title}<span>${item.source}</span></div><div class="history-actions"><time>Marked read · ${formatMarkedRead(item)}</time><button type="button" class="undo-read" data-index="${index}">Undo mark as read</button></div>`;
    historyList.append(article);
  });

  historyList.hidden = history.length === 0;
  emptyHistory.hidden = history.length !== 0;
}

historyList.addEventListener("click", (event) => {
  const button = event.target.closest(".undo-read");
  if (!button) return;

  history.splice(Number(button.dataset.index), 1);
  localStorage.setItem("readingHistory", JSON.stringify(history));
  renderHistory();
});

renderHistory();
