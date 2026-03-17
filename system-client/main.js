const PRODUCTS = [
    { id: 1, name: 'Barako Brew 250g', price: 199.00, img: 'images/barako-brew.jpg', description: 'Rich barako roast with deep aroma.' }, 
    { id: 2, name: 'Kape-Ling Ka Ceramic Mug', price: 299.00, img: 'images/ceramic-mug.jpg', description: 'Thick ceramic mug—perfect for barako.' },
    { id: 3, name: 'Snack Combo Box', price: 179.00, img: 'images/snack-combo-box.jpg', description: 'Local snacks pack, limited time.' },
    { id: 4, name: 'Gift Card ₱500', price: 500.00, img: 'images/gift-card.jpg', description: 'Give the gift of taste.' },
    { id: 5, name: 'Coffee Grinder', price: 899.00, img: 'images/coffee-grinder.jpg', description: 'Manual burr grinder for fresh brew.' },
    { id: 6, name: 'Retro Pixel Poster', price: 129.00, img: 'images/retro-pixel-poster.jpg', description: 'Pixelated Kape-Ling Ka Coffee Shop art print.' }
];

let CART = {}; // id -> qty

// Featured section n'ggas
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
            <button class="btn" onclick="openModal(${p.id})">View</button>
            <button class="btn ghost" onclick="addToCart(${p.id})">Add</button>
            </div>
        `;
        grid.appendChild(c);
    });
}

/* ** THIS IS THE INITIAL SEARCH LOGIC (saved as backup) ** */

// document.getElementById('search').addEventListener('input', (e)=>{
//   const q = e.target.value.trim().toLowerCase();
//   if(!q) return renderGrid(PRODUCTS);
//   renderGrid(PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
// });

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

/* Modal logic */
function openModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalPrice').textContent = p.price.toFixed(2);
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalQty').value = 1;
  document.getElementById('modalAdd').onclick = ()=>{ addToCart(id, Number(document.getElementById('modalQty').value)); closeModal(); };
  document.getElementById('modal').style.display = 'flex';
}
function closeModal(e){ if(e===undefined || e.target) document.getElementById('modal').style.display='none'; }
function changeQty(delta){
  const qEl = document.getElementById('modalQty');
  let v = Number(qEl.value)||1; v = Math.max(1, v + delta); qEl.value = v;
}

/* Cart operations */
function addToCart(id, qty=1){
  CART[id] = (CART[id]||0) + qty;
  renderCart(); flashCart();
}
function renderCart(){
  const list = document.getElementById('cartList');
  const keys = Object.keys(CART);
  list.innerHTML = '';
  let total = 0;
  if(keys.length===0){ list.innerHTML = '<div style="color:#666;padding:6px">Cart is empty</div>'; document.getElementById('count').textContent = 0; document.getElementById('cartTotal').textContent = '0.00'; return; }
  keys.forEach(k=>{
    const p = PRODUCTS.find(x => x.id==k);
    const qty = CART[k];
    const subtotal = p.price * qty;
    total += subtotal;
    const row = document.createElement('div'); row.className='cart-item';
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
  document.getElementById('count').textContent = Object.values(CART).reduce((s,q)=>s+q,0);
  document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function changeItemQty(id, delta){
  const cur = CART[id]||0;
  CART[id] = Math.max(0, cur + delta);
  if(CART[id]===0) delete CART[id];
  renderCart();
}
function removeItem(id){ delete CART[id]; renderCart(); }
function clearCart(){ CART = {}; renderCart(); }
function checkout(){ alert('Demo checkout — No backend to process payments yet.'); }

/* small UI helpers */
document.getElementById('cartBtn').addEventListener('click', ()=> {
  const p = document.getElementById('cartPanel');
  p.style.display = (p.style.display === 'none' || p.style.display==='') ? 'block' : 'none';
});
function flashCart(){
  const el = document.getElementById('count');
  el.style.transform = 'scale(1.2)'; setTimeout(()=>el.style.transform='scale(1)',160);
}

// Initial render
renderFeatured();
renderGrid(PRODUCTS);
renderCart();

// Shop Now button
document.getElementById('shopNow').addEventListener('click', ()=> {
    window.scrollTo({
        top: 600, behavior: 'smooth'
    });
});




