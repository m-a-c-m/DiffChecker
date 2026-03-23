# 🔀 Comparador de Texto Diff Online Gratis

**Free Text Diff Checker.** Compare two texts line by line and instantly highlight differences using the LCS (Longest Common Subsequence) algorithm. Green for added lines, red for removed, grey for unchanged. Download the result as a standard `.diff` file. No sign-up, no ads, 100% client-side.

🌐 **Demo en vivo / Live demo:** [miguelacm.es/tools/diff-checker](https://miguelacm.es/tools/diff-checker)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## ✨ Features

- **Algoritmo LCS / LCS algorithm:** Pure Longest Common Subsequence diff — same results as Git diff, zero dependencies
- **Colores intuitivos / Color-coded output:** Green lines (+) for additions, red lines (−) for deletions, grey for unchanged
- **Números de línea / Line numbers:** Toggle dual line numbers (original / modified) per line
- **Estadísticas / Live stats:** Added, removed, and unchanged line counts shown at a glance
- **Descargar diff / Download .diff:** Export the result as a standard `.diff` file
- **Copiar al portapapeles / Copy to clipboard:** Copy the full diff output in one click
- **Límite 5.000 líneas / 5,000-line limit:** Handles large files without freezing the browser
- **Sin servidor / Zero server:** Everything runs in the browser — your text never leaves your device
- **Embebible / Embeddable:** Use it as an iframe on any website
- **Open source:** MIT license, use it freely

---

## 🚀 Quick start

```bash
git clone https://github.com/m-a-c-m/DiffChecker.git
cd DiffChecker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (optional)

```env
NEXT_PUBLIC_SITE_URL=https://diff.miguelacm.es
```

---

## 📦 Embed on your website

### Iframe (plug & play)

```html
<iframe
  src="https://miguelacm.es/embed/diff-checker"
  width="100%"
  height="700"
  style="border:none;border-radius:12px;"
  title="Diff Checker — miguelacm.es"
  loading="lazy"
></iframe>
```

### Link with attribution (recommended for backlink)

```html
<a href="https://miguelacm.es/tools/diff-checker" target="_blank" rel="noopener">
  Diff Checker gratis por MACM
</a>
```

> 💡 The link option generates a real backlink that benefits the project. Recommended if your platform supports custom HTML.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 15 | React framework + SSG |
| [TypeScript](https://www.typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling |
| [react-icons](https://react-icons.github.io/react-icons/) | 5 | Icons |

---

## 📄 License

MIT © [Miguel Ángel Colorado Marin (MACM)](https://miguelacm.es)

Built with ❤️ by **[MACM](https://miguelacm.es)** — Full Stack Developer & Cybersecurity Specialist from Guadalajara, Spain.

- 🌐 Portfolio: [miguelacm.es](https://miguelacm.es)
- 💼 LinkedIn: [linkedin.com/in/macm](https://www.linkedin.com/in/macm/)
- 🐙 GitHub: [github.com/m-a-c-m](https://github.com/m-a-c-m)
