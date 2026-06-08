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

  /* Sticky Header Scroll Animation */
  function initStickyHeader() {
    const headerGroup = qs('.header-group');
    if (!headerGroup) return;

    let ticking = false;

    function updateHeader() {
      const scrolled = window.scrollY > 40;
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

  /* Mobile Menu */
  function initMobileMenu() {
    const toggle = qs('[data-mobile-menu-toggle]');
    const menu = qs('[data-mobile-menu]');
    const closeButtons = qsa('[data-mobile-menu-close]');

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    closeButtons.forEach((btn) => btn.addEventListener('click', closeMenu));
  }

  /* Search Modal */
  function initSearch() {
    const openButtons = qsa('[data-search-open]');
    const modal = qs('#search-modal');
    const closeButtons = qsa('[data-search-close]', modal);

    if (!modal) return;

    function openSearch() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      const input = qs('.search-modal__input', modal);
      if (input) input.focus();
    }

    function closeSearch() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    openButtons.forEach((btn) => btn.addEventListener('click', openSearch));
    closeButtons.forEach((btn) => btn.addEventListener('click', closeSearch));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeSearch();
      }
    });
  }

  /* Cart Drawer */
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
    }

    async updateItem(key, quantity) {
      const config = fetchConfig();
      config.body = JSON.stringify({
        id: key,
        quantity: quantity
      });

      await fetch(settings.routes.cartChangeUrl, config);
      this.refresh();
      this.updateCartCount();
    }

    async updateCartCount() {
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
        if (settings.cartType === 'drawer') {
          this.open();
        }
      }

      return data;
    }
  }

  /* Product Form */
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
              addBtn.textContent = variant.available
                ? settings.strings.addToCart
                : settings.strings.soldOut;
            }
            if (priceEl) {
              priceEl.innerHTML = formatMoney(variant.price);
            }
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
          if (cartDrawer) {
            await cartDrawer.addItem(formData);
          }
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

  /* Product Gallery */
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

  /* Quantity Selector */
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

  /* Wishlist (localStorage) */
  function initWishlist() {
    const STORAGE_KEY = 'escape_wishlist';

    function getWishlist() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        return [];
      }
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

    const wishlistLink = qs('[data-wishlist-link]');
    if (wishlistLink) {
      wishlistLink.addEventListener('click', (e) => {
        e.preventDefault();
        const wishlist = getWishlist();
        if (wishlist.length === 0) {
          alert('Your wishlist is empty. Save items by clicking the heart icon.');
        } else {
          window.location.href = `/search?q=${wishlist.join(' OR ')}&type=product`;
        }
      });
    }

    updateUI();
  }

  /* Recently Viewed */
  function initRecentlyViewed() {
    const section = qs('[data-recently-viewed]');
    if (!section) return;

    const productId = section.dataset.productId;
    const STORAGE_KEY = 'escape_recently_viewed';
    let recent = [];

    try {
      recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      recent = [];
    }

    if (productId) {
      recent = recent.filter((id) => id !== productId);
      recent.unshift(productId);
      recent = recent.slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    }
  }

  /* Quick Add */
  function initQuickAdd(cartDrawer) {
    qsa('.product-card__quick-add').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (cartDrawer) {
          await cartDrawer.addItem(new FormData(form));
        }
      });
    });
  }

  /* Init */
  document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileMenu();
    initSearch();
    initQuantitySelectors();
    initWishlist();
    initRecentlyViewed();
    initProductGallery();

    const cartDrawer = new CartDrawer();
    if (cartDrawer.drawer) {
      cartDrawer.bindEvents();
    }

    initProductForms(cartDrawer);
    initQuickAdd(cartDrawer);
  });
})();
