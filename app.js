const products = [
  {
    id: 'trailvault-system',
    name: 'TrailVault™ 3-Hour Alone System',
    price: 6900,
    image: '/images/4.webp'
  }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('tv_cart') || '[]');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

function saveCart() {
  localStorage.setItem('tv_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
  }
  saveCart();
  if (cartBtn) {
    cartBtn.classList.add('ring-2', 'ring-aqua-500');
    setTimeout(() => cartBtn.classList.remove('ring-2', 'ring-aqua-500'), 300);
  }
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeItem(id);
  else saveCart();
}

function updateCartUI() {
  if (!cartItems) return;
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  if (cartCount) {
    cartCount.textContent = totalQty;
    cartCount.style.opacity = totalQty > 0 ? '1' : '0';
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (cartTotal) cartTotal.textContent = `$${(total / 100).toFixed(2)}`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-10 text-charcoal-400">
        <p class="text-sm">Your cart is empty</p>
        <p class="text-xs mt-1">Add the TrailVault System to get started</p>
      </div>
    `;
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="flex items-center gap-4 mb-4 border-b border-ice-cyan-100 pb-3 last:border-0 last:mb-0 last:pb-0">
        <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover">
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-charcoal text-sm truncate">${item.name}</div>
          <div class="text-xs text-charcoal-500">$${(item.price / 100).toFixed(2)} each</div>
          <div class="flex items-center gap-2 mt-1">
            <button onclick="changeQty('${item.id}', -1)" class="w-6 h-6 rounded border border-ice-cyan-200 text-charcoal hover:bg-deep-teal hover:text-white transition">−</button>
            <span class="w-4 text-center text-xs font-medium text-charcoal">${item.qty}</span>
            <button onclick="changeQty('${item.id}', 1)" class="w-6 h-6 rounded border border-ice-cyan-200 text-charcoal hover:bg-deep-teal hover:text-white transition">+</button>
          </div>
        </div>
        <button onclick="removeItem('${item.id}')" class="text-charcoal-400 hover:text-deep-teal">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    `).join('');
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

function openCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.remove('hidden');
  requestAnimationFrame(() => {
    cartPanel.classList.remove('translate-x-full');
  });
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (!cartDrawer) return;
  cartPanel.classList.add('translate-x-full');
  setTimeout(() => {
    cartDrawer.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
}

function goCheckout() {
  closeCart();
  setTimeout(() => { location.href = '/checkout'; }, 300);
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
const closeBtn = cartDrawer ? cartDrawer.querySelector('[onclick="closeCart()"]') : null;
if (closeBtn) closeBtn.addEventListener('click', closeCart);
if (cartDrawer) {
  cartDrawer.addEventListener('click', (e) => {
    if (e.target === cartDrawer) closeCart();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartDrawer && !cartDrawer.classList.contains('hidden')) closeCart();
});

// Scroll animations with GSAP ScrollTrigger
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.scroll-chapter').forEach((chapter) => {
    const img = chapter.querySelector('.scroll-img');
    if (img) {
      gsap.fromTo(img,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: chapter,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    gsap.fromTo(chapter.querySelectorAll('h3, p, button, .w-16'),
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.2,
        scrollTrigger: {
          trigger: chapter,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  gsap.fromTo('.bg-ice-cyan-50.p-8',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '#story',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.changeQty = changeQty;
window.removeItem = removeItem;
window.toggleFaq = function(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('svg');
  const open = !content.classList.contains('hidden');
  if (open) {
    content.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  } else {
    content.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  }
};
