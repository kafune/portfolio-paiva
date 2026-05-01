# portfolio-paiva

Portfólio estático de fotografia com estética terminal/cyberpunk.

## Estrutura

```
.
├── index.html          # Entrada principal (markup)
├── css/
│   └── style.css       # Estilos (variantes A e B, lightbox, panel)
├── js/
│   ├── app.js          # Boot, cursor, lightbox, form, reveal
│   └── tweaks.js       # Painel de customização (variant/accent/scanlines)
├── photos/             # Imagens da galeria (jpg + webp)
├── icons/              # Favicons e PWA icons
├── manifest.webmanifest
├── sw.js               # Service Worker (cache offline básico)
└── robots.txt / sitemap.xml
```

## Convenções

- **Sem build step**: HTML/CSS/JS puro, abrir `index.html` direto funciona
- **Variantes A/B**: trocadas via `body.var-a` / `body.var-b` (painel tweaks)
- **Acento**: variável CSS `--accent` (default `#39FF14`)
- **Imagens**: usar `<picture>` com `.webp` + fallback `.jpg`
- **Acessibilidade**: respeitar `prefers-reduced-motion`, ARIA labels obrigatórias em controles

## Adicionar nova foto

1. Salvar `photos/<nome>.jpg` e `photos/<nome>.webp`
2. Adicionar item em `index.html` dentro de `.gallery-grid` (use existentes como template)
3. Adicionar entrada em `photoList` no `js/app.js`
4. Marcar `data-category` (`street | nature | architecture | night`) para o filtro

## Deploy

Qualquer host estático: GitHub Pages, Netlify, Vercel, Cloudflare Pages.
