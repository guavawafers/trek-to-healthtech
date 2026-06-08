const lessonTabs = document.querySelectorAll(".lesson-tab");
const lessonPages = document.querySelectorAll(".lesson-page");
const completeLessonButtons = document.querySelectorAll(".complete-lesson");
const lessonProgressText = document.querySelector("#lessonProgressText");
const lessonProgressBar = document.querySelector("#lessonProgressBar");
const stakeholderButtons = document.querySelectorAll(".stakeholder");
const stakeholderDetail = document.querySelector("#stakeholderDetail");
const toast = document.querySelector("#toast");
if (localStorage.getItem("ecosystemContentVersion") !== "2") {
  localStorage.removeItem("ecosystemLessons");
  localStorage.removeItem("ecosystemComplete");
  localStorage.setItem("ecosystemContentVersion", "2");
}
const completedLessons = new Set(JSON.parse(localStorage.getItem("ecosystemLessons") || "[]"));

function showLesson(id) {
  lessonTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.lesson === id));
  lessonPages.forEach((page) => page.classList.toggle("active", page.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  lessonProgressText.textContent = `${completedLessons.size} of 5 lessons`;
  lessonProgressBar.style.width = `${completedLessons.size * 20}%`;
  completeLessonButtons.forEach((button) => {
    if (completedLessons.has(button.dataset.complete)) {
      button.classList.add("done");
      const lessonNumber = Number(button.dataset.complete.split("-")[1]);
      button.textContent = lessonNumber < 5 ? "Continue →" : "Lesson completed ✓";
      document.querySelector(`.lesson-tab[data-lesson="${button.dataset.complete}"]`).classList.add("done");
    }
  });
}

lessonTabs.forEach((tab) => tab.addEventListener("click", () => showLesson(tab.dataset.lesson)));

completeLessonButtons.forEach((button) => button.addEventListener("click", () => {
  const id = button.dataset.complete;
  completedLessons.add(id);
  localStorage.setItem("ecosystemLessons", JSON.stringify([...completedLessons]));
  updateProgress();
  const number = Number(id.split("-")[1]);
  showLesson(number < 5 ? `lesson-${number + 1}` : "exercise");
}));

const stakeholderContent = {
  patients: ["Patients", "Need understandable, affordable, and accessible care", "Patients navigate symptoms, appointments, costs, treatment, and follow-up while often feeling vulnerable or uncertain.", "Design focus: clarity, trust, access, and agency"],
  providers: ["Providers", "Need to deliver safe care without unnecessary burden", "Clinicians balance patient needs, documentation, coordination, time pressure, and clinical risk.", "Design focus: workflow fit, speed, safety, and useful information"],
  payers: ["Payers", "Need to manage cost while supporting appropriate care", "Health plans determine coverage, reimburse services, manage networks, and influence what care is accessible.", "Design focus: transparency, cost, eligibility, and outcomes"],
  employers: ["Employers", "Need benefits that support people and control spend", "Many Americans receive healthcare coverage through employers, making benefits teams important buyers and decision-makers.", "Design focus: adoption, measurable value, and inclusivity"],
  regulators: ["Regulators", "Need to protect safety, privacy, and access", "Government agencies set rules for healthcare delivery, data, products, coverage, and quality.", "Design focus: privacy, accessibility, safety, and accountability"]
};

stakeholderButtons.forEach((button) => button.addEventListener("click", () => {
  stakeholderButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  const content = stakeholderContent[button.dataset.stakeholder];
  stakeholderDetail.innerHTML = `<span>${content[0]}</span><h4>${content[1]}</h4><p>${content[2]}</p><strong>${content[3]}</strong>`;
}));

document.querySelector(".save-exercise").addEventListener("click", () => {
  toast.textContent = "Exercise notes saved for this session.";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
  showLesson("knowledge-check");
});

document.querySelector(".submit-quiz").addEventListener("click", () => {
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
    localStorage.setItem("ecosystemComplete", "true");
    document.querySelector("#quizResult").textContent = "Module complete. Your dashboard progress has been updated.";
    document.querySelector(".lesson-tab[data-lesson='knowledge-check']").classList.add("done");
  } else {
    document.querySelector("#quizResult").textContent = `${correct} of ${fields.length} correct. Review the highlighted questions and try again.`;
  }
});

updateProgress();
