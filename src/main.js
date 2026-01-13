/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;
    const discount = 1 - (purchase.discount / 100);
    return  sale_price * quantity * discount;
   // @TODO: Расчет выручки от операции
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller;
    if (index = 0) {
    return bonus * 0.15;
} else if (index = 1 || index = 2) {
    return bonus * 0.1;
} else if (index = total -1 ) {
    return 0;
} else {
    return bonus * 0.05;
}
    // @TODO: Расчет бонуса от позиции в рейтинге
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
     const { calculateRevenue, calculateBonus } = options; // Проверка что CalculateRevenue и CalculateBonus - это опции
     typeof calculateRevenue === "function"; // Проверка что Calculate Revenue - это функция
     if (!data || !options) {
    throw new Error('Чего-то не хватает'); // Проверка что переменные определены
} 
    if (!data
    || !Array.isArray(data.sellers) & !Array.isArray(data.products) & !Array.isArray(data.purchase_records)
    || data.sellers.length === 0 || data.products.length === 0 || data.purchase_records.length === 0
) {
    throw new Error('Некорректные входные данные');
} 
// @TODO: Проверка входных данных
     const sellerStats = data.sellers.map(seller => ({
   // Заполним начальными данными
}));  
// @TODO: Подготовка промежуточных данных для сбора статистики

    const someIndex = Object.fromEntries(data.sellers.map(sellers => [sellers.ID, sellers]));
    const sellerIndex = {id, sellerStats} // Ключом будет id, значением — запись из sellerStats
    const productIndex = {sku, dataProducts} // Ключом будет sku, значением — запись из data.products
    // @TODO: Индексация продавцов и товаров для быстрого доступа

    data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id]; // Продавец
        sales_count++; // Увеличить количество продаж 
         revenue+= total_amount// Увеличить общую сумму выручки всех продаж

        // Расчёт прибыли для каждого товара
        record.items.forEach(item => {
            const product = productIndex[items.sku]; // Товар
            // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
            // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
            // Посчитать прибыль: выручка минус себестоимость
        // Увеличить общую накопленную прибыль (profit) у продавца  

            // Учёт количества проданных товаров
            if (!seller.products_sold[items.sku]) {
                seller.products_sold[items.sku] = 0;
                items.sku++;
            }
            // По артикулу товара увеличить его проданное количество у продавца
        });
 });// @TODO: Расчет выручки и прибыли для каждого продавца

    sellerStats.sort((a,b)=>b.profit - a.profit);
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, profit);// Считаем бонус
        seller.top_products = seller.top_products = Object.entries(seller.products_sold);
    .map(([sku, quantity]) => ({ sku, quantity }));              
    .sort((a, b) => b.quantity - a.quantity);                    
    .slice(0, 10);        // Формируем топ-10 товаров
}); // @TODO: Сортировка продавцов по прибыли
    // @TODO: Назначение премий на основе ранжирования

    return sellerStats.map(seller => ({
        seller_id: seller.id; // Строка, идентификатор продавца
        name: seller.name;// Строка, имя продавца
        revenue: revenue; // Число с двумя знаками после точки, выручка продавца
        profit: profit;// Число с двумя знаками после точки, прибыль продавца
        sales_count: sales_count; // Целое число, количество продаж продавца
        top_products: // Массив объектов вида: { "sku": "SKU_008","quantity": 10}, топ-10 товаров продавца
        bonus: bonus+someNum.toFixed(2) // Число с двумя знаками после точки, бонус продавца
})); // @TODO: Подготовка итоговой коллекции с нужными полями
}