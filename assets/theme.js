(function () {
  'use strict';

  const settings = window.themeSettings || {};

  /* Utility */
  function qs(selector, context = document) {
    return context.querySelector(selector);
  }

  function qsa(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  }

  function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/${type}`
      }
    };
  }

  /* ── Scroll Reveal ────────────────────────────────────────────── */
  function initScrollReveal() {
    const els = qsa('.section-reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ── Sticky Header ────────────────────────────────────────────── */
  function initStickyHeader() {
    const headerGroup = qs('.header-group');
    if (!headerGroup) return;

    let ticking = false;

    function updateHeader() {
      const scrolled = window.scrollY > 60;
      headerGroup.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  /* ── Mobile Menu ──────────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = qs('[data-mobile-menu-toggle]');
    const menu = qs('[data-mobile-menu]');
    const closeButtons = qsa('[data-mobile-menu-close]');

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      menu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      menu.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', openMenu);
    closeButtons.forEach((btn) => btn.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ── Search Modal ─────────────────────────────────────────────── */
  function initSearch() {
    const openButtons = qsa('[data-search-open]');
    const modal = qs('#search-modal');
    if (!modal) return;
    const closeButtons = qsa('[data-search-close]', modal);

    function openSearch() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      const input = qs('.search-modal__input', modal);
      if (input) setTimeout(() => input.focus(), 50);
    }

    function closeSearch() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    openButtons.forEach((btn) => btn.addEventListener('click', openSearch));
    closeButtons.forEach((btn) => btn.addEventListener('click', closeSearch));
    qs('.search-modal__overlay', modal)?.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeSearch();
    });
  }

  /* ── Localhost Mock Cart Engine Data ─────────────────────────── */
  const isLocalhost = window.location.port === '5000' || window.location.hostname === 'localhost';

  const MOCK_PRODUCTS = {
    "1": { title: "Seoul Street Jersey", price: 1499.00, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    "2": { title: "Brooklyn Retro Jersey", price: 1299.00, img: "https://images.unsplash.com/photo-1571945153237-4929e78394a9?q=80&w=600&auto=format&fit=crop" },
    "3": { title: "Parachute Cargo Pants", price: 2199.00, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop" },
    "4": { title: "Zara Style Corduroy Shirt", price: 1699.00, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop" },
    "5": { title: "Vintage Wash Graphic Tee", price: 1199.00, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop" },
    "6": { title: "Chronicles Graffiti Tee", price: 999.00, img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop" },
    "7": { title: "Cabana Oversized Shirt", price: 1599.00, img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop" },
    "8": { title: "Raw Edge Denim Shorts", price: 1899.00, img: "https://images.unsplash.com/photo-1565084888279-aca607ecad0c?q=80&w=600&auto=format&fit=crop" },
    "9": { title: "Boxy Drop Shoulder Blank", price: 999.00, img: "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=600&auto=format&fit=crop" },
    "10": { title: "Escape Streetwear Cap", price: 999.00, img: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=600&auto=format&fit=crop" },
    "11": { title: "Heavyweight Jersey Tee", price: 999.00, img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=600&auto=format&fit=crop" },
    "12": { title: "Relaxed Cargo Shorts", price: 999.00, img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop" }
  };

  function getLocalCart() {
    try {
      const cart = localStorage.getItem('escape_mock_cart');
      if (cart) return JSON.parse(cart);
    } catch (e) {}
    return [
      { id: "1", qty: 1 },
      { id: "5", qty: 1 }
    ];
  }

  function saveLocalCart(items) {
    localStorage.setItem('escape_mock_cart', JSON.stringify(items));
  }

  /* ── Cart Drawer ──────────────────────────────────────────────── */
  class CartDrawer {
    constructor() {
      this.drawer = qs('[data-cart-drawer]');
      if (!this.drawer) return;
      this.init();
    }

    init() {
      qsa('[data-cart-open]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      qsa('[data-cart-close]').forEach((btn) => {
        btn.addEventListener('click', () => this.close());
      });

      this.drawer.addEventListener('click', (e) => {
        if (e.target.matches('[data-cart-close]')) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });

      if (isLocalhost) {
        this.updateCartCount();
      }
    }

    open() {
      this.drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.refresh();
    }

    close() {
      this.drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    async refresh() {
      if (isLocalhost) {
        this.renderMockCart();
        return;
      }

      try {
        const response = await fetch(`${settings.routes.cartUrl}?section_id=cart-drawer`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('[data-cart-drawer-content]');
        const currentContent = qs('[data-cart-drawer-content]', this.drawer);
        if (newContent && currentContent) {
          currentContent.innerHTML = newContent.innerHTML;
          this.bindEvents();
        }
      } catch (err) {
        console.error('Cart refresh failed', err);
      }
    }

    renderMockCart() {
      const items = getLocalCart();
      const contentEl = qs('[data-cart-drawer-content]', this.drawer);
      if (!contentEl) return;

      if (items.length === 0) {
        contentEl.innerHTML = `<div style="text-align:center;padding:6rem 2rem;color:rgba(255,255,255,0.4)">
          <p style="margin-bottom:1.5rem;font-size:0.95rem;letter-spacing:0.05em;">Your cart is empty.</p>
          <button type="button" class="checkout-btn" data-cart-close style="max-width:220px;display:inline-block;margin:0 auto;">START SHOPPING</button>
        </div>`;
        this.bindEvents();
        return;
      }

      let subtotal = 0;
      let itemsHtml = '<div class="cart-drawer__items">';

      items.forEach(item => {
        const prod = MOCK_PRODUCTS[item.id] || { title: "Streetwear Blanks", price: 999.00, img: "" };
        const price = prod.price * item.qty;
        subtotal += price;

        itemsHtml += `
          <div class="cart-item" data-cart-item="${item.id}">
            <img src="${prod.img}" class="cart-item__image" alt="${prod.title}">
            <div class="cart-item__details">
              <h4 class="cart-item__title">${prod.title}</h4>
              <p class="cart-item__option">Size: L</p>
              <div class="cart-item__qty-price">
                <div class="quantity-selector" data-quantity-selector>
                  <button type="button" data-quantity-minus>-</button>
                  <input type="text" value="${item.qty}" readonly data-quantity-input>
                  <button type="button" data-quantity-plus>+</button>
                </div>
                <span class="cart-item__price">₹${(prod.price * item.qty).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
              </div>
              <button type="button" class="cart-item__remove" data-cart-remove="${item.id}">Remove</button>
            </div>
          </div>`;
      });
      itemsHtml += '</div>';

      const progress = Math.min(100, (subtotal / 999) * 100);
      const diff = 999 - subtotal;
      const shippingText = diff > 0 
        ? `You are <strong>₹${diff.toLocaleString('en-IN')}</strong> away from <strong>FREE SHIPPING</strong>!`
        : `✨ You've unlocked <strong>FREE SHIPPING</strong>!`;

      itemsHtml += `
        <div class="cart-drawer__footer">
          <div class="free-shipping-bar">
            <div class="free-shipping-bar__text">${shippingText}</div>
            <div class="free-shipping-bar__progress" style="--progress: ${progress}%"></div>
          </div>
          <div class="cart-drawer__summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</strong>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>${diff > 0 ? '₹99.00' : 'FREE'}</span>
            </div>
          </div>
          <button type="button" class="checkout-btn">PROCEED TO SECURE CHECKOUT</button>
          <p class="checkout-footer-text">🔒 256-bit SSL encrypted checkout powered by Cashfree</p>
        </div>`;

      contentEl.innerHTML = itemsHtml;
      this.bindEvents();
    }

    bindEvents() {
      qsa('[data-cart-remove]', this.drawer).forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const key = btn.dataset.cartRemove;
          await this.updateItem(key, 0);
        });
      });

      qsa('[data-quantity-minus], [data-quantity-plus]', this.drawer).forEach((btn) => {
        btn.addEventListener('click', async () => {
          const wrapper = btn.closest('[data-cart-item]');
          const input = qs('[data-quantity-input]', wrapper);
          const key = wrapper.dataset.cartItem;
          let qty = parseInt(input.value, 10);
          if (btn.hasAttribute('data-quantity-minus')) {
            qty = Math.max(0, qty - 1);
          } else {
            qty += 1;
          }
          await this.updateItem(key, qty);
        });
      });

      // Handle start shopping close button inside mock cart
      const startShoppingBtn = qs('[data-cart-close]', this.drawer);
      if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', () => this.close());
      }
    }

    async updateItem(key, quantity) {
      if (isLocalhost) {
        let items = getLocalCart();
        if (quantity === 0) {
          items = items.filter(item => item.id !== key);
        } else {
          const item = items.find(item => item.id === key);
          if (item) item.qty = quantity;
        }
        saveLocalCart(items);
        this.refresh();
        this.updateCartCount();
        return;
      }

      const config = fetchConfig();
      config.body = JSON.stringify({ id: key, quantity });
      await fetch(settings.routes.cartChangeUrl, config);
      this.refresh();
      this.updateCartCount();
    }

    async updateCartCount() {
      if (isLocalhost) {
        const items = getLocalCart();
        const count = items.reduce((acc, item) => acc + item.qty, 0);
        qsa('[data-cart-count]').forEach((el) => {
          el.textContent = count;
          el.style.display = count > 0 ? 'flex' : 'none';
        });
        return;
      }

      try {
        const response = await fetch(`${settings.routes.cartUrl}.js`);
        const cart = await response.json();
        qsa('[data-cart-count]').forEach((el) => {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? 'flex' : 'none';
        });
      } catch (err) {
        console.error('Cart count update failed', err);
      }
    }

    async addItem(formData) {
      if (isLocalhost) {
        const id = formData.get('id');
        const qty = parseInt(formData.get('quantity') || '1', 10);
        let items = getLocalCart();
        const existing = items.find(item => item.id === id);
        if (existing) {
          existing.qty += qty;
        } else {
          items.push({ id, qty });
        }
        saveLocalCart(items);
        this.updateCartCount();
        this.open();
        return { success: true };
      }

      const config = fetchConfig();
      config.body = JSON.stringify({
        items: [{
          id: formData.get('id'),
          quantity: parseInt(formData.get('quantity') || '1', 10)
        }]
      });

      const response = await fetch(settings.routes.cartAddUrl, config);
      const data = await response.json();

      if (response.ok) {
        this.updateCartCount();
        if (settings.cartType === 'drawer') this.open();
      }

      return data;
    }
  }

  /* ── Product Form ─────────────────────────────────────────────── */
  function initProductForms(cartDrawer) {
    qsa('[data-product-form]').forEach((form) => {
      const jsonEl = document.querySelector('[id^="ProductJson-"]');
      if (!jsonEl) return;

      const product = JSON.parse(jsonEl.textContent);
      const variantInputs = qsa('[name="id"]', form);
      const addBtn = qs('[data-add-to-cart]', form);
      const buyBtn = qs('[data-buy-now]', form);
      const priceEl = qs('[data-product-price]', form.closest('.product-page') || document);

      qsa('[data-variant-option]', form).forEach((input) => {
        input.addEventListener('change', () => {
          const selectedOptions = qsa('[data-variant-option]:checked', form).map((el) => el.value);
          const variant = product.variants.find((v) =>
            v.options.every((opt, i) => opt === selectedOptions[i])
          );
          if (variant) {
            variantInputs.forEach((vi) => { vi.value = variant.id; });
            if (addBtn) {
              addBtn.disabled = !variant.available;
              addBtn.textContent = variant.available ? settings.strings.addToCart : settings.strings.soldOut;
            }
            if (priceEl) priceEl.innerHTML = formatMoney(variant.price);
          }
        });
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (cartDrawer) {
          await cartDrawer.addItem(new FormData(form));
        } else {
          form.submit();
        }
      });

      if (buyBtn) {
        buyBtn.addEventListener('click', async () => {
          const formData = new FormData(form);
          if (cartDrawer) await cartDrawer.addItem(formData);
          window.location.href = '/checkout';
        });
      }
    });
  }

  function formatMoney(cents) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(cents / 100);
  }

  /* ── Product Gallery ──────────────────────────────────────────── */
  function initProductGallery() {
    const gallery = qs('[data-product-gallery]');
    if (!gallery) return;

    const mainImage = qs('[data-gallery-main] img', gallery);
    const thumbs = qsa('[data-gallery-thumb]', gallery);
    const mainWrapper = qs('[data-gallery-main]', gallery);

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.galleryThumb;
        if (mainImage && src) {
          mainImage.src = src;
          mainImage.srcset = thumb.dataset.gallerySrcset || '';
        }
        thumbs.forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
    });

    if (mainWrapper) {
      mainWrapper.addEventListener('click', () => {
        mainWrapper.classList.toggle('is-zoomed');
      });
    }
  }

  /* ── Quantity Selector ────────────────────────────────────────── */
  function initQuantitySelectors() {
    qsa('[data-quantity-selector]').forEach((selector) => {
      const input = qs('[data-quantity-input]', selector);
      qs('[data-quantity-minus]', selector)?.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value, 10) - 1);
      });
      qs('[data-quantity-plus]', selector)?.addEventListener('click', () => {
        input.value = parseInt(input.value, 10) + 1;
      });
    });
  }

  /* ── Wishlist ─────────────────────────────────────────────────── */
  function initWishlist() {
    const STORAGE_KEY = 'escape_wishlist';

    function getWishlist() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
      catch { return []; }
    }

    function saveWishlist(items) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function updateUI() {
      const wishlist = getWishlist();
      qsa('[data-wishlist-toggle]').forEach((btn) => {
        const id = btn.dataset.productId;
        btn.classList.toggle('is-active', wishlist.includes(id));
      });
    }

    qsa('[data-wishlist-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.productId;
        let wishlist = getWishlist();
        if (wishlist.includes(id)) {
          wishlist = wishlist.filter((item) => item !== id);
        } else {
          wishlist.push(id);
        }
        saveWishlist(wishlist);
        updateUI();
      });
    });

    updateUI();
  }

  /* ── Size Chart Modal ─────────────────────────────────────────── */
  function initSizeChart() {
    const modal = qs('[data-size-chart-modal]');
    if (!modal) return;

    function open() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    qsa('[data-size-chart-open]').forEach((btn) => btn.addEventListener('click', open));
    qsa('[data-size-chart-close]', modal).forEach((btn) => btn.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ── Recently Viewed ──────────────────────────────────────────── */
  function initRecentlyViewed() {
    const section = qs('[data-recently-viewed]');
    if (!section) return;

    const productId = section.dataset.productId;
    const STORAGE_KEY = 'escape_recently_viewed';
    let recent = [];

    try { recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { recent = []; }

    if (productId) {
      recent = recent.filter((id) => id !== productId);
      recent.unshift(productId);
      recent = recent.slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    }
  }

  /* ── Quick Add ────────────────────────────────────────────────── */
  function initQuickAdd(cartDrawer) {
    qsa('.product-card__quick-add').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = qs('button[type="submit"]', form);
        if (btn) {
          const orig = btn.textContent;
          btn.textContent = '✓ Added';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = orig;
            btn.disabled = false;
          }, 1600);
        }
        if (cartDrawer) await cartDrawer.addItem(new FormData(form));
      });
    });
  }

  /* ── Hero Parallax ────────────────────────────────────────────── */
  function initHeroParallax() {
    const hero = qs('.hero');
    const media = qs('.hero__media');
    if (!hero || !media) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            media.style.transform = `translateY(${scrollY * 0.35}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Countdown Timer ──────────────────────────────────────────── */
  function initCountdowns() {
    qsa('[data-countdown]').forEach((el) => {
      const endStr = el.dataset.countdown;
      if (!endStr) return;
      const endTime = new Date(endStr).getTime();
      if (isNaN(endTime)) return;

      const hoursEl = qs('[data-countdown-hours]', el);
      const minsEl = qs('[data-countdown-mins]', el);
      const secsEl = qs('[data-countdown-secs]', el);
      if (!hoursEl || !minsEl || !secsEl) return;

      function pad(n) { return String(n).padStart(2, '0'); }

      function tick() {
        const now = Date.now();
        const diff = endTime - now;
        if (diff <= 0) {
          hoursEl.textContent = '00';
          minsEl.textContent = '00';
          secsEl.textContent = '00';
          return;
        }
        const totalSecs = Math.floor(diff / 1000);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        hoursEl.textContent = pad(h);
        minsEl.textContent = pad(m);
        secsEl.textContent = pad(s);
      }

      tick();
      setInterval(tick, 1000);
    });
  }

  /* ── Theme Toggle Switcher ────────────────────────────────────── */
  function initThemeToggle() {
    const btn = qs('#theme-toggle-btn');
    if (!btn) return;
    const moonIcon = qs('#theme-icon-moon');
    const sunIcon = qs('#theme-icon-sun');

    // Check saved theme
    const savedTheme = localStorage.getItem('escape_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    }

    btn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('escape_theme', isLight ? 'light' : 'dark');
      if (isLight) {
        if (moonIcon) moonIcon.style.display = 'block';
        if (sunIcon) sunIcon.style.display = 'none';
      } else {
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
      }
    });
  }

  /* ── Pincode Delivery Check ────────────────────────────────────── */
  function initPincodeCheck() {
    const triggerBtn = qs('#pincode-trigger-btn');
    const widgetBtn = qs('#floating-widget-pincode');
    const modal = qs('#pincode-modal');
    if (!modal) return;
    const closeBtn = qs('#pincode-modal-close-btn');
    const overlay = qs('#pincode-modal-overlay');
    const verifyBtn = qs('#pincode-verify-btn');
    const inputField = qs('#pincode-input-field');
    const resultMsg = qs('#pincode-result-message');
    const displaySpan = qs('#current-pincode-display');

    // Load saved pincode
    const savedPin = localStorage.getItem('escape_pincode');
    if (savedPin && displaySpan) {
      displaySpan.textContent = savedPin;
    }

    function openModal() {
      modal.classList.add('is-open');
      if (inputField) {
        inputField.value = '';
        inputField.focus();
      }
      if (resultMsg) resultMsg.innerHTML = '';
    }

    function closeModal() {
      modal.classList.remove('is-open');
    }

    triggerBtn?.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openModal(); });
    widgetBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    verifyBtn?.addEventListener('click', () => {
      const val = inputField.value.trim();
      if (!/^\d{6}$/.test(val)) {
        resultMsg.className = 'pincode-result error';
        resultMsg.textContent = '❌ Please enter a valid 6-digit numeric pincode.';
        return;
      }

      // Simulate estimation
      resultMsg.className = 'pincode-result success';
      localStorage.setItem('escape_pincode', val);
      if (displaySpan) displaySpan.textContent = val;

      if (val.startsWith('400') || val.startsWith('110') || val.startsWith('560')) {
        resultMsg.innerHTML = `🟢 <strong>Eligible for Fast Delivery!</strong><br>Standard dispatch: 24 hrs.<br>Estimated transit: 2 days (COD available).`;
      } else {
        resultMsg.innerHTML = `🟢 <strong>Delivery Available!</strong><br>Standard dispatch: 24 hrs.<br>Estimated transit: 4-5 days (COD available).`;
      }

      setTimeout(closeModal, 1500);
    });

    inputField?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') verifyBtn.click();
    });
  }

  /* ── Category Tabs Mock Filtering ─────────────────────────────── */
  function initCategoryFilter() {
    const tabs = qsa('.category-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.dataset.category;
        const products = qsa('.product-card');

        products.forEach(card => {
          const title = qs('.product-card__title', card)?.textContent.toLowerCase() || '';
          let match = false;

          if (cat === 'all') {
            match = true;
          } else if (cat === 'Jerseys' && title.includes('jersey')) {
            match = true;
          } else if (cat === 'Tees' && (title.includes('tee') || title.includes('blank'))) {
            match = true;
          } else if (cat === 'Jeans' && (title.includes('denim') || title.includes('cargo') || title.includes('pants'))) {
            match = true;
          } else if (cat === 'Trousers' && (title.includes('pants') || title.includes('shorts') || title.includes('cargo'))) {
            match = true;
          } else if (cat === 'Cargos' && title.includes('cargo')) {
            match = true;
          } else if (cat === 'Shorts' && title.includes('shorts')) {
            match = true;
          } else if (cat === 'Overshirts' && title.includes('shirt')) {
            match = true;
          } else if (cat === 'Shoes' && title.includes('shoes')) {
            match = false;
          } else if (cat === 'Sunglasses' && title.includes('sunglasses')) {
            match = false;
          } else if (cat === 'Perfumes' && title.includes('perfume')) {
            match = false;
          }

          if (match) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Gift Now action ───────────────────────────────────────────── */
  function initGiftNow() {
    const btn = qs('#gift-now-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const comboSection = qs('#combo-deals');
      if (comboSection) {
        comboSection.scrollIntoView({ behavior: 'smooth' });
        
        // Show a nice snackbar alert
        let snack = qs('#gift-snackbar');
        if (!snack) {
          snack = document.createElement('div');
          snack.id = 'gift-snackbar';
          snack.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #ff5722;
            color: #fff;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            z-index: 9999;
            box-shadow: 0 4px 24px rgba(0,0,0,0.35);
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          `;
          document.body.appendChild(snack);
        }
        snack.innerHTML = `🎁 Father's Day Special Activated! Add 3 items below for ₹999 drop rate!`;
        snack.style.opacity = '1';
        snack.style.transform = 'translateY(0)';

        setTimeout(() => {
          snack.style.opacity = '0';
          snack.style.transform = 'translateY(20px)';
        }, 4000);
      }
    });

    // Handle ask assistant chat widget
    const chatBtn = qs('#floating-widget-chat');
    chatBtn?.addEventListener('click', () => {
      alert("💬 Escape Virtual Assistant:\nHow can I help you with styling today? Ask me about sizes or delivery speeds!");
    });

    // Handle notification widget
    const notifBtn = qs('#floating-widget-notif');
    notifBtn?.addEventListener('click', () => {
      alert("🔔 Escape Notification:\nNew Drop incoming tomorrow at 12 PM! Set your alarms.");
    });
  }

  /* ── Init ─────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initStickyHeader();
    initMobileMenu();
    initCountdowns();
    initSearch();
    initQuantitySelectors();
    initWishlist();
    initSizeChart();
    initRecentlyViewed();
    initProductGallery();
    initHeroParallax();

    const cartDrawer = new CartDrawer();
    if (cartDrawer.drawer) cartDrawer.bindEvents();

    initProductForms(cartDrawer);
    initQuickAdd(cartDrawer);

    // Redesign elements init
    initThemeToggle();
    initPincodeCheck();
    initCategoryFilter();
    initGiftNow();
  });
})();
