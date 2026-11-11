import { validateNote } from "./validation.js";
import { loadNotes, saveNotes } from "./storage.js";
import { renderNotes } from "./ui.js";

const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#note-title");
const bodyInput = document.querySelector("#note-body");
const message = document.querySelector("#message");
const charCount = document.querySelector("#char-count");
const search = document.querySelector("#search");
const list = document.querySelector("#notes-list");
const empty = document.querySelector("#empty");
const count = document.querySelector("#note-count");

let notes = loadNotes();

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function render() {
  const query = search.value.trim().toLocaleLowerCase("ru");
  const visible = notes.filter(note =>
    note.title.toLocaleLowerCase("ru").includes(query) ||
    note.body.toLocaleLowerCase("ru").includes(query)
  );
  renderNotes(list, empty, visible, deleteNote);
  count.textContent = String(notes.length);
}

function addNote(event) {
  event.preventDefault();
  const result = validateNote(titleInput.value, bodyInput.value, notes);
  if (!result.valid) {
    showMessage(result.message, true);
    return;
  }
  const note = {
    id: crypto.randomUUID(),
    title: result.value.title,
    body: result.value.body,
    createdAt: Date.now()
  };
  notes = [note, ...notes];
  if (!saveNotes(notes)) {
    notes = notes.filter(item => item.id !== note.id);
    showMessage("Не удалось сохранить заметку. Проверьте настройки хранилища браузера.", true);
    return;
  }
  form.reset();
  charCount.textContent = "0 / 500";
  showMessage("Заметка сохранена.");
  render();
  titleInput.focus();
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  if (!saveNotes(notes)) showMessage("Не удалось обновить локальное хранилище.", true);
  else showMessage("Заметка удалена.");
  render();
}

form.addEventListener("submit", addNote);
search.addEventListener("input", render);
bodyInput.addEventListener("input", () => {
  charCount.textContent = `${bodyInput.value.length} / 500`;
});
render();
