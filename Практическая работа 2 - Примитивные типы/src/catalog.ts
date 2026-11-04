// Практическая работа 2. Учёт цен и доступности товаров.

// 1–3. Массивы с примитивными типами.
const productNames: string[] = [
  "Клавиатура", "Монитор", "Мышь", "Наушники", "Веб-камера", "Коврик"
];

const prices: number[] = [4_590, 18_990.5, 1_490, 3_250, 2_799.99, 890.5];

const availability: boolean[] = [true, true, false, true, false, true];

// 4. Кортеж: название, цена и наличие в фиксированном порядке.
type ProductRow = [name: string, price: number, isAvailable: boolean];

const productRows: ProductRow[] = productNames.map((name, index) => [
  name,
  prices[index],
  availability[index]
]);

// Литеральный тип описывает ограниченный набор допустимых статусов.
type AvailabilityStatus = "available" | "unavailable";

function getStatus(isAvailable: boolean): AvailabilityStatus {
  return isAvailable ? "available" : "unavailable";
}

// 5. filter(): оставляем только товары в наличии.
const availableProducts = productRows.filter(([, , isAvailable]) => isAvailable);

// 6. map(): формируем удобные для вывода строки.
const productDescriptions: string[] = productRows.map(
  ([name, price, isAvailable]) =>
    `${name} — ${price.toFixed(2)} руб. (${getStatus(isAvailable)})`
);

// 7. reduce(): считаем сумму цен доступных товаров.
const availableTotal = availableProducts.reduce(
  (sum, [, price]) => sum + price,
  0
);

// 8. void: функция выводит статистику и не возвращает полезное значение.
function printStatistics(): void {
  console.log("Все товары:", productDescriptions);
  console.log("Доступные товары:", availableProducts);
  console.log(`В наличии: ${availableProducts.length} из ${productRows.length}`);
  console.log(`Сумма цен доступных товаров: ${availableTotal.toFixed(2)} руб.`);
}

printStatistics();

// Дополнительно: null и undefined явно отражены в типах.
const selectedProductId: number | null = null;
let lastSearchText: string | undefined;
console.log("Выбранный ID:", selectedProductId);
console.log("Последний поисковый запрос:", lastSearchText ?? "не задан");

// 9. Проверяем данные, полученные строкой, до использования как цены.
function parsePrice(rawValue: string): number | null {
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    console.error(`Некорректное число: "${rawValue}"`);
    return null;
  }

  if (parsedValue < 0) {
    console.error("Цена не может быть отрицательной.");
    return null;
  }

  return parsedValue;
}

console.log("Проверенная цена:", parsePrice("1250.50"));
console.log("Проверка неверной цены:", parsePrice("не число"));
console.log("Проверка отрицательной цены:", parsePrice("-10"));

// 10. never: эта функция всегда прерывает выполнение через исключение.
// Она объявлена, но не вызывается, чтобы не останавливать демонстрацию выше.
function failWithError(message: string): never {
  throw new Error(message);
}

// Пример вызова при необходимости:
// failWithError("Критическая ошибка каталога");
