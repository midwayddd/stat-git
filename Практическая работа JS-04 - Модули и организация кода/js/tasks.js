export function createTask(title) {
  const normalized = title.trim();
  if (normalized.length < 3) throw new Error("Название должно содержать минимум 3 символа.");
  if (normalized.length > 90) throw new Error("Название не должно быть длиннее 90 символов.");
  return { id: crypto.randomUUID(), title: normalized, done: false, createdAt: Date.now() };
}

export function toggleTask(tasks, id) {
  return tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
}

export function filterTasks(tasks, filter) {
  if (filter === "active") return tasks.filter(task => !task.done);
  if (filter === "done") return tasks.filter(task => task.done);
  return [...tasks];
}

export function countRemaining(tasks) {
  return tasks.filter(task => !task.done).length;
}
