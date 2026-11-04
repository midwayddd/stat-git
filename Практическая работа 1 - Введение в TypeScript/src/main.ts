// Практическая работа 1. Учебный проект «Карточка заказа»
// Демонстрация базовых аннотаций, вывода типов, DOM и проверки данных.

const productName: string = "Беспроводная мышь";
const unitPrice: number = 2_500;
const quantity: number = 3;
const discountPercent: number = 10;

// Тип total и discountedTotal TypeScript определяет автоматически.
const total = unitPrice * quantity;
const discountedTotal = total * (1 - discountPercent / 100);

const resultElement = document.querySelector<HTMLParagraphElement>("#result");
const detailsElement = document.querySelector<HTMLParagraphElement>("#details");

function renderOrder(): void {
  if (resultElement === null || detailsElement === null) {
    console.error("Не найдены элементы страницы для вывода результата.");
    return;
  }

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    resultElement.textContent = "Ошибка: цена должна быть неотрицательным числом.";
    detailsElement.textContent = "";
    return;
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    resultElement.textContent = "Ошибка: количество должно быть целым числом не меньше 1.";
    detailsElement.textContent = "";
    return;
  }

  if (discountPercent < 0 || discountPercent > 100) {
    resultElement.textContent = "Ошибка: скидка должна быть от 0 до 100 процентов.";
    detailsElement.textContent = "";
    return;
  }

  resultElement.textContent = `${productName}: ${discountedTotal.toFixed(2)} руб.`;
  detailsElement.textContent =
    `Цена без скидки: ${total.toFixed(2)} руб.; скидка: ${discountPercent}%; количество: ${quantity}.`;
  console.log(`${productName}: ${discountedTotal.toFixed(2)} руб.`);
}

renderOrder();
