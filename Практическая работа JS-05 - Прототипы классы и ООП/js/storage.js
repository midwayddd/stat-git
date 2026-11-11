import { Game, GameLibrary } from "./models.js";

const STORAGE_KEY = "game-shelf-library-v1";

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return new GameLibrary();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new GameLibrary();
    const games = [];
    for (const item of parsed) {
      try {
        games.push(new Game(item));
      } catch (error) {
        console.warn("Пропущена некорректная запись игры:", error);
      }
    }
    return new GameLibrary(games);
  } catch (error) {
    console.error("Не удалось восстановить коллекцию:", error);
    return new GameLibrary();
  }
}

export function saveLibrary(library) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library.games));
    return true;
  } catch (error) {
    console.error("Не удалось сохранить коллекцию:", error);
    return false;
  }
}
