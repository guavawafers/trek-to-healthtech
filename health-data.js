const lessonTabs = document.querySelectorAll(".lesson-tab");
const lessonPages = document.querySelectorAll(".lesson-page");
const completeLessonButtons = document.querySelectorAll(".complete-lesson");
const lessonProgressText = document.querySelector("#lessonProgressText");
const lessonProgressBar = document.querySelector("#lessonProgressBar");
const toast = document.querySelector("#toast");
if (localStorage.getItem("healthDataContentVersion") !== "1") {
  localStorage.removeItem("healthDataLessons");
  localStorage.removeItem("healthDataComplete");
  localStorage.setItem("healthDataContentVersion", "1");
}
const completedLessons = new Set(JSON.parse(localStorage.getItem("healthDataLessons") || "[]"));

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
      const number = Number(button.dataset.complete.split("-")[1]);
      button.textContent = number < 5 ? "Continue →" : "Lesson completed ✓";
      document.querySelector(`.lesson-tab[data-lesson="${button.dataset.complete}"]`).classList.add("done");
    }
  });
}

lessonTabs.forEach((tab) => tab.addEventListener("click", () => showLesson(tab.dataset.lesson)));
completeLessonButtons.forEach((button) => button.addEventListener("click", () => {
  const id = button.dataset.complete;
  completedLessons.add(id);
  localStorage.setItem("healthDataLessons", JSON.stringify([...completedLessons]));
  updateProgress();
  const number = Number(id.split("-")[1]);
  showLesson(number < 5 ? `lesson-${number + 1}` : "exercise");
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
    localStorage.setItem("healthDataComplete", "true");
    document.querySelector("#quizResult").textContent = "Module complete. Your dashboard progress has been updated.";
    document.querySelector(".lesson-tab[data-lesson='knowledge-check']").classList.add("done");
  } else {
    document.querySelector("#quizResult").textContent = `${correct} of ${fields.length} correct. Review the highlighted questions and try again.`;
  }
});

updateProgress();
