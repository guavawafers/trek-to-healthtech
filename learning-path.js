const viewOptions = document.querySelectorAll(".view-option");
const catalog = document.querySelector("#moduleCatalog");
const moduleCards = document.querySelectorAll(".catalog-card[data-completion]");
let completed = 0;

if (localStorage.getItem("ecosystemContentVersion") !== "2") {
  localStorage.removeItem("ecosystemLessons");
  localStorage.removeItem("ecosystemComplete");
  localStorage.setItem("ecosystemContentVersion", "2");
}
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

viewOptions.forEach((button) => button.addEventListener("click", () => {
  viewOptions.forEach((option) => option.classList.remove("active"));
  button.classList.add("active");
  catalog.className = `module-catalog ${button.dataset.view}-view`;
}));

moduleCards.forEach((card) => {
  if (localStorage.getItem(card.dataset.completion) === "true") {
    completed += 1;
    card.classList.add("completed");
    card.querySelector(".catalog-status").textContent = "Completed ✓";
    card.querySelector(".catalog-action").textContent = "Review →";
  }
});

document.querySelector("#fullProgressText").textContent = `${completed} of 8 foundations explored`;
document.querySelector("#fullProgressBar").style.width = `${completed * 12.5}%`;
