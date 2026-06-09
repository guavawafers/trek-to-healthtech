const searchInput = document.querySelector("#globalSearch");
const searchableItems = document.querySelectorAll("[data-search]");
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

document.querySelectorAll("#notesGrid .notes-grid").forEach((grid) => {
  [...grid.querySelectorAll(".article-card")]
    .sort((a, b) => new Date(b.dataset.added || 0) - new Date(a.dataset.added || 0))
    .forEach((article) => grid.appendChild(article));
});

document.querySelectorAll("#notesGrid .article-card[data-added]").forEach((article) => {
  const isNew = Date.now() - new Date(`${article.dataset.added}T00:00:00`).getTime() <= newArticleWindow;
  article.querySelector(".new-article-tag")?.classList.toggle("hidden", !isNew);
});

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  searchableItems.forEach((item) => {
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

saveArticleButtons.forEach((button) => {
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
});

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

markReadButtons.forEach((button) => {
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
});

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
const paymentIsComplete = localStorage.getItem("paymentComplete") === "true";
const workflowIsComplete = localStorage.getItem("workflowComplete") === "true";
const completedFoundationCount = Number(ecosystemIsComplete) + Number(paymentIsComplete) + Number(workflowIsComplete);

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
