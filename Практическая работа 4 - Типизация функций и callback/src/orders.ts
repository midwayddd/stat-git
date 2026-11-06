// Практическая работа 4. Обработка заказов и расчёт стоимости.

interface OrderItem {
  id: number;
  title: string;
  unitPrice: number;
  quantity: number;
}

interface Order {
  id: number;
  customer: string;
  items: OrderItem[];
  discountPercent?: number;
}

type PriceFormatter = (value: number) => string;

// Дополнительная часть: отдельный тип callback для отбора заказов.
type OrderPredicate = (order: Order) => boolean;

// 1. Три заказа, в каждом не менее двух товарных позиций.
const orders: Order[] = [
  {
    id: 1001,
    customer: "Александр",
    discountPercent: 10,
    items: [
      { id: 1, title: "Клавиатура", unitPrice: 4590, quantity: 1 },
      { id: 2, title: "Мышь", unitPrice: 1490, quantity: 2 }
    ]
  },
  {
    id: 1002,
    customer: "Мария",
    items: [
      { id: 3, title: "Монитор", unitPrice: 18990, quantity: 1 },
      { id: 4, title: "Коврик", unitPrice: 890, quantity: 3 }
    ]
  },
  {
    id: 1003,
    customer: "Иван",
    discountPercent: 15,
    items: [
      { id: 5, title: "Наушники", unitPrice: 3990, quantity: 1 },
      { id: 6, title: "Микрофон", unitPrice: 3250, quantity: 2 }
    ]
  }
];

// 2. Рассчитываем стоимость одной позиции с учётом количества.
function calculateItemTotal(item: OrderItem): number {
  return item.unitPrice * item.quantity;
}

// 3. Складываем стоимость всех позиций заказа.
function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
}

// 4. Применяем скидку. Значение по умолчанию — 0 процентов.
function applyDiscount(subtotal: number, percent: number = 0): number {
  if (percent < 0 || percent > 100) {
    throw new Error("Скидка должна быть в диапазоне от 0 до 100 процентов.");
  }

  return subtotal - (subtotal * percent) / 100;
}

// 5. Форматируем сумму и добавляем обозначение валюты.
function formatPrice(value: number, currency: string = "RUB"): string {
  return `${value.toFixed(2)} ${currency}`;
}

// 6. Формируем сводку заказа. Форматтер можно заменить через callback.
function formatOrder(
  order: Order,
  formatter: PriceFormatter = formatPrice
): string {
  const subtotal = calculateSubtotal(order.items);
  const discount = order.discountPercent ?? 0;
  const total = applyDiscount(subtotal, discount);

  return [
    `Заказ №${order.id}`,
    `Покупатель: ${order.customer}`,
    `Позиций: ${order.items.length}`,
    `Сумма до скидки: ${formatter(subtotal)}`,
    `Скидка: ${discount}%`,
    `Итого: ${formatter(total)}`
  ].join("\n");
}

// 7. Отбираем позиции по условию, которое передаётся как callback.
function selectItems(
  items: OrderItem[],
  predicate: (item: OrderItem) => boolean
): OrderItem[] {
  return items.filter(predicate);
}

// 8. Два разных callback для одной функции отбора.
const expensiveItems = (item: OrderItem): boolean => item.unitPrice > 3000;
const multipleItems = (item: OrderItem): boolean => item.quantity > 1;

// Дополнительная часть 1: выбор заказов по отдельному типу callback.
function selectOrders(
  source: Order[],
  predicate: OrderPredicate
): Order[] {
  return source.filter(predicate);
}

