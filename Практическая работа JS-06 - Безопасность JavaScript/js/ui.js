export function renderNotes(container, empty, notes, onDelete) {
  const fragment = document.createDocumentFragment();
  for (const note of notes) {
    const card = document.createElement("article");
    card.className = "note-card";
    const title = document.createElement("h3");
    title.textContent = note.title;
    const body = document.createElement("p");
    body.textContent = note.body;
    const bottom = document.createElement("div");
    bottom.className = "note-bottom";
    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = new Date(note.createdAt).toLocaleString("ru-RU");
    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Удалить заметку: ${note.title}`);
    remove.addEventListener("click", () => onDelete(note.id));
    bottom.append(date, remove);
    card.append(title, body, bottom);
    fragment.append(card);
  }
  container.replaceChildren(fragment);
  empty.hidden = notes.length > 0;
}
