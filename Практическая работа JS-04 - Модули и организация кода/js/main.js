import { createTask, toggleTask, filterTasks } from "./tasks.js";
import { loadTasks, saveTasks } from "./storage.js";
import { renderTasks, updateSummary } from "./ui.js";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-title");
const message = document.querySelector("#form-message");
const list = document.querySelector("#task-list");
const empty = document.querySelector("#empty-state");
const remaining = document.querySelector("#remaining");
const total = document.querySelector("#total");
const clearDoneButton = document.querySelector("#clear-done");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

let tasks = loadTasks();
let currentFilter = "all";

function persistAndRender() {
  const saved = saveTasks(tasks);
  if (!saved) showMessage("Не удалось сохранить изменения в браузере.", true);
  render();
}

function render() {
  renderTasks(list, empty, filterTasks(tasks, currentFilter), toggle, remove);
  updateSummary(remaining, total, tasks);
  clearDoneButton.disabled = !tasks.some(task => task.done);
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function add(event) {
  event.preventDefault();
  try {
    tasks = [createTask(input.value), ...tasks];
    input.value = "";
    showMessage("Задача добавлена.");
    persistAndRender();
    input.focus();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function toggle(id) {
  tasks = toggleTask(tasks, id);
  persistAndRender();
}

function remove(id) {
  tasks = tasks.filter(task => task.id !== id);
  persistAndRender();
}

form.addEventListener("submit", add);
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    render();
  });
});
clearDoneButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done);
  persistAndRender();
});
render();
