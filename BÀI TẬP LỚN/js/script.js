// =====================
// Utility Functions
// =====================

// Lấy danh sách người dùng từ localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

// Lưu danh sách người dùng vào localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Lấy người dùng hiện tại từ localStorage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Lưu người dùng hiện tại vào localStorage
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Xóa người dùng hiện tại khỏi localStorage
function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// =====================
// Đăng ký người dùng
// =====================
function registerUser(username, password) {
  const users = getUsers();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    alert('Tài khoản đã tồn tại. Vui lòng chọn tên đăng nhập khác.');
    return false;
  }
  users.push({ username, password });
  saveUsers(users);
  alert('Đăng ký thành công!');
  return true;
}

// =====================
// Đăng nhập người dùng
// =====================
function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    setCurrentUser(user);
    alert('Đăng nhập thành công!');
    return true;
  } else {
    alert('Tên đăng nhập hoặc mật khẩu không đúng.');
    return false;
  }
}

// =====================
// Giỏ hàng
// =====================

// Lấy giỏ hàng của người dùng hiện tại
function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  return JSON.parse(localStorage.getItem(`cart_${user.username}`)) || [];
}

// Lưu giỏ hàng của người dùng hiện tại
function saveCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  const user = getCurrentUser();
  if (!user) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
    return;
  }

  const quantity = parseInt(prompt('Nhập số lượng muốn mua:', '1'));
  if (isNaN(quantity) || quantity <= 0) {
    alert('Số lượng không hợp lệ.');
    return;
  }

  const cart = getCart();
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  saveCart(cart);
  alert('Đã thêm vào giỏ hàng thành công!');
}

// Hiển thị giỏ hàng
function displayCart() {
  const cart = getCart();
  const cartContainer = document.getElementById('cart-container');
  const totalContainer = document.getElementById('total-container');
  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="100">
      <div>
        <h3>${item.name}</h3>
        <p>Giá: ${item.price.toLocaleString()} VND</p>
        <p>Số lượng: ${item.quantity}</p>
        <p>Thành tiền: ${itemTotal.toLocaleString()} VND</p>
      </div>
    `;
    cartContainer.appendChild(itemElement);
  });

  totalContainer.innerText = `Tổng cộng: ${total.toLocaleString()} VND`;
}

// Thanh toán giỏ hàng
function checkout() {
  const user = getCurrentUser();
  if (!user) {
    alert('Vui lòng đăng nhập để thanh toán.');
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    alert('Giỏ hàng của bạn đang trống.');
    return;
  }

  const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
  const orderId = 'DH' + Date.now();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const status = Math.random() < 0.5 ? 'Đã xác nhận' : 'Chưa xác nhận';

  orders.push({ orderId, items: cart, total, status });
  localStorage.setItem(`orders_${user.username}`, JSON.stringify(orders));

  // Xóa giỏ hàng sau khi thanh toán
  saveCart([]);
  alert('Thanh toán thành công!');
  // Cập nhật hiển thị giỏ hàng
  if (typeof displayCart === 'function') {
    displayCart();
  }
}

// =====================
// Đơn hàng
// =====================

// Hiển thị đơn hàng
function displayOrders() {
  const user = getCurrentUser();
  if (!user) {
    alert('Vui lòng đăng nhập để xem đơn hàng.');
    return;
  }

  const orders = JSON.parse(localStorage.getItem(`orders_${user.username}`)) || [];
  const ordersContainer = document.getElementById('orders-container');
  ordersContainer.innerHTML = '';

  orders.forEach(order => {
    const orderElement = document.createElement('div');
    orderElement.className = 'order-item';
    orderElement.innerHTML = `
      <h3>Mã đơn hàng: ${order.orderId}</h3>
      <p>Trạng thái: ${order.status}</p>
      <p>Tổng tiền: ${order.total.toLocaleString()} VND</p>
      <ul>
        ${order.items.map(item => `<li>${item.name} - Số lượng: ${item.quantity}</li>`).join('')}
      </ul>
    `;
    ordersContainer.appendChild(orderElement);
  });
}
