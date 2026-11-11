const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,cca3";
const grid = document.querySelector("#country-grid");
const statusLine = document.querySelector("#status");
const errorPanel = document.querySelector("#error");
const errorMessage = document.querySelector("#error-message");
const emptyPanel = document.querySelector("#empty");
const totalCount = document.querySelector("#total-count");
const searchInput = document.querySelector("#search");
const regionSelect = document.querySelector("#region");
const sortSelect = document.querySelector("#sort");
const reloadButton = document.querySelector("#reload");
const retryButton = document.querySelector("#retry");
let countries = [];

function setLoading(isLoading) {
  reloadButton.disabled = isLoading;
  retryButton.disabled = isLoading;
  reloadButton.textContent = isLoading ? "Загрузка..." : "↻ Обновить данные";
}

async function loadCountries() {
  setLoading(true);
  errorPanel.classList.add("hidden");
  emptyPanel.classList.add("hidden");
  grid.replaceChildren();
  statusLine.textContent = "Получаем данные из открытого API...";
  try {
    const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Сервер вернул HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("API вернул данные неожиданного формата");
    countries = data.filter(item =>
      item && typeof item.name?.common === "string" &&
      typeof item.region === "string" && Number.isFinite(item.population)
    );
    if (countries.length === 0) throw new Error("В ответе API не найдено подходящих записей");
    totalCount.textContent = countries.length.toLocaleString("ru-RU");
    renderCountries();
  } catch (error) {
    console.error("Ошибка загрузки стран:", error);
    statusLine.textContent = "Возникла ошибка при загрузке.";
    errorMessage.textContent = error instanceof Error ? error.message : "Неизвестная ошибка запроса.";
    errorPanel.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
}

function createCountryCard(country) {
  const card = document.createElement("article");
  card.className = "country-card";
  const top = document.createElement("div");
  top.className = "country-top";
  const flag = document.createElement("img");
  flag.className = "flag";
  flag.alt = country.flags?.alt || `Флаг страны ${country.name.common}`;
  flag.loading = "lazy";
  if (typeof country.flags?.png === "string" && country.flags.png.startsWith("https://")) {
    flag.src = country.flags.png;
  } else {
    flag.alt = "Флаг недоступен";
    flag.hidden = true;
  }
  const region = document.createElement("span");
  region.className = "region-tag";
  region.textContent = country.region || "Регион не указан";
  top.append(flag, region);
  const title = document.createElement("h3");
  title.textContent = country.name.common;
  const capital = document.createElement("p");
  capital.className = "capital";
  capital.textContent = Array.isArray(country.capital) ? country.capital.join(", ") : "Столица не указана";
  const population = document.createElement("p");
  population.className = "population";
  population.textContent = `Население · ${country.population.toLocaleString("ru-RU")}`;
  card.append(top, title, capital, population);
  return card;
}

function renderCountries() {
  const query = searchInput.value.trim().toLocaleLowerCase("ru");
  const region = regionSelect.value;
  const sort = sortSelect.value;
  const filtered = countries.filter(country => {
    const capital = Array.isArray(country.capital) ? country.capital.join(" ") : "";
    const matchesText = country.name.common.toLocaleLowerCase("ru").includes(query) || capital.toLocaleLowerCase("ru").includes(query);
    return matchesText && (region === "all" || country.region === region);
  });
  filtered.sort((a, b) => sort === "population"
    ? b.population - a.population
    : a.name.common.localeCompare(b.name.common, "ru"));
  const fragment = document.createDocumentFragment();
  filtered.forEach(country => fragment.append(createCountryCard(country)));
  grid.replaceChildren(fragment);
  emptyPanel.classList.toggle("hidden", filtered.length !== 0);
  statusLine.textContent = `Показано стран: ${filtered.length.toLocaleString("ru-RU")}`;
}

searchInput.addEventListener("input", renderCountries);
regionSelect.addEventListener("change", renderCountries);
sortSelect.addEventListener("change", renderCountries);
reloadButton.addEventListener("click", loadCountries);
retryButton.addEventListener("click", loadCountries);
loadCountries();