# Escape Clothing 👣 — Shopify Theme

Premium dark streetwear theme for **Escape Clothing**. Built on Shopify Online Store 2.0 with full Theme Editor support.

**Tagline:** Escape The Ordinary

## Deploy to Shopify

### Option 1: GitHub Integration (recommended)

1. Push this repo to GitHub on the `main` branch
2. In Shopify Admin → **Online Store → Themes**
3. Click **Add theme → Connect from GitHub**
4. Select this repository and `main` branch
5. Publish when ready

### Option 2: Shopify CLI

```bash
npm install -g @shopify/cli @shopify/theme
shopify theme push --store your-store.myshopify.com
```

## Post-install setup

### 1. Navigation menu (`main-menu`)

Create a menu in **Online Store → Navigation** with these items:

| Menu Item | Suggested Sub-items |
|-----------|---------------------|
| Home | — |
| New Arrivals | — |
| Jerseys | Korean Jerseys, NBA Jerseys, Football Club Jerseys, Sports Jerseys |
| Oversized Tees | Boxy Fit Tees, Graphic Tees, Streetwear Tees |
| Shirts | Zara Style Shirts, Printed Shirts, Casual Shirts, Corduroy Zip-Ups |
| Bottoms | 6 Pocket Cargos, Utility Pants, Track Pants, Wide Leg Jeans, Baggy Denim |
| ₹999 Drop | Buy 3 For ₹999 Deals, Combo Offers, Limited-Time Drops |
| Contact | Link to `/pages/contact` |

Assign this menu in **Theme Editor → Header → Main menu**.

### 2. Collections

Create collections matching your catalog and assign them in homepage sections (New Arrivals, Best Sellers, Trending, ₹999 Drop banner link).

### 3. Homepage

Open **Theme Editor** and configure:

- Hero banner image/video
- Featured category images & links
- Collection picks for product sections
- Instagram gallery images
- Customer review blocks

### 4. Payments (India)

Checkout uses **Shopify native checkout**. Enable in **Settings → Payments**:

- **Razorpay** — Install from Shopify App Store
- **PayU** — Install from Shopify App Store  
- **UPI / Cards** — Via Razorpay or Shopify Payments India
- **Cash on Delivery** — Enable in payment settings or via app

### 5. Contact page

Create a page with handle `contact` and assign the **page.contact** template.

## Theme structure

```
escape-clothing-theme/
├── assets/           # CSS, JS
├── config/           # Theme settings
├── layout/           # theme.liquid, password.liquid
├── locales/          # Translations
├── sections/         # OS 2.0 sections
├── snippets/         # Reusable Liquid components
└── templates/        # JSON templates
```

## Features

- Premium dark UI (black, charcoal, white)
- Mobile-first responsive design
- Slide-out cart drawer with AJAX updates
- Product gallery with zoom
- Size & quantity selectors
- Wishlist (localStorage)
- Recently viewed products
- SEO: Open Graph, Schema.org structured data
- Fully editable via Theme Editor
- No hardcoded products

## License

Proprietary — Escape Clothing
