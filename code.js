const products = [
  { id: 1, title: 'Яблоко', price: 50, category: 'fruits' },
  { id: 2, title: 'Банан', price: 40, category: 'fruits' },
  { id: 3, title: 'Морковь', price: 30, category: 'vegetables' },
  { id: 4, title: 'Помидор', price: 45, category: 'vegetables' },
  { id: 5, title: 'Сок апельсиновый', price: 120, category: 'drinks' },
  { id: 6, title: 'Вода минеральная', price: 60, category: 'drinks' }
];

let cart = [];

const productsContainer = document.getElementById('productsContainer');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const payButton = document.getElementById('payButton');
const clearCartButton = document.getElementById('clearCartButton');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');


// Фильтрация товаров по строке поиска и категории
const filterProducts = () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  return products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchValue);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

// Отрисовка каталога товаров
const renderProducts = () => {
  const filtered = filterProducts();

  productsContainer.innerHTML = '';

  filtered.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';

    productDiv.innerHTML = `
      <div class="product-title">${product.title}</div>
      <div class="product-category">Категория: ${product.category}</div>
      <div class="product-price">${product.price} ₽</div>
      <button class="btn-add" data-id="${product.id}">Добавить в корзину</button>
    `;

    productsContainer.appendChild(productDiv);
  });

  // Найти все кнопки "Добавить в корзину" и повесить обработчики
  const addButtons = productsContainer.querySelectorAll('.btn-add');
  addButtons.forEach(button => {
    button.addEventListener('click', onAddToCartClick);
  });
};

// Подсчет общей суммы корзины
const calculateCartTotal = () => {
  return cart.reduce((sum, item) => sum + item.price, 0);
};

// Отрисовка корзины
const renderCart = () => {
  cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';

    cartItemDiv.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-title">${item.title}</span>
        <span class="cart-item-price">${item.price} ₽</span>
      </div>
      <button class="btn-remove" data-index="${index}">Удалить</button>
    `;

    cartItemsContainer.appendChild(cartItemDiv);
  });

  // Обновить сумму
  const total = calculateCartTotal();
  cartTotalElement.textContent = `Итого: ${total} ₽`;

  // Навесить обработчики на кнопки "Удалить"
  const removeButtons = cartItemsContainer.querySelectorAll('.btn-remove');
  removeButtons.forEach(button => {
    button.addEventListener('click', onRemoveFromCartClick);
  });
};

// Обработчик клика по "Добавить в корзину"
const onAddToCartClick = (event) => {
  // При клике получить данные товара
  const id = Number(event.target.dataset.id);
  const product = products.find(p => p.id === id);
  if (!product) return;

  // добавить в массив корзины
  cart.push(product);

  // вызвать функцию перерисовки корзины
  renderCart();
};

// Обработчик удаления одного товара из корзины
const onRemoveFromCartClick = (event) => {
  const index = Number(event.target.dataset.index);
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    renderCart();
  }
};

// Очистка корзины
const clearCart = () => {
  cart = [];
  renderCart();
};

// Обработка оплаты
const handlePay = () => {
  if (cart.length === 0) {
    // При пустой корзине
    alert('Корзина пуста. Добавьте товары перед оплатой.');
    return;
  }
  // При успешной оплате:
  alert('Покупка прошла успешно!');
  clearCart();
};

// --- Навешивание обработчиков на элементы корзины ---
payButton.addEventListener('click', handlePay);
clearCartButton.addEventListener('click', clearCart);

// Фильтры: при изменении — перерисовываем каталог
searchInput.addEventListener('input', renderProducts);
categorySelect.addEventListener('change', renderProducts);

// Стартовая отрисовка
renderProducts();
renderCart();