// Дополнительная часть 2: rest-параметр собирает аргументы в массив чисел.
function sumValues(...values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

// Дополнительная часть 3: преобразуем позиции, не меняя исходный массив.
type OrderItemTransformer = (item: OrderItem) => OrderItem;

function transformItems(
  items: OrderItem[],
  transformer: OrderItemTransformer
): OrderItem[] {
  return items.map(transformer);
}

// Дополнительная часть 4: перегрузка для строкового кода и числового ID.
function formatOrderReference(orderCode: string): string;
function formatOrderReference(orderId: number): string;
function formatOrderReference(reference: string | number): string {
  if (typeof reference === "number") {
    return `Заказ №${reference}`;
  }

  return `Код заказа: ${reference}`;
}

// Дополнительная часть 5: объект параметров вместо набора отдельных аргументов.
interface OrderSearchOptions {
  customer: string;
  minTotal?: number;
}

function searchOrders(options: OrderSearchOptions): Order[] {
  return orders.filter((order) => {
    const matchesCustomer = order.customer
      .toLowerCase()
      .includes(options.customer.toLowerCase());

    const matchesTotal =
      options.minTotal === undefined ||
      calculateSubtotal(order.items) >= options.minTotal;

    return matchesCustomer && matchesTotal;
  });
}

// Демонстрация обязательных функций на каждом заказе.
for (const order of orders) {
  console.log("\n==============================");
  console.log(formatOrder(order));

  const subtotal = calculateSubtotal(order.items);
  console.log("Подытог:", formatPrice(subtotal));

  const expensive = selectItems(order.items, expensiveItems);
  const repeated = selectItems(order.items, multipleItems);

  console.log("Дорогие позиции:", expensive.map((item) => item.title));
  console.log("Позиции с количеством больше одного:", repeated.map((item) => item.title));
}

// Передаём альтернативный форматтер: расчёт остаётся тем же.
const euroFormatter: PriceFormatter = (value) => formatPrice(value, "EUR");
console.log("\nФорматирование в евро:");
console.log(formatOrder(orders[0], euroFormatter));

// map(): получаем массив названий с типом string[].
const firstOrderTitles: string[] = orders[0].items.map((item) => item.title);
console.log("\nНазвания позиций первого заказа:", firstOrderTitles);

// find(): обрабатываем оба варианта — элемент найден или отсутствует.
const foundItem = orders[0].items.find((item) => item.id === 2);
if (foundItem !== undefined) {
  console.log("Найдена позиция:", foundItem.title);
} else {
  console.log("Позиция с таким ID не найдена.");
}

const missingItem = orders[0].items.find((item) => item.id === 999);
if (missingItem !== undefined) {
  console.log("Найдена позиция:", missingItem.title);
} else {
  console.log("Позиция с ID 999 отсутствует.");
}

// Дополнительная часть 1: выбираем заказы с итоговой суммой от 5000 рублей.
const largeOrders = selectOrders(
  orders,
  (order) => calculateSubtotal(order.items) >= 5000
);
console.log("\nКрупные заказы:", largeOrders.map((order) => order.id));

// Дополнительная часть 2: вызовы rest-функции с разным числом аргументов.
console.log("\nСумма без аргументов:", sumValues());
console.log("Сумма одного числа:", sumValues(15));
console.log("Сумма нескольких чисел:", sumValues(10, 20, 30, 40));

// Дополнительная часть 3: повышаем цены в копиях позиций на 5%.
const increasedPriceItems = transformItems(
  orders[0].items,
  (item) => ({
    ...item,
    unitPrice: item.unitPrice * 1.05
  })
);
console.log("\nИсходная цена:", orders[0].items[0].unitPrice);
console.log("Цена в новой коллекции:", increasedPriceItems[0].unitPrice);

// Дополнительная часть 4: используем обе сигнатуры перегруженной функции.
console.log("\n", formatOrderReference(1001));
console.log(formatOrderReference("ORD-2026-1001"));

// Дополнительная часть 5: поиск с объектом параметров.
const customerOrders = searchOrders({
  customer: "а",
  minTotal: 3000
});
console.log("\nЗаказы по параметрам:", customerOrders.map((order) => order.id));

// Демонстрация параметра со значением по умолчанию и необязательного параметра.
function describeOrder(order: Order, showCustomer?: boolean): string {
  const customerPart = showCustomer === true
    ? `, покупатель: ${order.customer}`
    : "";

  return `Заказ №${order.id}${customerPart}`;
}

console.log("\n", describeOrder(orders[0]));
console.log(describeOrder(orders[0], true));

// Параметр по умолчанию у applyDiscount и formatPrice уже использован выше.
console.log("Сумма без скидки:", applyDiscount(2500));
console.log("Цена в валюте по умолчанию:", formatPrice(2500));
