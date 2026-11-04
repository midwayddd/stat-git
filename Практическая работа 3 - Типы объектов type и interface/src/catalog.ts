// Практическая работа 3. Каталог товаров с поставщиками.

// Вложенная модель контактов: оба поля необязательны.
interface SupplierContact {
  email?: string;
  phone?: string;
}

interface Supplier {
  name: string;
  country: string;
  contact?: SupplierContact;
}

// Дополнительная часть: отдельный псевдоним идентификатора.
type ProductId = number;

interface Product {
  readonly id: ProductId;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  tags: string[];
  supplier: Supplier;
  description?: string;
}

// 4. Каталог содержит шесть товаров с разными категориями и поставщиками.
const products: Product[] = [
  {
    id: 101,
    name: "Механическая клавиатура",
    category: "Периферия",
    price: 4590,
    isAvailable: true,
    tags: ["механическая", "USB", "RGB"],
    supplier: {
      name: "KeyTech",
      country: "Германия",
      contact: { email: "sales@keytech.example", phone: "+49 30 555-0101" }
    },
    description: "Клавиатура с механическими переключателями."
  },
  {
    id: 102,
    name: "Монитор 27 дюймов",
    category: "Мониторы",
    price: 18990,
    isAvailable: true,
    tags: ["IPS", "27-inch", "144Hz"],
    supplier: {
      name: "ViewPoint",
      country: "Польша",
      contact: { email: "info@viewpoint.example" }
    }
  },
  {
    id: 103,
    name: "Беспроводная мышь",
    category: "Периферия",
    price: 1490,
    isAvailable: false,
    tags: ["wireless", "office"],
    supplier: { name: "InputPro", country: "Китай" },
    description: "Компактная мышь для повседневной работы."
  },
  {
    id: 104,
    name: "USB-микрофон",
    category: "Аудио",
    price: 3250,
    isAvailable: true,
    tags: ["USB", "streaming"],
    supplier: {
      name: "SoundLab",
      country: "Чехия",
      contact: { phone: "+420 20 555-0104" }
    },
    description: "Микрофон для записи голоса."
  },
  {
    id: 105,
    name: "Веб-камера",
    category: "Видео",
    price: 2799.99,
    isAvailable: false,
    tags: ["Full HD", "USB"],
    supplier: { name: "ClearView", country: "Япония", contact: {} }
  },
  {
    id: 106,
    name: "Наушники",
    category: "Аудио",
    price: 3990,
    isAvailable: true,
    tags: ["wireless", "stereo"],
    supplier: {
      name: "SoundLab",
      country: "Чехия",
      contact: { email: "help@soundlab.example" }
    },
    description: "Беспроводные наушники с микрофоном."
  }
];

// 5. filter(): отдельный массив доступных товаров.
const availableProducts = products.filter((product) => product.isAvailable);
console.log("Доступные товары:", availableProducts);

// 6. map(): TypeScript выводит string[] для массива названий.
const productNames = products.map((product) => product.name);
console.log("Названия товаров:", productNames);

// 7. find(): результат может быть undefined, поэтому проверяем его.
const searchedProduct = products.find((product) => product.id === 104);
if (searchedProduct !== undefined) {
  console.log("Найден товар:", searchedProduct.name);
} else {
  console.log("Товар с указанным ID не найден.");
}

// 8. Изменяем свойства, которые не объявлены readonly.
const firstProduct = products[0];
firstProduct.price = 4490;
firstProduct.tags.push("sale");
firstProduct.isAvailable = true;
// firstProduct.id = 999; // Ошибка TypeScript: id доступен только для чтения.

// 9. Выводим описание только при его наличии.
for (const product of products) {
  if (product.description !== undefined) {
    console.log(`${product.name}: ${product.description}`);
  }
}

// 10. Безопасный доступ к вложенным необязательным контактным данным.
for (const product of products) {
  const supplierEmail = product.supplier.contact?.email;
  const supplierPhone = product.supplier.contact?.phone;

  console.log(
    `${product.supplier.name}: email — ${supplierEmail ?? "не указан"}, телефон — ${supplierPhone ?? "не указан"}`
  );
}

// Дополнительная часть 2: расширение Product через interface extends.
interface DigitalProduct extends Product {
  downloadUrl: string;
  fileSizeMb: number;
}

const digitalProduct: DigitalProduct = {
  id: 201,
  name: "Курс TypeScript",
  category: "Цифровые товары",
  price: 1990,
  isAvailable: true,
  tags: ["typescript", "course", "download"],
  supplier: {
    name: "CodeSchool",
    country: "Россия",
    contact: { email: "support@codeschool.example" }
  },
  description: "Видеокурс по основам TypeScript.",
  downloadUrl: "/downloads/typescript-course.zip",
  fileSizeMb: 850
};
console.log("Цифровой товар:", digitalProduct);

// Дополнительная часть 3: структурная типизация.
// Дополнительное поле сохраняется в исходном объекте, но доступно через узкий тип
// только при обращении к переменной, в типе которой оно описано.
interface NamedEntity {
  name: string;
}

const detailedEntity = { name: "Поставщик", internalCode: "SUP-42" };
const namedEntity: NamedEntity = detailedEntity;
console.log("Структурно совместимый объект:", namedEntity.name);
console.log("Дополнительное поле исходного объекта:", detailedEntity.internalCode);

// При прямом присваивании литерала с неизвестным полем срабатывает excess
// property check. Такой пример намеренно оставлен комментарием:
// const invalidEntity: NamedEntity = { name: "Поставщик", internalCode: "SUP-42" };

// Дополнительная часть 4: повторно используем Supplier в другой модели.
interface PurchaseOrder {
  orderNumber: string;
  supplier: Supplier;
  total: number;
}

const purchaseOrder: PurchaseOrder = {
  orderNumber: "PO-2026-001",
  supplier: products[0].supplier,
  total: 9080
};
console.log("Заказ поставщику:", purchaseOrder);
