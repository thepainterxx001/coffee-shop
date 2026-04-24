import toast from "./src/utils/toast.js";
import scrollY from "./src/utils/scrollY.js";

let PRODUCTS = [];
let CART = {}; // id -> qty

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:5001/api/products/all-products');
    const data = await response.json();
    PRODUCTS = data.products;

    renderFeatured();
    renderGrid(PRODUCTS);
  } catch (error) {
    console.error("Failed to load products:", error);
    document.getElementById('productsGrid').innerHTML = '<p style="color:red;">Error loading products. Is the server running?</p>';
  }
}

fetchProducts();

// Featured section
function renderFeatured() {
  const el = document.getElementById('featuredStrip');
  el.innerHTML = '';
  PRODUCTS.slice(0, 4).forEach(p => {
    const d = document.createElement('div');
    d.className = 'feat';
    d.innerHTML = `<img src="${p.img}" alt=""><div style="margin-top: 8px; font-weight: 700">${p.name}</div><div style="color: #666">₱${p.price.toFixed(2)}</div>`;
    el.appendChild(d);
  });
}

// Render products grid
function renderGrid(list) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  list.forEach(p => {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <div class="title">${p.name}</div>
            <div class="meta"><div class="price">₱ ${p.price.toFixed(2)}</div><div style="color:#888">In stock</div></div>
            <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn open-modal" onclick="openModal(${p.id})">View</button>
            <button class="btn ghost" onclick="addToCart(${p.id})">Add</button>
            </div>
        `;
    grid.appendChild(c);
  });
}

/* Search Logic */
document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();

  const hero = document.getElementById('heroSection');
  const featured = document.getElementById('featuredStrip');
  const featuredTitle = document.getElementById('featuredTitle');
  const productsTitle = document.getElementById('productsTitle');

  if (!q) {
    // reset original state
    if (hero) hero.style.display = '';
    if (featured) featured.style.display = '';
    if (featuredTitle) featuredTitle.style.display = '';
    if (productsTitle) productsTitle.textContent = 'Shop Products';

    renderFeatured();
    renderGrid(PRODUCTS);
    return;
  }

  // Hide elements when search
  if (hero) hero.style.display = 'none';
  if (featured) featured.style.display = 'none';
  if (featuredTitle) featuredTitle.style.display = 'none';

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );

  // Change the product title based on the search if it has a result or none
  if (productsTitle) {
    if (filtered.length === 0) {
      productsTitle.textContent = `No results found for "${q}"`;
      productsTitle.style.color = "#888";
    } else {
      productsTitle.textContent = `Search results for "${q}"`;
      productsTitle.style.color = "";
    }
  }

  renderGrid(filtered);
});

// --- CATEGORY DROPDOWN  ---
const catalogBtn = document.getElementById('catalogBtn');
const dropdown = document.getElementById('categoryDropdown');

catalogBtn.addEventListener('click', (event) => {
  event.stopPropagation();

  const isVisible = dropdown.style.display === 'flex';

  if (!isVisible) {
    const categories = [...new Set(PRODUCTS.map(p => p.category))];

    dropdown.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'dropdown-item';
    allBtn.textContent = 'All Products';
    allBtn.onclick = () => filterByCategory('');
    dropdown.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'dropdown-item';
      btn.textContent = cat;
      btn.onclick = () => filterByCategory(cat);
      dropdown.appendChild(btn);
    });

    dropdown.style.display = 'flex';
  } else {
    dropdown.style.display = 'none';
  }
});

document.addEventListener('click', () => {
  if (dropdown && dropdown.style.display === 'flex') {
    dropdown.style.display = 'none';
  }
});

function filterByCategory(choice) {
  if (!choice) {
    document.getElementById('productsTitle').textContent = 'Shop Products';
    renderGrid(PRODUCTS);
  } else {
    const filtered = PRODUCTS.filter(p => p.category.toLowerCase() === choice.toLowerCase());
    document.getElementById('productsTitle').textContent = `${choice} Products`;

    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('featuredStrip').style.display = 'none';
    document.getElementById('featuredTitle').style.display = 'none';

    renderGrid(filtered);
  }

  // Hide dropdown after selecting
  dropdown.style.display = 'none';
}

/* Modal logic */
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalPrice').textContent = p.price.toFixed(2);
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalQty').value = 1;
  document.getElementById('modalAdd').onclick = () => { addToCart(id, Number(document.getElementById('modalQty').value)); closeModal(); };
  document.getElementById('modal').style.display = 'flex';
}

function closeModal(e) {
  if (e === undefined || e.target) document.getElementById('modal').style.display = 'none';
}
function changeQty(delta) {
  const qEl = document.getElementById('modalQty');
  let v = Number(qEl.value) || 1; v = Math.max(1, v + delta); qEl.value = v;
}

function closeValidationModal(e) {
  if (e === undefined || e.target) {
    document.getElementById('validationModal').style.display = 'none';
  }
}

/* Cart operations */
function addToCart(id, qty = 1) {
  toast("added");
  CART[id] = (CART[id] || 0) + qty;
  renderCart(); flashCart();
}

function renderCart() {
  const list = document.getElementById('cartList');
  const keys = Object.keys(CART);
  list.innerHTML = '';
  let total = 0;
  if (keys.length === 0) { list.innerHTML = '<div style="color:#666;padding:6px">Cart is empty</div>'; document.getElementById('count').textContent = 0; document.getElementById('cartTotal').textContent = '0.00'; return; }
  keys.forEach(k => {
    const p = PRODUCTS.find(x => x.id == k);
    const qty = CART[k];
    const subtotal = p.price * qty;
    total += subtotal;
    const row = document.createElement('div'); row.className = 'cart-item';
    row.innerHTML = `<div>
      <div style="font-weight:700">${p.name}</div>
      <div style="color:#666;font-size:13px">₱ ${p.price.toFixed(2)} × ${qty}</div>
    </div>
    <div style="text-align:right">
      <div style="font-weight:700">₱ ${subtotal.toFixed(2)}</div>
      <div style="margin-top:6px;display:flex;gap:6px;justify-content:flex-end">
        <button class="icon-btn" onclick="changeItemQty(${p.id},-1)">−</button>
        <button class="icon-btn" onclick="changeItemQty(${p.id},1)">+</button>
        <button class="icon-btn" onclick="removeItem(${p.id})">🗑</button>
      </div>
    </div>`;
    list.appendChild(row);
  });
  document.getElementById('count').textContent = Object.values(CART).reduce((s, q) => s + q, 0);
  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function changeItemQty(id, delta) {
  const cur = CART[id] || 0;
  CART[id] = Math.max(0, cur + delta);
  if (CART[id] === 0) delete CART[id];
  renderCart();
}
function removeItem(id) { delete CART[id]; renderCart(); }
function clearCart() { CART = {}; renderCart(); }

/* small UI helpers */
document.getElementById('cartBtn').addEventListener('click', () => {
  const p = document.getElementById('cartPanel');
  p.style.display = (p.style.display === 'none' || p.style.display === '') ? 'block' : 'none';
});
function flashCart() {
  const el = document.getElementById('count');
  el.style.transform = 'scale(1.2)'; setTimeout(() => el.style.transform = 'scale(1)', 160);
}

// --- CHECKOUT UI LOGIC ---
function checkout() {
  if (Object.keys(CART).length === 0) {
    document.getElementById('validationIcon').textContent = "🛒";
    document.getElementById('validationTitle').textContent = "Cart is Empty";
    document.getElementById('validationMessage').textContent = "Your cart is empty! Add some products first.";
    document.getElementById('validationModal').style.display = 'flex';
    return;
  }
  document.getElementById('chkTotal').textContent = document.getElementById('cartTotal').textContent;
  document.getElementById('cartPanel').style.display = 'none';
  document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckout(e) {
  if (e === undefined || e.target) document.getElementById('checkoutModal').style.display = 'none';
}

// --- CHECKOUT BACKEND LOGIC ---
async function confirmOrder() {
  const name = document.getElementById('chkName').value;
  const address = document.getElementById('chkAddress').value;
  const payment = document.getElementById('chkPayment').value;

  // Basic validation
  if (!name || !address) {
    document.getElementById('validationMessage').textContent = "Please fill in your name and address so we can deliver your order/s!";
    document.getElementById('validationModal').style.display = 'flex';
    return;
  }

  // Change the button text
  const confirmBtn = document.querySelector('#checkoutModal .btn:not(.ghost)');
  const originalText = confirmBtn.textContent;
  confirmBtn.textContent = "Processing...";
  confirmBtn.disabled = true;

  try {
    const orderItems = [];
    let calculatedTotal = 0;

    for (const [id, qty] of Object.entries(CART)) {
      const product = PRODUCTS.find(p => p.id == id);
      const subtotal = product.price * qty;
      calculatedTotal += subtotal;

      orderItems.push({
        productId: Number(id),
        name: product.name,
        quantity: qty,
        subtotal: subtotal
      });
    }

    const orderData = {
      customerName: name,
      address: address,
      paymentMethod: payment,
      items: orderItems,
      totalAmount: calculatedTotal
    };

    const response = await fetch('http://localhost:5001/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    // Server's response
    if (response.ok) {
      document.getElementById('validationIcon').textContent = "🎉";
      document.getElementById('validationTitle').textContent = "Success!";
      document.getElementById('validationMessage').innerHTML = `Thank you, ${name}!<br>Your order via ${payment.toUpperCase()} is confirmed.<br><strong>Order ID:</strong> ${result.orderId}`;
      document.getElementById('validationModal').style.display = 'flex';

      document.getElementById('chkName').value = '';
      document.getElementById('chkAddress').value = '';
      closeCheckout();
      clearCart();
    } else {
      document.getElementById('validationIcon').textContent = "❌";
      document.getElementById('validationTitle').textContent = "Order Failed";
      document.getElementById('validationMessage').textContent = result.message;
      document.getElementById('validationModal').style.display = 'flex';
    }

  } catch (error) {
    console.error("Checkout Error:", error);
    document.getElementById('validationIcon').textContent = "🔌";
    document.getElementById('validationTitle').textContent = "Connection Error";
    document.getElementById('validationMessage').textContent = "Could not connect to the server. Please ensure the backend is running.";
    document.getElementById('validationModal').style.display = 'flex';
  } finally {
    // Reset button back to normal
    confirmBtn.textContent = originalText;
    confirmBtn.disabled = false;
  }
}

// --- AUTHENTICATION MODAL ---

// Open Modal (Defaults to Login view)
document.getElementById('loginBtn').addEventListener('click', () => {
  toggleAuthView('login');
  document.getElementById('authModal').style.display = 'flex';
});

// Close the Modal
function closeAuthModal(e) {
  if (e === undefined || e.target) {
    document.getElementById('authModal').style.display = 'none';
  }
}

// Login and Sign Up views
function toggleAuthView(view, event) {
  if (event) event.preventDefault();

  const loginView = document.getElementById('loginView');
  const signupView = document.getElementById('signupView');

  if (view === 'login') {
    loginView.style.display = 'block';
    signupView.style.display = 'none';
  } else if (view === 'signup') {
    loginView.style.display = 'none';
    signupView.style.display = 'block';
  }
}

function processLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  console.log("Attempting to login with:", email);
  alert("Still working on backend...");
}

function processSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  console.log("Attempting to sign up:", name, email);
  alert("Still working on backend...");
}

// global functions for HTML inline event handlers
window.openModal = openModal;
window.addToCart = addToCart;
window.filterByCategory = filterByCategory;
window.closeModal = closeModal;
window.changeItemQty = changeItemQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.checkout = checkout;
window.closeCheckout = closeCheckout;
window.changeQty = changeQty;
window.confirmOrder = confirmOrder;
window.closeValidationModal = closeValidationModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthView = toggleAuthView;
window.processLogin = processLogin;
window.processSignup = processSignup;


// Initial render
renderCart();

// --- HOME NAVIGATION ---
function goHome() {
  document.getElementById('search').value = '';

  document.getElementById('heroSection').style.display = '';
  document.getElementById('featuredStrip').style.display = '';
  document.getElementById('featuredTitle').style.display = '';

  document.getElementById('productsTitle').textContent = 'Shop Products';

  renderGrid(PRODUCTS);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('homeBtn').addEventListener('click', goHome);
document.getElementById('homeLogo').addEventListener('click', goHome);

// Shop Now button
document.getElementById('shopNow').addEventListener('click', () => {
  window.scrollTo({
    top: 600, behavior: 'smooth'
  });
});

// scroll detector to change the style of header/navbar
scrollY();