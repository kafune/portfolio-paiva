# portfolio-paiva

Portfolio de fotografia com estética terminal/cyberpunk.

## Stack

HTML/CSS/JS puro. Sem build step. Abra `index.html` direto.

## Estrutura

- `index.html` — markup
- `css/style.css` — estilos (variantes A/B, theme dark/light)
- `js/app.js` — boot, lightbox, filtros, formulário, service worker
- `js/tweaks.js` — painel de customização (cor, scanlines, theme)
- `photos/` — imagens (use `.webp` + `.jpg` fallback)
- `manifest.webmanifest` + `sw.js` — PWA

## Features

- Two layout variants (A: terminal · B: editorial)
- Light/dark theme toggle
- Filtros por categoria (street, natureza, arquitetura, noite)
- Lightbox com navegação por teclado (← → Esc)
- Custom cursor (desativa em touch devices)
- Boot screen animado
- Suporte a `prefers-reduced-motion`
- PWA: instalável + cache offline
- Formulário de contato (Formspree opcional ou fallback `mailto:`)

## Configuração

- **Formspree**: edite `FORMSPREE_ENDPOINT` em `js/app.js`
- **Email fallback**: edite `CONTACT_EMAIL` em `js/app.js`
- **Ícones PWA**: gere `icons/icon-192.png` e `icons/icon-512.png`
- **WebP**: gere versões `.webp` das fotos para melhor performance
  ```sh
  for f in photos/*.jpg; do cwebp -q 82 "$f" -o "${f%.jpg}.webp"; done
  ```

Mais detalhes em [CLAUDE.md](./CLAUDE.md).
