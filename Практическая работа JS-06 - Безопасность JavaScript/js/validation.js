export function validateNote(titleValue, bodyValue, existingNotes) {
  const title = String(titleValue ?? "").trim();
  const body = String(bodyValue ?? "").trim();

  if (title.length < 3) return { valid: false, message: "Заголовок должен содержать минимум 3 символа." };
  if (title.length > 60) return { valid: false, message: "Заголовок не должен быть длиннее 60 символов." };
  if (body.length < 5) return { valid: false, message: "Текст заметки должен содержать минимум 5 символов." };
  if (body.length > 500) return { valid: false, message: "Текст заметки не должен быть длиннее 500 символов." };
  if (existingNotes.some(note => note.title.toLocaleLowerCase("ru") === title.toLocaleLowerCase("ru"))) {
    return { valid: false, message: "Заметка с таким заголовком уже существует." };
  }
  return { valid: true, value: { title, body } };
}
