/**
 * @typedef {Object} Seller Продавец
 * @property {string} id Идентификатор продавца
 * @property {string} first_name Имя продавца
 * @property {string} last_name Фамилия
 * @property {string} start_date Дата начала работы
 * @property {string} position Должность
 */

/**
 * @typedef {Object} Customer Покупатель
 * @property {string} id Идентификатор покупателя
 * @property {string} first_name Имя покупателя
 * @property {string} last_name Фамилия
 * @property {string} phone Телефон
 * @property {string} workplace Место работы
 * @property {string} position Должность
 */

/**
 * @typedef {Object} Product Товар
 * @property {string} name Наименование товара
 * @property {string} category Категория
 * @property {string} sku Идентификатор товара
 * @property {number} purchase_price Закупочная цена
 * @property {number} sale_price Цена продажи
 */

/**
 * @typedef {Object} ReceiptLine Строка чека продажи
 * @property {string} sku Идентификатор товара
 * @property {number} discount Скидка в процентах
 * @property {number} quantity Количество
 * @property {number} sale_price Цена
 */

/**
 * @typedef {Object} Receipt Запись о продаже
 * @property {string} receipt_id Идентификатор продажи
 * @property {string} date Дата продажи
 * @property {string} seller_id Идентификатор продавца
 * @property {string} customer_id Идентификатор покупателя
 * @property {ReceiptLine[]} items Товары
 * @property {number} total_amount Общая стоимость
 * @property {number} total_discount Общая скидка
 */

/**
 * @typedef {Object} Data Данные о продажах
 * @property {Seller[]} sellers Данные о продавцах
 * @property {Customer[]} customers Данные о покупателях
 * @property {Product[]} products Данные о товарах
 * @property {Receipt[]} purchase_records Продажи
 */

/**
 * Функция для расчета выручки
 * @param {ReceiptLine} purchase Запись о продаже
 * @param {Product} _product Карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  const discount = 1 - purchase.discount / 100;
  return purchase.sale_price * purchase.quantity * discount;
}

/**
 * @typedef {Object} Stat Статистика по продавцу
 * @property {string} seller_id Идентификатор продавца
 * @property {string} name Имя и фамилия продавца
 * @property {number} revenue Общая выручка продавца
 * @property {number} profit Общая прибыль продавца
 * @property {number} sales_count Количество продаж
 * @property {Object.<string, number>} products_sold Количество проданных товаров, ключ: sku, значение: количество
 */

/**
 * Функция для расчета бонусов
 * @param {number} index Порядковый номер в отсортированном массиве
 * @param {number} total Общее число продавцов
 * @param {Stat} seller Карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  const { profit } = seller;
  switch (total) {
    case 1:
      return 0;
    case 2:
      if (index === 0) return profit * 0.15;
      return 0;
    case 3: {
      switch (index) {
        case 0:
          return profit * 0.15;
        case 1:
          return profit * 0.1;
        case 2:
          return 0;
      }
    }
    default: {
      switch (index) {
        case 0:
          return profit * 0.15;
        case 1:
        case 2:
          return profit * 0.1;
        case total - 1:
          return 0;
        default:
          return profit * 0.05;
      }
    }
  }
}

/**
 * @typedef {Object} TopProduct Запись о топ-10 товарах
 * @property {string} sku Идентификатор товара
 * @property {number} quantity Количество
 */

/**
 * @typedef {Object} Result Результат расчёта
 * @property {string} seller_id Идентификатор продавца
 * @property {string} name Имя и фамилия продавца
 * @property {number} revenue Общая выручка с учётом скидок
 * @property {number} profit Прибыль от продаж продавца
 * @property {number} sales_count: Количество продаж
 * @property {TopProduct[]} top_products Топ-10 проданных товаров в штуках
 * @property {number} bonus Итоговый бонус в рублях, не процент
 */

/**
 * Функция для анализа данных продаж
 * @param {Data} data Данные о продажах
 * @param {{calculateRevenue: function(ReceiptLine, Product): number, calculateBonus: function(number, number, Stat): number}} options
 * @returns {Result[]}
 */
function analyzeSalesData(data, options) {
  // Проверка входных данных
  if (
    !data ||
    !Array.isArray(data.sellers) ||
    !Array.isArray(data.customers) ||
    !Array.isArray(data.products) ||
    !Array.isArray(data.purchase_records) ||
    data.sellers.length === 0 ||
    data.customers.length === 0 ||
    data.products.length === 0 ||
    data.purchase_records.length === 0
  )
    throw new Error("Некоректные входные данные");

  // Проверка наличия опций
  const { calculateRevenue, calculateBonus } = options;
  if (
    !calculateRevenue ||
    !calculateBonus ||
    typeof calculateRevenue !== "function" ||
    typeof calculateBonus !== "function"
  )
    throw new Error("Неверные options");

  // Индексация товаров для быстрого доступа
  const recordsByProduct = data.products.reduce((acc, product) => {
    acc[product.sku] = product;
    return acc;
  }, {});

  // Расчет выручки и прибыли для каждого продавца
  const sellersStatInit = data.sellers.reduce((acc, seller) => {
    acc[seller.id] = {
      seller_id: seller.id,
      name: `${seller.first_name} ${seller.last_name}`,
      revenue: 0,
      profit: 0,
      sales_count: 0,
      products_sold: {},
    };
    return acc;
  }, {});
  const sellersStat = data.purchase_records.reduce((stat, purchase) => {
    const sellerId = purchase.seller_id;
    stat[sellerId].sales_count += 1;
    stat[sellerId].revenue += purchase.total_amount;
    purchase.items.forEach((item) => {
      const sku = item.sku;
      const product = recordsByProduct[sku];
      const revenue = calculateRevenue(item, product);
      stat[sellerId].profit += revenue - product.purchase_price * item.quantity;
      if (!stat[sellerId].products_sold[sku])
        stat[sellerId].products_sold[sku] = 0;
      stat[sellerId].products_sold[sku] += item.quantity;
    });
    return stat;
  }, sellersStatInit);
  // Сортировка продавцов по прибыли
  const sellers = Object.entries(sellersStat)
    .map(([_, seller]) => seller)
    .sort((a, b) => b.profit - a.profit);
  // Назначение премий на основе ранжирования
  const sellersBonus = sellers.map((stat, index, array) => {
    const bonus = calculateBonus(index, array.length, stat);
    return {
      bonus,
      ...stat,
    };
  });
  // Подготовка итоговой коллекции с нужными полями
  return sellersBonus.map((seller) => {
    const { products_sold, bonus, revenue, profit, ...record } = seller;
    const top_products = Object.entries(products_sold)
      .map(([sku, quantity]) => {
        return { sku, quantity };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    return {
      top_products,
      revenue: +revenue.toFixed(2),
      profit: +profit.toFixed(2),
      bonus: +bonus.toFixed(2),
      ...record,
    };
  });
}
