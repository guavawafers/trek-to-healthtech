const searchInput = document.querySelector("#globalSearch");
const saveArticleButtons = document.querySelectorAll(".save-article");
const learningButtons = document.querySelectorAll(".module-action, .continue-learning");
const markReadButtons = document.querySelectorAll(".mark-read");
const historyCount = document.querySelector("#historyCount");
const savedCount = document.querySelector("#savedCount");
const libraryCount = document.querySelector("#libraryCount");
const companyCount = document.querySelector("#companyCount");
const toast = document.querySelector("#toast");
const notificationButton = document.querySelector("#notificationButton");
const notificationDrawer = document.querySelector("#notificationDrawer");
const notificationOverlay = document.querySelector("#notificationOverlay");
const notificationClose = document.querySelector("#notificationClose");
const savedReadingReminder = document.querySelector("#savedReadingReminder");
const ecosystemModule = document.querySelector("#ecosystemModule");
const ecosystemOpenButtons = document.querySelectorAll(".ecosystem-open, .continue-learning");
const closeEcosystem = document.querySelector("#closeEcosystem");
const lessonTabs = document.querySelectorAll(".lesson-tab");
const lessonPages = document.querySelectorAll(".lesson-page");
const completeLessonButtons = document.querySelectorAll(".complete-lesson");
const lessonProgressText = document.querySelector("#lessonProgressText");
const lessonProgressBar = document.querySelector("#lessonProgressBar");
const stakeholderButtons = document.querySelectorAll(".stakeholder");
const stakeholderDetail = document.querySelector("#stakeholderDetail");
const saveExercise = document.querySelector(".save-exercise");
const submitQuiz = document.querySelector(".submit-quiz");
const quizResult = document.querySelector("#quizResult");
const ecosystemStatus = document.querySelector("#ecosystemStatus");
const ecosystemCard = document.querySelector("#ecosystemCard");
const pathProgressText = document.querySelector("#pathProgressText");
const pathProgressBar = document.querySelector(".path-progress span");
const navLearningProgress = document.querySelector("#navLearningProgress");
const completedLessons = new Set();
const newArticleWindow = 30 * 24 * 60 * 60 * 1000;
const starterReadingHistory = [
  { title: "Designing digital patient experiences", source: "TU Delft Research", date: "June 4, 2026" },
  { title: "Q1 2025 market overview: Ready, set, leap", source: "Rock Health", date: "May 29, 2026" }
];
const savedReading = new Set(JSON.parse(localStorage.getItem("savedReading") || "[]"));
savedReadingReminder.textContent = savedReading.size
  ? `You have ${savedReading.size} saved ${savedReading.size === 1 ? "article" : "articles"} waiting for you.`
  : "Save interesting articles and they will appear here as a reminder.";

function setNotificationDrawer(open) {
  notificationDrawer.classList.toggle("open", open);
  notificationOverlay.classList.toggle("open", open);
  notificationDrawer.setAttribute("aria-hidden", String(!open));
  notificationButton.setAttribute("aria-expanded", String(open));
}

notificationButton.addEventListener("click", () => setNotificationDrawer(!notificationDrawer.classList.contains("open")));
notificationClose.addEventListener("click", () => setNotificationDrawer(false));
notificationOverlay.addEventListener("click", () => setNotificationDrawer(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNotificationDrawer(false);
});

function updateSidebarCounts() {
  savedCount.textContent = savedReading.size;
  libraryCount.textContent = localStorage.getItem("readingLibraryCount") || "29";
  companyCount.textContent = localStorage.getItem("companyDatabaseCount") || "68";
  historyCount.textContent = JSON.parse(localStorage.getItem("readingHistory") || JSON.stringify(starterReadingHistory)).length;
}

function sortArticlesByAddedDate(grid) {
  [...grid.querySelectorAll(".article-card")]
    .map((article, index) => {
      const publishedText = article.dataset.published || article.querySelector(".source-row div span")?.textContent || "";
      const publishedMatch = publishedText.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}|\b\d{4}\b/);
      return {
        article,
        index,
        added: article.dataset.added ? new Date(article.dataset.added).getTime() : 0,
        published: publishedMatch ? new Date(publishedMatch[0]).getTime() : 0,
      };
    })
    .sort((a, b) => b.added - a.added || b.published - a.published || a.index - b.index)
    .forEach(({ article }) => grid.appendChild(article));
}

