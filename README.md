# Roast & Co. — Coffee Shop Website Template

A single-page website template built with vanilla HTML, CSS, and JavaScript, intended as a reusable starting point for outreach to local coffee shops and cafés.

**Live demo:** https://savskye.github.io/coffee-site/

---

## Project Structure

```
coffee-site/
├── index.html              # All page content and structure
├── style.css                # All styling (default: dark espresso/copper theme)
├── theme-sage.css            # Optional theme override (dark espresso/green accent)
├── script.js                  # Mobile nav, scroll reveals, hero video swap, contact form
├── Assets/
│   ├── hero-compressed.mp4   # Hero background video (desktop/tablet only)
│   ├── hero-bg.jpg           # Hero fallback image (mobile, and video load fallback)
│   └── gallery/               # Gallery section photography
└── favicon/                   # Browser tab icon files
```

This is a **single-page site**: all sections (About, Menu, Gallery, Contact) live in `index.html` and are navigated to via anchor links (`#about`, `#menu`, etc.), not separate pages.

---

## Customizing for a New Client

To adapt this template for a specific business, the following should be updated:

| What to change | Where |
|---|---|
| Business name | `<title>`, `.logo`, footer copyright, all `og:` meta tags |
| Tagline / hero copy | `.hero-content` section in `index.html` |
| About section story | `.about-text` section |
| Current roast / featured item | `.roast-card` section |
| Menu items and prices | `.menu-list` items (three columns: Espresso, Filter, From the Case) |
| Address, phone, hours | `.contact` section, `<address>` block |
| Gallery photos | Replace files in `Assets/gallery/`, update `<img src>` paths and `alt` text accordingly |
| Hero video/image | Replace `Assets/hero-compressed.mp4` and `Assets/hero-bg.jpg` (see **Media Guidelines** below) |
| Contact form destination | Update the Formspree endpoint in the `<form action="...">` attribute — each client should have their own Formspree form/account, or your own if managing on their behalf |
| Color theme | See **Theming** below |

---

## Theming

All colors are defined as CSS custom properties at the top of `style.css`:

```css
:root {
  --bg: #1c1410;
  --bg-alt: #251b15;
  --cream: #f2e8d8;
  --cream-dim: #c9bda9;
  --copper: #d99567;
  --line: rgba(242, 232, 216, 0.12);
}
```

Every rule throughout the stylesheet references these via `var(--copper)`, `var(--cream)`, etc., rather than hardcoded hex values, this is what makes a full re-theme a matter of changing a handful of values in one place, rather than hunting through the entire file.

### Switching themes

A second variant, `theme-sage.css`, ships alongside the default. It keeps the same dark background and text colors (important — the hero video/image is coffee-toned and dark, so any theme variant needs to stay dark to look intentional against it) and swaps only the accent color to a sage green.

To activate it, load it **after** `style.css` in `<head>`:

```html
<link rel="stylesheet" href="style.css" />
<link rel="stylesheet" href="theme-sage.css" />
```

Because both files declare `:root`, the one loaded second wins for any property it redefines — this is the CSS cascade at work. To go back to the default theme, remove or comment out the `theme-sage.css` line.

**Browser caching note:** if you edit an existing theme file's contents and the changes don't appear to take effect even after a normal refresh, this is very likely a caching issue, not a code issue, browsers cache CSS files aggressively by filename. Try a hard reload (`Ctrl+Shift+R` / `Cmd+Shift+R`) before assuming something is broken. For a more permanent fix while actively iterating on a theme file, append a version query string to the link tag (`theme-sage.css?v=2`) and increment it each time you make a change.

