const STATUS_LABELS = { playing: "Играю", planned: "В планах", completed: "Пройдена" };

export function renderLibrary(container, empty, games, onStatusChange, onDelete) {
  const fragment = document.createDocumentFragment();
  for (const game of games) {
    const card = document.createElement("article");
    card.className = "game-card";
    const icon = document.createElement("span");
    icon.className = "game-icon";
    icon.textContent = "▣";
    const title = document.createElement("h3");
    title.textContent = game.name;
    const meta = document.createElement("p");
    meta.className = "game-meta";
    meta.textContent = `${game.platform} · ${game.genre}`;
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    const select = document.createElement("select");
    select.className = "status-select";
    select.setAttribute("aria-label", `Статус игры ${game.name}`);
    for (const [value, label] of Object.entries(STATUS_LABELS)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = game.status === value;
      select.append(option);
    }
    select.addEventListener("change", () => onStatusChange(game.id, select.value));
    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Удалить игру ${game.name}`);
    remove.addEventListener("click", () => onDelete(game.id));
    bottom.append(select, remove);
    card.append(icon, title, meta, bottom);
    fragment.append(card);
  }
  container.replaceChildren(fragment);
  empty.hidden = games.length > 0;
}

export function renderStats(stats, total, playing, completed) {
  total.textContent = stats.total;
  playing.textContent = stats.playing;
  completed.textContent = stats.completed;
}
