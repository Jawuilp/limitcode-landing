# Videos demo — dónde van

> Nota interna para la incrustación. El usuario graba/edita los videos y los
> deja listos; este archivo registra dónde debe ponerlos el agente.

## Carpeta de los videos

Los videos se colocan en **`public/videos/`** (Astro sirve estáticos desde
`public/`). Nombre sugerido:

- `public/videos/app-creation.mp4` — creando la app desde cero (loop autónomo)
- `public/videos/web-skills.mp4` — búsqueda web + skill en el mismo flujo
- `public/videos/playwright-mcp.mp4` — testing con MCP de Playwright

Si el usuario los deja en otra carpeta (ej. `videos/` en la raíz), moverlos a
`public/videos/` antes de incrustar.

## Ubicación de cada video en la landing

| Video | Archivo | Dónde va | Cómo |
|---|---|---|---|
| App desde cero | `app-creation.mp4` | `index.astro` → sección Workflow (`#how-it-works`) o el hero | `<video controls src="/videos/app-creation.mp4">` |
| Web + skill | `web-skills.mp4` | `index.astro` → Capabilities → tarjeta EXTEND (o junto a la mención de web search) | `<video controls src="/videos/web-skills.mp4">` |
| Playwright MCP | `playwright-mcp.mp4` | `docs.astro` → sección 05 (Providers/Integrations) o Capabilities EXTEND | `<video controls src="/videos/playwright-mcp.mp4">` |

## Orden de prioridad

1. App desde cero (define Pro: loop autónomo vs pair programming)
2. Playwright MCP (el más convincente para devs: testing real)
3. Web + skill

## Recordatorios

- **OSS**: el README del repo `Limitcode` usa `<video src="...">` apuntando a
  un asset de **GitHub Releases** (no a esta carpeta). El video del lite
  (pair programming, 30-45s) es el que va ahí, con un GIF corto opcional.
- **Landing**: después de incrustar, `pnpm build` + `wrangler pages deploy dist --project-name limitcode-pro` + verificar en producción.
- No dejar API keys visibles en los videos.
