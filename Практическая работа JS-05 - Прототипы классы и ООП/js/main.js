import { Game, GameLibrary } from "./models.js";
import { loadLibrary, saveLibrary } from "./storage.js";
import { renderLibrary, renderStats } from "./ui.js";

const form = document.querySelector("#game-form");
const nameInput = document.querySelector("#game-name");
const platformInput = document.querySelector("#game-platform");
const genreInput = document.querySelector("#game-genre");
const message = document.querySelector("#message");
const grid = document.querySelector("#game-grid");
const empty = document.querySelector("#empty");
const search = document.querySelector("#search");
const filters = [...document.querySelectorAll("[data-status]")];
const total = document.querySelector("#stat-total");
const playing = document.querySelector("#stat-playing");
const completed = document.querySelector("#stat-done");
const shownCount = document.querySelector("#shown-count");

const library = loadLibrary();
let currentStatus = "all";

function persist() {
  if (!saveLibrary(library)) showMessage("Не удалось сохранить коллекцию в браузере.", true);
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function render() {
  const visible = library.filter(currentStatus, search.value);
  renderLibrary(grid, empty, visible, changeStatus, removeGame);
  renderStats(library.getStats(), total, playing, completed);
  shownCount.textContent = `${visible.length} из ${library.games.length} записей`;
}

function addGame(event) {
  event.preventDefault();
  try {
    const game = new Game({ name: nameInput.value, platform: platformInput.value, genre: genreInput.value });
    library.add(game);
    form.reset();
    showMessage("Игра добавлена на полку.");
    persist();
    render();
    nameInput.focus();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function changeStatus(id, status) {
  try {
    const game = library.find(id);
    if (!game) throw new Error("Игра не найдена.");
    game.setStatus(status);
    persist();
    render();
    showMessage("Статус обновлён.");
  } catch (error) {
    showMessage(error.message, true);
  }
}

function removeGame(id) {
  library.remove(id);
  persist();
  render();
  showMessage("Игра удалена из коллекции.");
}

form.addEventListener("submit", addGame);
search.addEventListener("input", render);
filters.forEach(button => button.addEventListener("click", () => {
  currentStatus = button.dataset.status;
  filters.forEach(item => item.classList.toggle("active", item === button));
  render();
}));
render();
