import {
  products,
  getProductTotal,
  getTotalInventoryValue,
  getMostExpensiveProduct,
  filterByCategory,
  findProduct,
  getAvailableProducts,
  getCategoryStatistics,
  updateProductQuantity,
  sortProductsByPrice
} from "./products.js";

const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0
});
const numberFormat = new Intl.NumberFormat("ru-RU");
const categoryNames = { electronics: "Электроника", furniture: "Мебель" };
const categoryIcons = { electronics: "⌁", furniture: "▤" };

let currentProducts = [...products];
const elements = {
  inventoryValue: document.querySelector("#inventory-value"),
  productCount: document.querySelector("#product-count"),
  unitsCount: document.querySelector("#units-count"),
  mostExpensive: document.querySelector("#most-expensive"),
  mostExpensivePrice: document.querySelector("#most-expensive-price"),
  productsBody: document.querySelector("#products-body"),
  resultCount: document.querySelector("#result-count"),
  emptyState: document.querySelector("#empty-state"),
  search: document.querySelector("#search-input"),
  category: document.querySelector("#category-filter"),
  sort: document.querySelector("#sort-select"),
  categoryStats: document.querySelector("#category-stats")
};

function getVisibleProducts() {
  let result = currentProducts;
  const query = elements.search.value.trim().toLowerCase();
  const category = elements.category.value;

  if (query) {
    result = result.filter(product => product.name.toLowerCase().includes(query));
  }
  if (category !== "all") {
    result = filterByCategory(result, category);
  }
  if (elements.sort.value === "asc" || elements.sort.value === "desc") {
    result = sortProductsByPrice(result, elements.sort.value);
  }
  return result;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  elements.productsBody.innerHTML = visibleProducts.map(product => `
    <tr>
      <td><div class="product-name"><span class="product-avatar">${categoryIcons[product.category]}</span>${product.name}</div></td>
      <td><span class="category-pill">${categoryNames[product.category]}</span></td>
      <td class="price">${currency.format(product.price)}</td>
      <td>
        <div class="quantity-control">
          <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Уменьшить количество ${product.name}">−</button>
          <span class="quantity-value">${product.quantity}</span>
          <button type="button" data-action="increase" data-id="${product.id}" aria-label="Увеличить количество ${product.name}">+</button>
        </div>
      </td>
      <td class="total">${currency.format(getProductTotal(product))}</td>
      <td></td>
    </tr>
  `).join("");

  elements.resultCount.textContent = `${visibleProducts.length} ${pluralize(visibleProducts.length, ["товар", "товара", "товаров"])}`;
  elements.emptyState.hidden = visibleProducts.length > 0;
}

function renderOverview() {
  const totalUnits = currentProducts.reduce((sum, product) => sum + product.quantity, 0);
  const mostExpensive = getMostExpensiveProduct(currentProducts);
  elements.inventoryValue.textContent = currency.format(getTotalInventoryValue(currentProducts));
  elements.productCount.textContent = numberFormat.format(currentProducts.length);
  elements.unitsCount.textContent = numberFormat.format(totalUnits);
  elements.mostExpensive.textContent = mostExpensive ? mostExpensive.name : "—";
  elements.mostExpensivePrice.textContent = mostExpensive
    ? `${currency.format(mostExpensive.price)} за единицу`
    : "Нет товаров";
}

function renderCategoryStatistics() {
  const statistics = getCategoryStatistics(currentProducts);
  const maxValue = Math.max(...Object.values(statistics).map(item => item.value), 1);
  elements.categoryStats.innerHTML = Object.entries(statistics).map(([category, data]) => `
    <div>
      <div class="category-row-top">
        <strong>${categoryNames[category] ?? category}</strong>
        <span>${currency.format(data.value)} · ${data.units} ед.</span>
      </div>
      <div class="progress"><span style="width:${(data.value / maxValue) * 100}%"></span></div>
    </div>
  `).join("");
}

function pluralize(number, words) {
  const mod10 = number % 10;
  const mod100 = number % 100;
  if (mod10 === 1 && mod100 !== 11) return words[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return words[1];
  return words[2];
}

function render() {
  renderOverview();
  renderProducts();
  renderCategoryStatistics();
}

function printConsoleReport() {
  const mostExpensive = getMostExpensiveProduct(products);
  console.group("Практическая работа JS-01 — отчёт каталога");
  console.log("Стоимость Laptop:", currency.format(getProductTotal(findProduct(products, 1))));
  console.log("Общая стоимость каталога:", currency.format(getTotalInventoryValue(products)));
  console.log("Самый дорогой товар:", mostExpensive);
  console.log("Электроника:", filterByCategory(products, "electronics"));
  console.log("Поиск товара с ID 3:", findProduct(products, 3));
  console.log("Товары в наличии:", getAvailableProducts(products));
  console.log("Статистика категорий:", getCategoryStatistics(products));
  console.log("Пример изменения количества (новая копия):", updateProductQuantity(products, 2, 8));
  console.log("Сортировка по цене (новая копия):", sortProductsByPrice(products, "asc"));
  console.log("Исходный массив не изменён:", products);
  console.groupEnd();
}

elements.search.addEventListener("input", renderProducts);
elements.category.addEventListener("change", renderProducts);
elements.sort.addEventListener("change", renderProducts);

elements.productsBody.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const product = findProduct(currentProducts, id);
  if (!product) return;

  const change = button.dataset.action === "increase" ? 1 : -1;
  currentProducts = updateProductQuantity(currentProducts, id, product.quantity + change);
  render();
});

render();
printConsoleReport();