**If introducing a new palette, re-check contrast ratios** using [WebAIM's Contrast Checker](https://webaim.org/resources/contrastchecker/) before finalizing — text colors must maintain at least a 4.5:1 ratio against their background to remain accessible. Accent colors are the most likely to fail this and need darkening/lightening even when they look fine at a glance, this happened with both the original copper and the sage green during development.

---

## Media Guidelines

- **Hero video:** MP4, H.264 codec, muted, under ~5MB. Compress with HandBrake or `ffmpeg` (`-crf 28 -an`) before adding.
- **Hero fallback image:** JPEG, ~1920×1080, under ~300KB. Use [Squoosh](https://squoosh.app) to compress.
- **Gallery images:** JPEG, ~800×600 (or ~800×1000 for `.tall` tiles), under ~200KB each. Source from Unsplash (use their "Medium" download size, not full resolution).
- All gallery images use `loading="lazy"` — do **not** remove this, as it's required to keep Largest Contentful Paint fast (see Lighthouse notes below).
- The hero fallback image uses `fetchpriority="high"` — this should stay on whichever image is the page's primary visual on load.

---

## Known Behaviors (Not Bugs)

- **Hero video only loads above 768px viewport width.** Below that, the static `hero-bg.jpg` is shown instead, to save mobile bandwidth. This is controlled in `script.js`.
- **Contact form requires a Formspree endpoint to function.** Free tier allows 50 submissions/month — sufficient for demo purposes, but should be discussed with the client if reused for their live inquiries (consider Web3Forms as a higher-free-volume alternative if needed).
- **Mobile menu requires a correct viewport meta tag to function.** If the hamburger menu ever stops responding on a new deployment, check `<meta name="viewport">` in `<head>` first, a broken or missing viewport tag can prevent the site's mobile breakpoint from ever activating.
- **`og:image` and `og:url` must be complete, absolute URLs** (`https://...`), never relative paths — unlike every other asset reference in this project. External services (iMessage, Slack, etc.) fetch this image independently and have no notion of "relative to this page." A 404 on the image URL is often a single mistyped character in the domain rather than a missing file, check the URL as literal text before assuming the file is missing.
- **Link preview caches are sticky.** If you fix a broken `og:image` and a messaging app still shows the old/broken preview, the service has likely cached the earlier failed attempt. Append a harmless query string (`?v=2`) to the shared URL to force a fresh fetch.

---

## Performance & Accessibility

Last audited via [PageSpeed Insights](https://pagespeed.web.dev):

- Largest Contentful Paint: 1.5s
- Accessibility score: 100
- Total Blocking Time: 0ms
- Cumulative Layout Shift: 0
- Speed Index: 3.8s

If these regress after future edits (e.g., adding a new large image), re-run PageSpeed Insights and check for:
1. Oversized media files (compress via Squoosh/HandBrake) — this alone took the original LCP from 26.1s down to 1.5s over several rounds
2. Missing `loading="lazy"` on any new offscreen images — a page's largest visible element competing for bandwidth with offscreen images (e.g. a gallery) is a common, easy-to-miss cause of a slow LCP even when the hero asset itself is well optimized
3. Text using `opacity` for dimming rather than an explicit `color` value (opacity reduces contrast ratio and can fail accessibility checks even when the color looks fine visually)
4. Consider WebP versions of JPEG images (via Squoosh) for further savings — flagged as an "Improve image delivery" opportunity, not yet implemented in the current build (Speed Index: 3.8s would change)
5. "Use efficient cache lifetimes" will likely always show as an opportunity on GitHub Pages specifically — this is controlled by server response headers GitHub Pages doesn't expose for customization, not something fixable from this codebase. Only relevant if migrating to a host that allows custom headers (Netlify, Vercel).

---

## Debugging Patterns Worth Remembering

A few categories of bug came up repeatedly while building this project. If something breaks in a future session, check these first:

- **No console error, but a style or class isn't applying** — usually a plain syntax mistake in CSS (missing semicolon, stray character) rather than a logic error. The browser silently drops a malformed declaration rather than throwing a visible error.
- **A feature works in DevTools' element inspector but not for a real user** — check whether DevTools' device toolbar / responsive mode was actually active during testing. A media query that isn't matching (e.g. because a viewport meta tag is broken) produces exactly this symptom.
- **Something that should have updated still shows the old version** — try a hard reload before debugging the code. This applies to CSS/JS files, images referenced by filename, and social link previews (Slack/iMessage/Facebook) alike; all of these are cached aggressively by filename/URL.
- **A file provably exists (loads fine when opened directly) but doesn't show up where it's referenced** — check the referencing URL as literal text, character by character, rather than assuming the problem is the file's location. A single wrong character (a comma instead of a period, a backslash instead of a forward slash) produces this exact symptom and won't necessarily throw a helpful error.
- **File paths are case-sensitive on GitHub Pages** even though Windows file systems are not, a folder named `Favicon` locally will not be found by a reference to `favicon` once deployed.

---

## Deployment

Currently deployed via **GitHub Pages**, serving directly from the `main` branch. To deploy elsewhere, this is a fully static site. Any static host (Netlify, Vercel, traditional hosting) will work with no build step required.