// Исходные данные каталога. Функции ниже не изменяют этот массив.
export const products = [
  { id: 1, name: "Laptop", price: 80000, quantity: 2, category: "electronics" },
  { id: 2, name: "Mouse", price: 2500, quantity: 5, category: "electronics" },
  { id: 3, name: "Keyboard", price: 4500, quantity: 3, category: "electronics" },
  { id: 4, name: "Chair", price: 18000, quantity: 1, category: "furniture" },
  { id: 5, name: "Desk", price: 25000, quantity: 2, category: "furniture" }
];

export function getProductTotal(product) {
  return product.price * product.quantity;
}

export function getTotalInventoryValue(items) {
  return items.reduce((total, product) => total + getProductTotal(product), 0);
}

export function getMostExpensiveProduct(items) {
  return items.reduce((mostExpensive, product) =>
    product.price > mostExpensive.price ? product : mostExpensive
  , items[0]);
}

export function filterByCategory(items, category) {
  return items.filter(product => product.category === category);
}

export function findProduct(items, id) {
  return items.find(product => product.id === Number(id));
}

export function getAvailableProducts(items) {
  return items.filter(product => product.quantity > 0);
}

// Возвращает отдельный объект со статистикой каждой категории.
export function getCategoryStatistics(items) {
  return items.reduce((statistics, product) => {
    const category = product.category;
    if (!statistics[category]) {
      statistics[category] = { products: 0, units: 0, value: 0 };
    }
    statistics[category].products += 1;
    statistics[category].units += product.quantity;
    statistics[category].value += getProductTotal(product);
    return statistics;
  }, {});
}

// Создаёт новый массив и новый объект только для изменяемого товара.
export function updateProductQuantity(items, id, quantity) {
  const safeQuantity = Math.max(0, Math.floor(Number(quantity) || 0));
  return items.map(product =>
    product.id === Number(id)
      ? { ...product, quantity: safeQuantity }
      : product
  );
}

// Сортировка выполняется на копии массива, исходный порядок не меняется.
export function sortProductsByPrice(items, direction = "asc") {
  const multiplier = direction === "desc" ? -1 : 1;
  return [...items].sort((a, b) => (a.price - b.price) * multiplier);
}
