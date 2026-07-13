# Nexus — AI-Powered SaaS Landing Page

A production-quality SaaS landing page built with pure HTML5, CSS3, and Vanilla JavaScript. No frameworks, no libraries, no dependencies.

---

## Folder Structure

```
saas_test/
├── index.html          # Main HTML document
├── style.css           # All styles (CSS Variables, BEM-inspired)
├── script.js           # All JavaScript (modular, strict mode)
├── assets/
│   └── favicon.svg     # SVG favicon
└── README.md           # This file
```

---

## Features Implemented

### Sections
- **Hero** — Full-viewport with animated background, orbs, grid pattern, dashboard mockup, floating cards, trust indicators, CTA buttons
- **Logos** — Auto-scrolling marquee strip of brand logos
- **Features** — 6-card responsive grid with hover effects
- **Benefits** — Split layout with animated progress bars and benefit list
- **Statistics** — Animated counter section (counts up on scroll)
- **Testimonials** — Responsive slider with touch/swipe support, auto-play, dot navigation
- **Pricing** — 3-tier cards with monthly/annual toggle
- **FAQ** — Accessible accordion with smooth animation
- **Contact** — Full form with validation, success state, consent checkbox
- **Footer** — Multi-column with social links and copyright

### UI/UX
- Dark / Light theme toggle with `localStorage` persistence
- Sticky header that becomes frosted glass on scroll
- Hamburger menu for mobile with slide-down animation
- Smooth scroll with header offset compensation
- Loading screen with progress bar animation
- Ripple effect on primary/outline buttons
- Floating dashboard mockup with CSS animation
- Scroll-reveal animations (fade + slide) via IntersectionObserver
- Active navigation link tracking via IntersectionObserver
- Logos marquee (CSS animation, pauses on hover)
- Testimonials auto-play pauses on hover
- Animated counter numbers using requestAnimationFrame

### Performance
- Zero external JS dependencies
- Google Fonts loaded with `display=swap` + preconnect hints
- IntersectionObserver for lazy triggering (scroll animations, counters)
- `will-change: transform` on animated slider track
- Passive event listeners for scroll and touch
- Minimal DOM manipulation
- CSS `prefers-reduced-motion` respected — all animations disabled for users who prefer it
- No render-blocking resources beyond fonts

### SEO
- `<title>`, `<meta name="description">`, `<meta name="keywords">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
- Twitter Card tags (`twitter:card`, `twitter:title`, etc.)
- `<link rel="canonical">`
- `<meta name="robots" content="index, follow">`
- JSON-LD Structured Data (Schema.org `SoftwareApplication` with `AggregateRating`)
- Semantic HTML5 landmark elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<nav>`)
- Proper heading hierarchy (h1 → h2 → h3)

### Accessibility (WCAG 2.1 AA)
- All interactive elements have `:focus-visible` styles
- `aria-label` on every icon-only button and link
- `aria-expanded` on hamburger menu and FAQ items
- `aria-live` and `role="alert"` on form error/success messages
- `aria-required`, `aria-invalid`, `aria-describedby` on form inputs
- `role="progressbar"` with `aria-valuenow/min/max` on progress bars
- `role="menubar"` / `role="menuitem"` on navigation
- `role="region"` / `aria-live="polite"` on testimonials slider
- `role="tablist"` / `role="tab"` / `aria-selected` on testimonial dots
- `role="contentinfo"` on footer
- `aria-hidden="true"` on all decorative SVGs
- Keyboard navigation: Escape closes mobile menu, Arrow keys navigate testimonial dots
- High-contrast color ratios in both dark and light themes
- `visually-hidden` utility class for screen-reader-only text
- `using-keyboard` class added to body on Tab key for enhanced focus outlines
- Skip-to-content friendly structure (main has `id="main-content"`)

### Security
- `'use strict'` mode throughout JavaScript
- All user input sanitized via `sanitizeInput()` — HTML special characters escaped
- No `innerHTML` used with user-supplied content — only `textContent` or safe DOM creation
- Email validated with regex before acceptance
- Name validated against character allowlist
- Message length bounded (20–2000 characters)
- Form XSS-safe: success messages built via `createElement` / `textContent`
- No `eval()`, no `document.write()`, no unsafe DOM APIs

### Responsive Breakpoints
- `≥1400px` — Large desktop (wider container)
- `1200px` — Desktop (features grid collapses to 2 columns)
- `1024px` — Laptop/Tablet (hero becomes single column, pricing stacks)
- `768px` — Mobile (hamburger menu, stacked layout)
- `480px` — Small mobile (full-width CTAs, single-column footer)
- Landscape mode handled via fluid `clamp()` typography

---

## Local Development

No build step required. Simply open `index.html` in any modern browser.

```bash
# Option 1 — Direct open
open index.html

# Option 2 — Local server (recommended for full functionality)
npx serve .
# or
python -m http.server 8000
```

---

## Netlify Deployment

1. Drag and drop the entire project folder into [app.netlify.com/drop](https://app.netlify.com/drop)
2. Your site is live instantly with a `*.netlify.app` URL

### OR via Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### OR via GitHub

1. Push this repository to GitHub
2. Log in to Netlify → "Add new site" → "Import from Git"
3. Select your repo, set publish directory to `/` (root)
4. Click "Deploy site"

---

## GitHub Pages Deployment

1. Push to a GitHub repository
2. Go to **Settings → Pages**
3. Set source branch to `main`, folder to `/ (root)`
4. Site will be live at `https://username.github.io/repo-name`

---

## Customization Guide

### Brand Colors
Edit CSS custom properties in `style.css` under `:root`:
```css
--clr-primary: #6366f1;      /* Main brand color */
--clr-secondary: #8b5cf6;    /* Secondary/gradient color */
--clr-accent: #06b6d4;       /* Accent highlights */
```

### Typography
Replace font imports in `index.html` `<head>` and update:
```css
--font-sans: 'YourFont', sans-serif;
--font-display: 'YourDisplayFont', sans-serif;
```

### Content
All copy is in `index.html`. Replace placeholder text, links, contact details, and pricing values directly.

### SEO Meta
Update all `<meta>` tags in `index.html` `<head>` with your actual URL, description, and OG image.

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Android | 90+ |

---

## Tech Stack

- **HTML5** — Semantic markup, ARIA, JSON-LD
- **CSS3** — Custom Properties, Grid, Flexbox, `clamp()`, `mask-image`, keyframe animations
- **JavaScript (ES5+)** — IIFE pattern, IntersectionObserver, ResizeObserver, requestAnimationFrame, localStorage, touch events

---

## License

MIT — Free to use for personal and commercial projects.
