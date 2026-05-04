# Monolith OS &mdash; Official Website

This repo holds the public-facing site for [Monolith OS](https://github.com/shirou-eh/Monolith).

It is a **single-page static site** (one HTML, one CSS, one JS, plus a few SVG assets) tuned for:

- Mobile-first layout (320 px and up; bigger viewports get the multi-column treatment)
- Lighthouse 95+ across Performance, Accessibility, Best Practices, SEO
- Zero build step &mdash; deploys directly to GitHub Pages

Live: **https://shirou-eh.github.io/Monolith-website/**

## File map

```
.
├── index.html          # The site
├── styles.css          # Aurora design system + responsive layout
├── app.js              # Mobile menu, tabs, terminal typewriter, scroll reveal, copy-to-clipboard
├── 404.html            # Custom 404 in the same brand
├── favicon.svg         # SVG favicon (also used as Apple touch icon)
├── og.svg              # Open Graph preview image
├── robots.txt
├── sitemap.xml
└── .nojekyll           # Tells GitHub Pages to serve files as-is
```

## Local preview

Any static file server works. Pick one:

```bash
# Python
python3 -m http.server 8000

# Node
npx --yes serve .

# busybox
busybox httpd -f -p 8000
```

Then open `http://localhost:8000`.

## Deploy

GitHub Pages is enabled on this repo's `main` branch &mdash; every push to `main` redeploys the site automatically. No CI, no build step.

To enable Pages from scratch:

1. Push to `main`.
2. Go to **Settings &rarr; Pages**.
3. Under "Build and deployment", set **Source** to **Deploy from a branch**, **Branch** to `main`, **Folder** to `/ (root)`.
4. The site goes live at `https://shirou-eh.github.io/Monolith-website/` within a minute.

## Brand

| Token         | Value                                    | Usage                              |
|---------------|------------------------------------------|------------------------------------|
| `--bg-1`      | `#070b14`                                | Page background (ink black)        |
| `--text`      | `#e7edf7`                                | Primary text                       |
| `--text-dim`  | `#9aa6bd`                                | Secondary copy                     |
| `--emerald`   | `#35e0a1`                                | Brand primary (status OK, accents) |
| `--cyan`      | `#5cc9ff`                                | Brand secondary (links, highlights)|
| `--magenta`   | `#b07cff`                                | Tertiary accent                    |
| Typography    | Inter (UI), JetBrains Mono (code, stats) | &mdash;                            |

This is the same emerald + cyan aurora palette used in `mnweb`, `mntui`, and the `monolith-installer` so all four surfaces share a consistent identity.

## Support

For Monolith OS itself, open an issue on https://github.com/shirou-eh/Monolith. For website issues, open one here.

Or hit me up on Discord: **shiro_eh**.

## License

[MIT](LICENSE).
