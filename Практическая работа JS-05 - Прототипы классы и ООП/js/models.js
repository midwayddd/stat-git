const STATUSES = ["playing", "planned", "completed"];

export class Game {
  constructor({ id = crypto.randomUUID(), name, platform, genre, status = "planned", createdAt = Date.now() }) {
    const normalizedName = String(name ?? "").trim();
    if (normalizedName.length < 2 || normalizedName.length > 60) {
      throw new Error("Название игры должно содержать от 2 до 60 символов.");
    }
    if (!STATUSES.includes(status)) throw new Error("Неизвестный статус игры.");
    this.id = id;
    this.name = normalizedName;
    this.platform = String(platform ?? "Другое");
    this.genre = String(genre ?? "Другое");
    this.status = status;
    this.createdAt = createdAt;
  }

  setStatus(status) {
    if (!STATUSES.includes(status)) throw new Error("Выбран недопустимый статус.");
    this.status = status;
  }

  rename(name) {
    const normalizedName = String(name ?? "").trim();
    if (normalizedName.length < 2 || normalizedName.length > 60) {
      throw new Error("Название игры должно содержать от 2 до 60 символов.");
    }
    this.name = normalizedName;
  }
}

export class GameLibrary {
  constructor(games = []) {
    this.games = games.filter(game => game instanceof Game);
  }

  add(game) {
    if (!(game instanceof Game)) throw new TypeError("В коллекцию можно добавлять только объекты Game.");
    if (this.games.some(item => item.name.toLocaleLowerCase() === game.name.toLocaleLowerCase())) {
      throw new Error("Такая игра уже есть в коллекции.");
    }
    this.games.unshift(game);
  }

  remove(id) {
    this.games = this.games.filter(game => game.id !== id);
  }

  find(id) {
    return this.games.find(game => game.id === id);
  }

  filter(status = "all", query = "") {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru");
    return this.games.filter(game => {
      const matchesStatus = status === "all" || game.status === status;
      const matchesText = game.name.toLocaleLowerCase("ru").includes(normalizedQuery) ||
        game.platform.toLocaleLowerCase("ru").includes(normalizedQuery) ||
        game.genre.toLocaleLowerCase("ru").includes(normalizedQuery);
      return matchesStatus && matchesText;
    });
  }

  getStats() {
    return {
      total: this.games.length,
      playing: this.games.filter(game => game.status === "playing").length,
      completed: this.games.filter(game => game.status === "completed").length
    };
  }
}

export { STATUSES };
