// ---------- Cart state ----------
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

function addItemToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += item.qty || 1;
  else cart.push({ ...item, qty: item.qty || 1 });
  saveCart();
  if (cartBtn) {
    cartBtn.classList.add('ring-2', 'ring-aqua-500');
    setTimeout(() => cartBtn.classList.remove('ring-2', 'ring-aqua-500'), 350);
  }
}

function addToCart(productId, qty = 1) {
  if (productId === 'trailvault-system') {
    addItemToCart({ id: 'tv-Medium-Cloud Teal-n', name: 'TrailVault System — Medium, Cloud Teal', price: 6900, image: '/images/4.webp', qty });
    openCart();
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
    cartItems.innerHTML = `<div class="text-center py-10 text-charcoal-400"><p class="text-sm">Your cart is empty</p><p class="text-xs mt-1">Configure your TrailVault to get started</p></div>`;
    if (checkoutBtn) { checkoutBtn.disabled = true; checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed'); }
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="flex items-start gap-4 mb-4 border-b border-ice-cyan-100 pb-4 last:border-0 last:mb-0 last:pb-0">
        <img src="${item.image}" class="w-14 h-14 rounded-lg object-cover bg-ice-cyan-50" alt="">
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-charcoal text-sm leading-snug">${item.name}</div>
          <div class="text-xs text-charcoal-500 mt-0.5">$${(item.price / 100).toFixed(2)} each</div>
          <div class="flex items-center gap-2 mt-2">
            <button onclick="changeQty('${item.id}', -1)" class="w-6 h-6 rounded border border-ice-cyan-200 text-charcoal hover:bg-deep-teal hover:text-white transition">−</button>
            <span class="w-5 text-center text-xs font-medium text-charcoal">${item.qty}</span>
            <button onclick="changeQty('${item.id}', 1)" class="w-6 h-6 rounded border border-ice-cyan-200 text-charcoal hover:bg-deep-teal hover:text-white transition">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="font-semibold text-charcoal text-sm">$${(item.price * item.qty / 100).toFixed(2)}</div>
          <button onclick="removeItem('${item.id}')" class="text-charcoal-400 hover:text-deep-teal mt-2" aria-label="Remove">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    `).join('');
    if (checkoutBtn) { checkoutBtn.disabled = false; checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed'); }
  }
}

function openCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.remove('hidden');
  requestAnimationFrame(() => cartPanel.classList.remove('translate-x-full'));
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  if (!cartDrawer) return;
  cartPanel.classList.add('translate-x-full');
  setTimeout(() => { cartDrawer.classList.add('hidden'); document.body.style.overflow = ''; }, 300);
}
function goCheckout() {
  closeCart();
  setTimeout(() => { location.href = '/checkout'; }, 250);
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartDrawer) {
  cartDrawer.querySelectorAll('[data-close-cart]').forEach(el => el.addEventListener('click', closeCart));
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartDrawer && !cartDrawer.classList.contains('hidden')) closeCart();
});

// ---------- Configurator ----------
const config = { size: 'Medium', color: 'Cloud Teal', refill: false };
const BASE_PRICE = 6900;
const REFILL_PRICE = 1400;

function money(cents) { return '$' + (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2); }

function setActiveOption(btn, group) {
  document.querySelectorAll(`[data-group="${group}"] .option-btn`).forEach(b => {
    b.classList.remove('border-deep-teal', 'bg-deep-teal/5', 'text-deep-teal');
    b.classList.add('border-ice-cyan-200', 'bg-white', 'text-charcoal');
  });
  btn.classList.remove('border-ice-cyan-200', 'bg-white', 'text-charcoal');
  btn.classList.add('border-deep-teal', 'bg-deep-teal/5', 'text-deep-teal');
}

function updateConfigurator() {
  const price = BASE_PRICE + (config.refill ? REFILL_PRICE : 0);
  const priceEl = document.getElementById('configPrice');
  const btnPrice = document.getElementById('btnPrice');
  const summary = document.getElementById('configSummary');
  if (priceEl) priceEl.textContent = money(price);
  if (btnPrice) btnPrice.textContent = money(price);
  if (summary) summary.textContent = `${config.size} · ${config.color}${config.refill ? ' · + Refill Pack' : ''}`;
}

function initConfigurator() {
  document.querySelectorAll('[data-group]').forEach(groupEl => {
    const group = groupEl.getAttribute('data-group');
    groupEl.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        config[group] = btn.getAttribute('data-value');
        setActiveOption(btn, group);
        updateConfigurator();
      });
    });
  });

  const refillToggle = document.getElementById('refillToggle');
  const refillCheck = document.getElementById('refillCheck');
  if (refillToggle) {
    refillToggle.addEventListener('click', () => {
      config.refill = !config.refill;
      if (config.refill) {
        refillCheck.classList.remove('border-ice-cyan-300', 'text-white');
        refillCheck.classList.add('bg-deep-teal', 'border-deep-teal', 'text-white');
        refillToggle.classList.add('border-deep-teal', 'bg-deep-teal/5');
        refillToggle.classList.remove('border-ice-cyan-200');
      } else {
        refillCheck.classList.add('border-ice-cyan-300', 'text-white');
        refillCheck.classList.remove('bg-deep-teal', 'border-deep-teal');
        refillToggle.classList.remove('border-deep-teal', 'bg-deep-teal/5');
        refillToggle.classList.add('border-ice-cyan-200');
      }
      updateConfigurator();
    });
  }

  const addBtn = document.getElementById('configAddBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const price = BASE_PRICE + (config.refill ? REFILL_PRICE : 0);
      const name = `TrailVault System — ${config.size}, ${config.color}${config.refill ? ' + Refill Pack' : ''}`;
      const id = `tv-${config.size}-${config.color.replace(/\s/g, '')}-${config.refill ? 'r' : 'n'}`;
      addItemToCart({ id, name, price, image: '/images/4.webp' });
      openCart();
    });
  }

  updateConfigurator();
}

// ---------- Sticky timeline ----------
function initTimeline() {
  const wrap = document.querySelector('.timeline-wrap');
  if (!wrap) return;
  const clockDisplay = document.getElementById('clockDisplay');
  const clockNeedle = document.getElementById('clockNeedle');
  const clockPhase = document.getElementById('clockPhase');
  const panels = Array.from(document.querySelectorAll('.timeline-panel'));
  const TOTAL_MIN = 210; // 3:30

  const phases = ['Brain & nose drain', 'Physical tug & resistance', 'Calm wind-down'];

  function formatClock(min) {
    const m = Math.min(TOTAL_MIN, Math.max(0, Math.round(min)));
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  }

  function setNeedle(p) {
    if (!clockNeedle) return;
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    if (desktop) {
      clockNeedle.style.left = '50%';
      clockNeedle.style.top = (p * 100) + '%';
    } else {
      clockNeedle.style.top = '50%';
      clockNeedle.style.left = (p * 100) + '%';
    }
    clockNeedle.style.transform = 'translate(-50%, -50%)';
  }

  function update(progress) {
    const minutes = progress * TOTAL_MIN;
    if (clockDisplay) clockDisplay.textContent = formatClock(minutes);
    setNeedle(progress);

    let active = 0;
    if (minutes >= 165) active = 2;
    else if (minutes >= 110) active = 1;

    panels.forEach((panel, i) => {
      const on = i === active;
      panel.style.opacity = on ? '1' : '0';
      panel.style.transform = on ? 'translateY(0)' : 'translateY(18px)';
      panel.style.pointerEvents = on ? 'auto' : 'none';
    });
    if (clockPhase) clockPhase.textContent = phases[active];
  }

  update(0);

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => update(self.progress)
    });
  } else {
    window.addEventListener('scroll', () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      update(p);
    });
  }

  window.addEventListener('resize', () => {
    const rect = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - window.innerHeight;
    setNeedle(Math.min(1, Math.max(0, -rect.top / total)));
  });
}

// ---------- Reveal animations ----------
function initReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  });

  gsap.fromTo('.problem-card', { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.12,
    scrollTrigger: { trigger: '#problem', start: 'top 70%', toggleActions: 'play none none reverse' }
  });

  gsap.fromTo('.hero-copy', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' });
  gsap.fromTo('.hero-visual', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1, delay: 0.15, ease: 'power2.out' });
}

// ---------- FAQ ----------
function toggleFaq(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('svg');
  const isHidden = content.classList.contains('hidden');
  content.classList.toggle('hidden');
  if (icon) icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initConfigurator();
  initTimeline();
  initReveals();
});

window.addToCart = addToCart;
window.addItemToCart = addItemToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.goCheckout = goCheckout;
window.changeQty = changeQty;
window.removeItem = removeItem;
window.toggleFaq = toggleFaq;