function limitDashboardArticles(grid) {
  [...grid.querySelectorAll(".article-card")].forEach((article, index) => {
    article.hidden = index >= 3;
  });
}

document.querySelectorAll("#notesGrid .notes-grid").forEach((grid) => {
  sortArticlesByAddedDate(grid);
  limitDashboardArticles(grid);
});

document.querySelectorAll("#notesGrid .article-card[data-added]").forEach((article) => {
  const isNew = Date.now() - new Date(`${article.dataset.added}T00:00:00`).getTime() <= newArticleWindow;
  article.querySelector(".new-article-tag")?.classList.toggle("hidden", !isNew);
  const tag = article.querySelector(".article-type .tag");
  if (isNew && tag && !article.querySelector(".added-date-tag")) {
    const addedDate = new Date(`${article.dataset.added}T00:00:00`);
    const newBadge = article.querySelector(".new-article-tag");
    newBadge.insertAdjacentHTML("afterend", `<span class="added-date-tag">Added ${addedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>`);
  }
});

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll("[data-search]").forEach((item) => {
    item.classList.toggle("hidden", !item.dataset.search.includes(query));
  });
}

searchInput.addEventListener("input", applySearch);

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

function bindSaveArticle(button) {
  const articleId = button.closest(".article-card")?.dataset.id;
  button.classList.toggle("saved", savedReading.has(articleId));
  button.setAttribute("aria-label", savedReading.has(articleId) ? "Remove saved article" : "Save article");

  button.addEventListener("click", () => {
    if (!articleId) return;
    savedReading.has(articleId) ? savedReading.delete(articleId) : savedReading.add(articleId);
    localStorage.setItem("savedReading", JSON.stringify([...savedReading]));
    const isSaved = savedReading.has(articleId);
    button.classList.toggle("saved", isSaved);
    button.setAttribute("aria-label", isSaved ? "Remove saved article" : "Save article");
    toast.textContent = isSaved ? "Article saved to your reading library." : "Article removed from saved reads.";
    updateSidebarCounts();
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  });
}

saveArticleButtons.forEach(bindSaveArticle);

learningButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("ecosystem-open") || button.classList.contains("continue-learning")) return;
    toast.textContent = `${button.dataset.module} module selected.`;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  });
});

function showLesson(id) {
  lessonTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.lesson === id));
  lessonPages.forEach((page) => page.classList.toggle("active", page.id === id));
}

function updateLessonProgress() {
  lessonProgressText.textContent = `${completedLessons.size} of 5 lessons`;
  lessonProgressBar.style.width = `${completedLessons.size * 20}%`;
}

ecosystemOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = "ecosystem.html";
  });
});

closeEcosystem.addEventListener("click", () => {
  ecosystemModule.hidden = true;
  document.querySelector("#learning").scrollIntoView({ behavior: "smooth", block: "start" });
});

lessonTabs.forEach((tab) => {
  tab.addEventListener("click", () => showLesson(tab.dataset.lesson));
});

completeLessonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lessonId = button.dataset.complete;
    completedLessons.add(lessonId);
    button.classList.add("done");
    button.textContent = "Lesson completed ✓";
    document.querySelector(`.lesson-tab[data-lesson="${lessonId}"]`).classList.add("done");
    updateLessonProgress();

    const lessonNumber = Number(lessonId.split("-")[1]);
    if (lessonNumber < 5) showLesson(`lesson-${lessonNumber + 1}`);
    else showLesson("exercise");
  });
});

const stakeholderContent = {
  patients: ["Patients", "Need understandable, affordable, and accessible care", "Patients navigate symptoms, appointments, costs, treatment, and follow-up while often feeling vulnerable or uncertain.", "Design focus: clarity, trust, access, and agency"],
  providers: ["Providers", "Need to deliver safe care without unnecessary burden", "Clinicians balance patient needs, documentation, coordination, time pressure, and clinical risk.", "Design focus: workflow fit, speed, safety, and useful information"],
  payers: ["Payers", "Need to manage cost while supporting appropriate care", "Health plans determine coverage, reimburse services, manage networks, and influence what care is accessible.", "Design focus: transparency, cost, eligibility, and outcomes"],
  employers: ["Employers", "Need benefits that support people and control spend", "Many Americans receive healthcare coverage through employers, making benefits teams important buyers and decision-makers.", "Design focus: adoption, measurable value, and inclusivity"],
  regulators: ["Regulators", "Need to protect safety, privacy, and access", "Government agencies set rules for healthcare delivery, data, products, coverage, and quality.", "Design focus: privacy, accessibility, safety, and accountability"]
};

stakeholderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stakeholderButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const content = stakeholderContent[button.dataset.stakeholder];
    stakeholderDetail.innerHTML = `<span>${content[0]}</span><h4>${content[1]}</h4><p>${content[2]}</p><strong>${content[3]}</strong>`;
  });
});

saveExercise.addEventListener("click", () => {
  toast.textContent = "Exercise notes saved for this session.";
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
  showLesson("knowledge-check");
});

submitQuiz.addEventListener("click", () => {
  const fields = document.querySelectorAll(".quiz fieldset");
  let correct = 0;

  fields.forEach((field) => {
    const selected = field.querySelector("input:checked");
    const isCorrect = selected && selected.value === field.dataset.answer;
    field.classList.toggle("correct", isCorrect);
    field.classList.toggle("incorrect", !isCorrect);
    if (isCorrect) correct += 1;
  });

  if (correct === fields.length) {
    quizResult.textContent = "You completed the Healthcare Ecosystem foundation.";
    ecosystemStatus.textContent = "Completed ✓";
    ecosystemCard.classList.remove("current");
    pathProgressText.textContent = "1 of 8";
    pathProgressBar.style.width = "12.5%";
    navLearningProgress.textContent = "1/8";
    document.querySelector(".ecosystem-open").textContent = "Review →";
    document.querySelector(".lesson-tab[data-lesson='knowledge-check']").classList.add("done");
  } else {
    quizResult.textContent = `${correct} of ${fields.length} correct. Review the highlighted questions and try again.`;
  }
});

function bindMarkRead(button) {
  button.addEventListener("click", () => {
    if (button.classList.contains("read")) return;
    const history = JSON.parse(localStorage.getItem("readingHistory") || JSON.stringify(starterReadingHistory));
    const url = button.closest(".article-card").querySelector("h3 a").href;
    history.unshift({ title: button.dataset.title, source: button.dataset.source, url, markedAt: new Date().toISOString() });
    localStorage.setItem("readingHistory", JSON.stringify(history));

    button.classList.add("read");
    button.textContent = "Marked as read ✓";
    updateSidebarCounts();
    toast.textContent = "Added to your reading history.";
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  });
}

markReadButtons.forEach(bindMarkRead);

