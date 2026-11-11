const STORAGE_KEY = "quiet-place-notes-v1";

function isValidStoredNote(note) {
  return note && typeof note.id === "string" &&
    typeof note.title === "string" && note.title.length >= 3 && note.title.length <= 60 &&
    typeof note.body === "string" && note.body.length >= 5 && note.body.length <= 500 &&
    typeof note.createdAt === "number";
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidStoredNote);
  } catch (error) {
    console.error("Сохранённые заметки недоступны или повреждены:", error);
    return [];
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error("Не удалось сохранить заметки:", error);
    return false;
  }
}
