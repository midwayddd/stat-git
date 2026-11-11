export function renderTasks(listElement, emptyElement, tasks, onToggle, onDelete) {
  const fragment = document.createDocumentFragment();
  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Изменить статус: ${task.title}`);
    checkbox.addEventListener("change", () => onToggle(task.id));
    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Удалить: ${task.title}`);
    remove.addEventListener("click", () => onDelete(task.id));
    item.append(checkbox, title, remove);
    fragment.append(item);
  }
  listElement.replaceChildren(fragment);
  emptyElement.hidden = tasks.length !== 0;
}

export function updateSummary(remainingElement, totalElement, allTasks) {
  remainingElement.textContent = String(allTasks.filter(task => !task.done).length);
  totalElement.textContent = `${allTasks.length} ${pluralTasks(allTasks.length)}`;
}

function pluralTasks(count) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return "задач";
  if (last === 1) return "задача";
  if (last >= 2 && last <= 4) return "задачи";
  return "задач";
}