function escapeHtml(value = "") {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function escapeAttribute(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
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

function renderGeneratedDashboardArticle(article) {
  const addedAt = new Date(article.addedAt);
  const publishedAt = new Date(article.date);
  const addedLabel = Number.isNaN(addedAt.getTime()) ? "Recently added" : `Added ${addedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const publishedLabel = Number.isNaN(publishedAt.getTime()) ? "Recently published" : `Published ${publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  return `<article class="note-card article-card ${article.type === "research" ? "research-card" : ""}" data-generated="true" data-id="${escapeAttribute(article.id)}" data-added="${escapeAttribute(article.addedAt?.slice(0, 10))}" data-published="${escapeAttribute(article.date)}" data-search="${escapeAttribute(`${article.title} ${article.source} ${article.summary}`.toLowerCase())}">
    <div class="source-row"><span class="source-logo ${escapeAttribute(article.sourceClass)}">${escapeHtml(article.sourceMark)}</span><div><strong>${escapeHtml(article.source)}</strong><span>${publishedLabel}</span></div><button class="save-article" aria-label="Save article"><svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z"/></svg></button></div>
    <div class="article-type generated-article-type"><span class="tag strategy">${generatedArticleTopic(article)}</span><span class="new-article-tag">New</span><span class="added-date-tag">${addedLabel}</span><span class="article-reading-time">${escapeHtml(article.readingTime)}</span></div>
    <h3><a href="${safeArticleUrl(article.url)}" target="_blank" rel="noopener">${escapeHtml(article.title)} <span>→</span></a></h3>
    <p>${escapeHtml(article.summary)}</p>
    <div class="article-footer"><span>Why it matters for design</span><strong>${escapeHtml(article.designValue)}</strong></div>
    <button class="mark-read" data-title="${escapeAttribute(article.title)}" data-source="${escapeAttribute(article.source)}">Mark as read</button>
  </article>`;
}

async function loadGeneratedDashboardArticles() {
  try {
    const response = await fetch("data/generated-articles.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Generated reading feed unavailable");
    const feed = await response.json();
    const recent = [...(feed.articles || [])]
      .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
      .slice(0, 3);
    if (!recent.length) return;

    const industryGrid = document.querySelector("#dashboardIndustryArticles");
    const researchGrid = document.querySelector("#dashboardResearchArticles");
    industryGrid.insertAdjacentHTML("afterbegin", recent.filter((article) => article.type === "industry").map(renderGeneratedDashboardArticle).join(""));
    researchGrid.insertAdjacentHTML("afterbegin", recent.filter((article) => article.type === "research").map(renderGeneratedDashboardArticle).join(""));
    document.querySelectorAll("#notesGrid .article-card[data-generated]").forEach((card) => {
      bindSaveArticle(card.querySelector(".save-article"));
      bindMarkRead(card.querySelector(".mark-read"));
    });
    [industryGrid, researchGrid].forEach((grid) => {
      sortArticlesByAddedDate(grid);
      limitDashboardArticles(grid);
    });
    applySearch();
  } catch {}
}

loadGeneratedDashboardArticles();

if (localStorage.getItem("ecosystemContentVersion") !== "2") {
  localStorage.removeItem("ecosystemLessons");
  localStorage.removeItem("ecosystemComplete");
  localStorage.setItem("ecosystemContentVersion", "2");
}
const ecosystemIsComplete = localStorage.getItem("ecosystemComplete") === "true";
if (localStorage.getItem("paymentContentVersion") !== "2") {
  localStorage.removeItem("paymentLessons");
  localStorage.removeItem("paymentComplete");
  localStorage.setItem("paymentContentVersion", "2");
}
if (localStorage.getItem("workflowContentVersion") !== "2") {
  localStorage.removeItem("workflowLessons");
  localStorage.removeItem("workflowComplete");
  localStorage.setItem("workflowContentVersion", "2");
}
if (localStorage.getItem("healthDataContentVersion") !== "1") {
  localStorage.removeItem("healthDataLessons");
  localStorage.removeItem("healthDataComplete");
  localStorage.setItem("healthDataContentVersion", "1");
}
if (localStorage.getItem("privacyContentVersion") !== "1") {
  localStorage.removeItem("privacyLessons");
  localStorage.removeItem("privacyComplete");
  localStorage.setItem("privacyContentVersion", "1");
}
[
  ["businessModels", "1"],
  ["equitableDesign", "1"],
  ["outcomes", "1"],
].forEach(([key, version]) => {
  if (localStorage.getItem(`${key}ContentVersion`) === version) return;
  localStorage.removeItem(`${key}Lessons`);
  localStorage.removeItem(`${key}Complete`);
  localStorage.setItem(`${key}ContentVersion`, version);
});
const paymentIsComplete = localStorage.getItem("paymentComplete") === "true";
const workflowIsComplete = localStorage.getItem("workflowComplete") === "true";
const healthDataIsComplete = localStorage.getItem("healthDataComplete") === "true";
const privacyIsComplete = localStorage.getItem("privacyComplete") === "true";
const businessModelsIsComplete = localStorage.getItem("businessModelsComplete") === "true";
const equitableDesignIsComplete = localStorage.getItem("equitableDesignComplete") === "true";
const outcomesIsComplete = localStorage.getItem("outcomesComplete") === "true";
const completedFoundationCount = Number(ecosystemIsComplete) + Number(paymentIsComplete) + Number(workflowIsComplete) + Number(healthDataIsComplete) + Number(privacyIsComplete) + Number(businessModelsIsComplete) + Number(equitableDesignIsComplete) + Number(outcomesIsComplete);

if (ecosystemIsComplete) {
  ecosystemStatus.textContent = "Completed ✓";
  ecosystemCard.classList.remove("current");
  document.querySelector(".ecosystem-open").textContent = "Review →";
}

if (paymentIsComplete) {
  document.querySelector("#paymentStatus").textContent = "Completed ✓";
  document.querySelector("#paymentCard").classList.remove("current");
  document.querySelector(".payment-open").textContent = "Review →";
}

if (workflowIsComplete) {
  document.querySelector("#workflowStatus").textContent = "Completed ✓";
  document.querySelector("#workflowCard").classList.remove("current");
  document.querySelector(".workflow-open").textContent = "Review →";
}

pathProgressText.textContent = `${completedFoundationCount} of 8`;
updateSidebarCounts();
pathProgressBar.style.width = `${completedFoundationCount * 12.5}%`;
navLearningProgress.textContent = `${completedFoundationCount}/8`;
