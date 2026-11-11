const STORAGE_KEY = "focus-planner-tasks-v1";

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item =>
      item && typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.done === "boolean"
    );
  } catch (error) {
    console.error("Не удалось прочитать сохранённые задачи:", error);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Не удалось сохранить задачи:", error);
    return false;
  }
}
