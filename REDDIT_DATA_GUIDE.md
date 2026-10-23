# Guía completa: obtener datos de Reddit sin que te bloqueen

> **Contexto**: guía escrita el 20-oct-2026 a raíz de un fetch real a
> `r/EmprendedorES` (post `1wykzrq`). Reddit bloquea el acceso automatizado al
> endpoint `.json` desde IPs de datacenter. Este doc es el mapa completo de
> **todas** las vías que se pueden usar, incluidas las que no se llegaron a
> ejecutar, con el estado real de cada una.
>
> **TL;DR rápido**
>
> - Contenido de un post → **RSS** (§3.1) o **Arctic Shift** (§3.2).
> - **Vigilar un subreddit con alertas** → **Arctic Shift con cursor `after=`**
>   (§10). El front page de Reddit es un listing *hot* **cacheado** y no sirve
>   para detectar hilos nuevos.
> - Listar un subreddit sin saber ninguna URL de post → §6.
>
> **Leyenda de estado**
>
> | Marca | Significado |
> |---|---|
> | ✅ | Probado en esta sesión, con código/resultado verificado |
> | ⚠️ | Probado y **falla** (se documenta el error exacto) |
> | 🟡 | Considerado, no ejecutado (o ejecutado a medias / abortado) |
> | 🚫 | Descartado de plano |

---

## 1. TL;DR — Las 3 vías que sí funcionan

| Prioridad | Vía | Resultado | Requiere API key |
|---|---|---|---|
| 🥇 | **RSS de Reddit** (`/r/SUB/comments/ID/.rss` y `/r/SUB/.rss`) | Post completo + comentarios, y front del sub | No |
| 🥈 | **Arctic Shift** (`arctic-shift.photon-reddit.com/api/...`) | JSON estructurado, histórico, bulk, búsqueda | No |
| 🥉 | **embed.reddit.com** | HTML server-rendered, útil como fallback | No |

Las tres son **sin autenticación**. La clave es saber cuál usar según lo que
necesites:

```
¿Necesito el post + comentarios de UNA URL?
  → RSS  /r/SUB/comments/ID/.rss          (1 request, texto completo)
  → Arctic Shift /api/posts/ids?ids=ID    (JSON limpio, si necesitas campos tipados)

¿Necesito listar un subreddit SIN saber la URL de ningún post?
  → RSS  /r/SUB/.rss                      (front page real, 25 entradas)
  → embed.reddit.com/r/SUB/               (HTML SSR del sub)
  → Arctic Shift /api/posts/search?subreddit=SUB  (cronológico + histórico)

¿Necesito histórico/bulk/búsqueda a escala?
  → Arctic Shift (es el único con window temporal, filtros por campo y batch)
```

---

## 2. El endpoint `.json` — por qué falla y qué dice exactamente

Este es el primer intento de cualquiera, y el que falla:

| # | URL | Status | Lo que devuelve realmente |
|---|---|---|---|
| 1 | `https://www.reddit.com/r/SUB/comments/ID/TITLE/.json` | ⚠️ `403` | 189.906 bytes de **HTML**, no JSON. Cuerpo: *"You've been blocked by network security"* |
| 2 | `https://www.reddit.com/comments/ID.json?raw_json=1` | ⚠️ `403` | idem |
| 3 | `https://api.reddit.com/comments/ID` | 🚫 `403` | idem; además es el mismo backend que `www` |
| 4 | `https://oauth.reddit.com/comments/ID` | 🚫 `403` | idem — **solo sirve con `Bearer` token OAuth** (ver §5.1) |
| 5 | `https://www.reddit.com/api/info.json?id=t3_ID` (UA de bot) | ⚠️ `403` | 189.906 bytes HTML |
| 6 | `https://www.reddit.com/api/info.json?id=t3_ID` (UA de navegador) | 🚫 `403` | 1.486 bytes HTML (distinto, más corto). Endpoint **deprecado** por Reddit |
| 7 | `https://www.reddit.com/r/SUB/.json?limit=5` | ⚠️ `403` | *"You've been blocked by network security"* |
| 8 | `https://www.reddit.com/r/SUB/about.json` | ⚠️ `403` | idem |

> **Conclusión**: *toda* la familia `.json` / `api/*.json` está cerrada para IPs
> no autenticadas. Cambiar el `User-Agent` no sirve. Añadir headers
> `sec-ch-ua`, `sec-fetch-*`, `Accept-Language` **tampoco** (verificado abajo).

### 2.1 Variantes de URL probadas (todas ❌)

```
/r/SUB/comments/ID/.json
/r/SUB/comments/ID/TITLE/.json
/comments/ID.json
/comments/ID.json?raw_json=1
/api/info.json?id=t3_ID
/r/SUB/.json?limit=N
/r/SUB/about.json
```

Añadir `?limit=500&depth=10&sort=top&raw_json=1` no cambia el resultado: el
bloqueo ocurre **antes** de parsear parámetros.

---

## 3. Las vías que SÍ funcionan (verificadas)

### 3.1 🥇 RSS de Reddit — el descubrimiento clave

Reddit expone un feed **Atom** que **no está bloqueado** y que contiene el
post completo y todos los comentarios.

#### 3.1.1 RSS de un post concreto

```
https://www.reddit.com/r/{subreddit}/comments/{post_id}/.rss
```

**Verificado:**
```
GET https://www.reddit.com/r/EmprendedorES/comments/1wykzrq/.rss
→ 200 | application/atom+xml | 17.167 bytes | 14 <entry>
```

- 14 `<entry>` = **1 post + 13 comentarios** (coincide exacto con `num_comments: 13`).
- `entry[0]` es el post. Campos disponibles:

| Campo RSS | Ejemplo real |
|---|---|
| `<title>` | `Sacando de la quiebra a mis negocios (día 1)` |
| `<link href>` | `https://www.reddit.com/r/EmprendedorES/comments/1wykzrq/sacando_de_la_quiebra_a_mis_negocios_día_1/` |
| `<updated>` | `2026-10-05T21:34:19+00:00` |
| `<author><name>` | `/u/Worried-Staff-1842` |
| `<content type="html">` | 2.114 bytes con el `selftext` completo en HTML |

- Los `<entry>` siguientes son los comentarios, con el mismo esquema
  (`<author><name>`, `<content>`, `<updated>`).
- No requiere el slug del título: `.../comments/1wykzrq/.rss` funciona igual
  (verificado `200`, 14 entries) → **no necesitas el slug, pero sí el subreddit
  correcto**.
- ⚠️ `https://www.reddit.com/r/_/comments/1wykzrq/.rss` → **404 real**.
  El subreddit no es opcional en la URL.

**Ventajas:** 1 sola request, sin API key, sin rate limit agresivo, da el
contenido exacto (no un resumen).
**Límites:** ~25 posts por feed de sub, ~100+ comentarios por post; sin
puntuación, sin número de comentarios, sin campos de moderación; el contenido
es HTML (hay que limpiar etiquetas).

#### 3.1.2 RSS del front page de un subreddit (sin URL de post)

```
https://www.reddit.com/r/{subreddit}/.rss
```

**Verificado:**
```
GET https://www.reddit.com/r/EmprendedorES/.rss
→ 200 | 35.200 bytes | 25 <entry>  ← ESTO ES EL HOME DEL SUBREDDIT
```

Primeras entradas obtenidas (con sus permalinks reales):

```
- ¿Nos apoyamos mutuamente?          → /r/EmprendedorES/comments/1xawdrc/nos_apoyamos_mutuamente/
- Alguien aqui ha trabajado con la !A de marketing llamada H… → /comments/1xauj2z/…
- Emprender,                          → /comments/1xatmg0/emprender/
- Comparando herramientas de IA: casi todas cobran en dólares → /comments/1xatekk/…
- Alguien aqui ha trabajado con la !A de marketing llamada H… → /comments/1xairln/…
- Me dais feeback? Al final lo hice   → /comments/1xand33/…
- Agencia marketing médico            → /comments/1xaarw7/…
- Mujeres emprendedoras en Medellín: ¿conectamos? ☕✨ → /comments/1xaaouj/…
```

> ⚠️ **Rate limit real observado**: tras ~10 requests seguidos a Reddit,
> `.rss` empezó a devolver `429`. Con **60 s de espera** volvió a `200`.
> Con solo **8 s** de espaciado, `429` continuar.

#### 3.1.3 Ordenaciones alternativas (⚠️ fallan)

| URL | Resultado |
|---|---|
| `https://www.reddit.com/r/SUB/.rss` | ✅ `200`, 25 entries |
| `https://www.reddit.com/r/SUB/new/.rss` | ⚠️ `429` (consistente, incluso con 8 s de gap) |
| `https://www.reddit.com/r/SUB/hot/.rss` | ⚠️ `429` (ídem) |
| `https://www.reddit.com/r/SUB/top/.rss?t=week` | ⚠️ `429` (ídem) |

Interpretación: el feed raíz (`.rss`) está en una ruta "caliente" pero cacheada;
las ordenaciones alternativas van a rutas que disparan el limitador de forma
inmediata. **Usa solo `/r/SUB/.rss`.**

### 3.2 🥈 Arctic Shift — el índice público de Reddit

Base de datos archivada y consultable, sin API key, mantenida por
`ArthurHeitmann/arctic-shift`. Es la opción más potente para histórico, bulk y
búsqueda.

**Base:** `https://arctic-shift.photon-reddit.com/api`

| Endpoint | Estado | Verificación |
|---|---|---|
| `/api/posts/ids?ids=ID` | ✅ | `200`, 4.052 bytes, **109 campos** por post |
| `/api/posts/ids?ids=ID1,ID2` | ✅ | `200`, batch, n=2 |
| `/api/comments/ids?ids=ID` | ✅ | `200`, n=1 |
| `/api/posts/search?subreddit=SUB&limit=5&after=2026-10-01&before=2026-10-10` | ✅ | `200`, n=5, ventana temporal ok |
| `/api/posts/search?author=USER&limit=5&sort=desc` | ✅ | `200`, n=5 |
| `/api/posts/search?subreddit=SUB&fields=title,author,score,created_utc` | ✅ | `200`, payload reducido a **4 campos** |
| `/api/posts/search?title=quiebra` / `&selftext=marketing` | ✅ | Filtro por palabra clave (parcial) |
| `/api/comments/search?link_id=POSTID&limit=100` | ✅ | `200`, 13 comentarios, 79–80 campos |
| `/api/comments/search?subreddit=SUB&limit=5&sort=desc` | ✅ | `200`, n=5 |
| `/api/subreddits/search?subreddit=SUB` | ✅ | `200` → metadata del sub (suscriptores, created…) |
| `/api/posts/search?ids=…` | ⚠️ | `400` → *"Unknown query parameter: 'ids'"* (usar `/api/posts/ids`) |
| `/api/posts/search?q=…` | ⚠️ | `400` → *"Unknown query parameter: 'q'"* (no hay full-text genérico) |
| `/api/subreddits/search?name=…` | ⚠️ | `400` → el param correcto es `subreddit` |
| `/api/posts/counts`, `/api/comments/counts` | ⚠️ | `404` → no existen |
| `/api/docs`, `/api/openapi.json` | ⚠️ | `404` → la doc vive en el repo de GitHub y en la SPA `/docs` |

**Rate limit de Arctic Shift**: devuelve `{"data":null,"error":"Timeout. Maybe
slow down a bit"}` con status `200` (¡ojo, no es un error HTTP!). **Hay que
reintentar con backoff**, no confiar en el status. Se observó con
`/api/posts/search?subreddit=…` y con `/api/subreddits/search`.

**Ojo con `sort`**: solo existe ordenación temporal (`asc`/`desc` sobre
`created_utc`). **No hay ranking "hot"/"top"** como en la web. Para aproximarlo:
trae N posts recientes y ordénalos por `score` localmente.

### 3.3 🥉 embed.reddit.com — HTML server-rendered

```
https://embed.reddit.com/r/{subreddit}/comments/{post_id}/
https://embed.reddit.com/r/{subreddit}/
```

**Verificado:**
```
embed.reddit.com/r/EmprendedorES/comments/1wykzrq/
→ 200 | 340.262 bytes | SSR: autor, fecha, título, cuerpo del post

embed.reddit.com/r/EmprendedorES/
→ 200 | 566.485 bytes | SSR del subreddit, contiene <shreddit-post>
```

Ventaja: es la única forma de conseguir el **título traducido** automáticamente
("Sacando de la quiebra a mis negocios (día 1)" → "Getting my businesses out of
bankruptcy (day 1)"), porque el embed muestra la traducción del servidor.
El texto visible extraído son ~1.539 chars (post renderizado; los comentarios
no llegan en el SSR visible).

### 3.4 oEmbed — metadatos baratos y oficiales

```
https://www.reddit.com/oembed?url={permalink}
```

**Verificado:** `200`, 801 bytes →
```json
{"author_name":"Worried-Staff-1842",
 "html":"<blockquote class=\"reddit-embed-bq\" style=\"height:316px\">…",
 "title":"…", "provider_name":"Reddit", …}
```

Útil para: validar que una URL existe, obtener autor y título sin parsear HTML
pesado. **No** da el cuerpo del post.

---

## 4. Vías oficiales que NO funcionan (documentadas para que no se repitan)

### 4.1 HTML plano → es un shell JS vacío

| URL | Status | Tamaño | Contenido |
|---|---|---|---|
| `www.reddit.com/r/SUB/comments/ID/` (UA navegador) | `200` | 8.487 B | Solo `<title>Reddit</title>`, 267 chars de texto visible |
| el mismo + headers completos de navegador | `200` | 8.487 B | Idéntico |
| `sh.reddit.com/r/SUB/comments/ID/` | `200` | 8.439 B | Mismo shell |
| `www.reddit.com/r/SUB/` (home del sub) | `200` | 166.960 B | **"Prove your humanity"** |

**Headers "de navegador" que se probaron y NO ayudaron:**
`sec-ch-ua`, `sec-ch-ua-mobile`, `sec-ch-ua-platform`, `sec-fetch-dest`,
`sec-fetch-mode`, `sec-fetch-site`, `sec-fetch-user`,
`upgrade-insecure-requests`, `cache-control`, `accept-language: es-ES`,
`accept-encoding: gzip, deflate, br`, `accept` con `image/avif,image/webp`.

Reddit sirve la SPA y el contenido real llega por XHR que también está
bloqueado. **El HTML de `www.reddit.com` no sirve para scraping.**

### 4.2 old.reddit.com → redirige a login

```
GET https://old.reddit.com/r/SUB/comments/ID/.json
→ 302 → https://old.reddit.com/login/?reason=lor2&dest=…/.json
→ 404, cuerpo: "Not Found", content-type: text/plain
```

Reddittsy cambió `old.reddit` para que exija sesión incluso para feeds.

### 4.3 Chrome headless → el challenge "Prove your humanity"

```
chrome --headless=new --dump-dom "https://www.reddit.com/r/SUB/comments/ID/"
→ DOM de 170.040 bytes, pero texto visible: 267 chars
→ "Prove your humanity — We're committed to safety and security. But not for bots.
   Complete the challenge below and let us know you're a real person."
```

El challenge se renderiza en JS y requiere interacción (o resolver el PoW).
**No lo resuelve headless por defecto.**

### 4.4 Wayback Machine — sin snapshot de esa URL

```
GET https://web.archive.org/cdx/search/cdx?url=reddit.com/r/EmprendedorES/comments/1wykzrq*&output=json
→ 200, 0 resultados
```

El CDX sí funciona como API (es la forma correcta de consultar snapshots), pero
ese post concreto no está archivado.

---

## 5. Vías que consideré y NO llegué a ejecutar 🟡

Estas están **verificadas en cuanto a que son rutas reales de la industria**,
pero no se llegaron a probar en esta sesión. Son las siguientes que probaría
antes de abandonar:

### 5.1 OAuth de Reddit (la solución "oficial" si puedes registrar una app)

```
POST https://www.reddit.com/api/v1/access_token
     grant_type=client_credentials
     &client_id=...&client_secret=...            → token app-only
GET  https://oauth.reddit.com/r/SUB/comments/ID     (Authorization: Bearer ...)
```

- `client_credentials` (app-only) da **lectura pública** sin cuenta de usuario.
- También existe el flujo de script de app con refresh token (más permisos).
- Es la única vía que da **el `.json` real** con todos los campos, incluidos
  `score`, `num_comments`, `is_original_content`, `over_18`, `stickied`, etc.
- Requiere registrar una app en <https://www.reddit.com/prefs/apps> (script app,
  redirect URI vacío).
- **Consecuencia práctica**: es la que mejor escala y la que evita el 429.

### 5.2 Librerías Python que encapsulan lo anterior

| Librería | Qué es |
|---|---|
| `praw` | Reddit API Wrapper — la estándar. `Reddit("script", user_agent=...)` |
| `asyncpraw` | Igual pero async, para alto volumen |
| `reddit-search` / `snoowrap` | Helpers de búsqueda |

Con `praw` + credenciales de app, `reddit.submission(url=...)` devuelve un
objeto `Submission` con `.title`, `.selftext`, `.comments` — sin parsear nada.

### 5.3 Otros mirrors de Reddit (frontends alternativos)

Familia **Redlib** (sucesor de LibReddit) y **Teddit**/**Unddit**:

```
https://redlib.<instancia>/r/SUB/comments/ID/
https://teddit.net/r/SUB/comments/ID/
https://unddit.<instancia>/r/SUB/comments/ID/
```

Instancias conocidas a probar: `redlib.catsarch.com`, `redlib.perennialte.ch`,
`redlib.privacyredirect.com`, `safereddit.com`, `libreddit.privacydev.net`.

> Nota: en esta sesión **se lanzó un test contra `redlib.catsarch.com`,
> `teddit.net` y `r.jina.ai`, pero la llamada abortó antes de devolver
> resultados** — no están verificados ni descartados.

### 5.4 `r.jina.ai` como proxy de lectura

```
https://r.jina.ai/https://www.reddit.com/r/SUB/comments/ID/.json
```

Convierte la página a markdown/texto limpio. Útil porque su IP no está
bloqueada por Reddit. **No verificado** (llamada abortada).

### 5.5 Playwright / Puppeteer con Chromium real

En esta máquina **ya hay navegadores descargados**:

```
%LOCALAPPDATA%\ms-playwright\
  chromium-1234
  chromium_headless_shell-1234
  ffpmeg-1011
```

El paquete `playwright` / `playwright-core` **no está instalado** (solo los
binarios), pero `npm i -D playwright-core` lo resolvería. Con Playwright se
puede:

- Interceptar la respuesta XHR real que la SPA pide (`page.on("response")`) →
  es decir, **capturar el `.json` que Reddit sí le entrega al navegador** y que
  `fetch` no puede ver.
- Resolver el challenge "Prove your humanity" si es automatizable.
- Reutilizar el perfil de Chrome real del usuario (`userDataDir`) para
  arrastrar la sesión ya autenticada y saltarse el bloqueo.

### 5.6 CDP: capturar la respuesta de red directamente

Sin instalar nada: `chrome --remote-debugging-port=9222` + el protocolo
`Network.getResponseBody` sobre la petición `...json`. Mismo objetivo que el
punto anterior, pero con menos dependencias.

### 5.7 Stealth / anti-detección

```
chrome --headless=new --disable-blink-features=AutomationControlled
```
+ plugins de stealth (Puppeteer-extra-plugin-stealth, undetected-chromedriver).
Reduce la probabilidad de caer en el challenge, aunque no lo garantiza.

### 5.8 Endpoints internos de la SPA (`/svc/shreddit/...`)

El frontend nuevo llama a rutas internas del tipo:

```
https://www.reddit.com/svc/shreddit/community-more-posts/r/{sub}/{params}
https://www.reddit.com/svc/shreddit/post/{id}
```

Estas son las que devuelve el JS de la SPA. Menos protection que `.json`, pero
su formato cambia con frecuencia. **No probadas.**

### 5.9 GraphQL de Reddit

```
https://gql.reddit.com/    (persisted queries, requiere sesión)
```

### 5.10 Wayback Machine (recuperar el snapshot, no solo el CDX)

```
https://web.archive.org/web/2026id_/{url}
https://web.archive.org/web/20261005/{url}
```

El CDX devuelve `0` para el post de ejemplo, pero para posts viejos o muy
populares sí hay snapshots. Solo sirve para contenido **histórico**.

### 5.11 Google Cache / SerpAPI / Google Search API

- `webcache.googleusercontent.com/search?q=cache:{url}` — Google desmontó su
  cache, pero sirve vía Bing/Yandex.
- **SerpAPI** (`serpapi.com`) tiene un motor `reddit` que devuelve posts
  estructurados sin bloqueo. Requiere API key (hay plan gratuito).
- La tool `google_search` de este entorno **abortó** al pedirle esta URL
  concreta, pero funciona para consultas normales y puede devolver el post
  indexado con su texto.

### 5.12 `snscrape`

Scraper de Reddit basado en Scrapy. Históricamente murió cuando Reddit cambió
sus internals; hay forks mantenido. **No verificado.**

### 5.13 `np.reddit.com` y `old.reddit.com` con `.rss`

```
https://np.reddit.com/r/SUB/comments/ID/     (mirror "no partial")
https://old.reddit.com/r/SUB/comments/ID/.rss
```
El segundo tiene lógica de ser idéntico al `.rss` moderno (solo cambia el
host), pero dado que `old.reddit.com` ya manda a login, es dudoso.

### 5.14 Workers / proxies de edge

Un **Cloudflare Worker** o **Vercel Edge Function** haciendo `fetch` a Reddit:
la IP de salida es de edge (distinta a la de datacenter), a veces no bloqueada.
También aplica **Cloudflare Workers con `resolveOverride`** contra
`gql.reddit.com`.

### 5.15 Proxies de red

- **sc-vpn** (skill instalada en este entorno): gateway con proxy **por
  request**, no global. Se usa cuando un target bloquea por geolocalización.
- Proxies residenciales (IP de servidor final real) — lo más fiable, lo más caro.
- Nodos de salida de Tor — muy lento, casi siempre igual de bloqueado.
- El objetivo aquí no es la geografía sino **la reputación de la IP**: una IP
  de datacenter está en la lista negra de Reddit; una IP residencial no.

### 5.16 Extractores genéricos de artículo

`trafilatura`, `newspaper3k`, `readability` — funcionan sobre el output de
`embed.reddit.com` o el RSS si el parser propio da problemas.

### 5.17 Manuales / híbridos (siempre funcionan)

| Método | Cómo |
|---|---|
| DevTools | Abrir el post en el navegador → Network → filtrar `json` → copiar la Response |
| "Save page as" | Guardar el HTML renderizado (tras pasar el challenge a mano) |
| oEmbed + RSS | Combinar metadatos baratos + cuerpo completo |
| Pegar el texto | Lo más rápido si solo es un post |

---

## 6. Respuesta concreta: ¿puedo ver el home de un subreddit sin saber ninguna URL de post?

**Sí, por tres vías. Verificadas las tres:**

### 6.1 RSS del sub (recomendada) — 1 request

```
https://www.reddit.com/r/{subreddit}/.rss
→ 200 | 25 <entry> | cada uno con <title>, <link> (permalink), <author>, <updated>
```

Devuelve exactamente el **home/listing real** del subreddit. De ahí salen las
URLs de los posts, que luego puedes pedir por RSS o por Arctic Shift.

### 6.2 embed.reddit.com del sub

```
https://embed.reddit.com/r/{subreddit}/
→ 200 | 566 KB de HTML SSR con <shreddit-post> (lista de posts renderizada)
```

### 6.3 Arctic Shift (cronológico, con histórico)

```
https://arctic-shift.photon-reddit.com/api/posts/search?subreddit={sub}&limit=100&sort=desc
https://arctic-shift.photon-reddit.com/api/posts/search?subreddit={sub}&after=2026-10-01&before=2026-10-10
https://arctic-shift.photon-reddit.com/api/subreddits/search?subreddit={sub}
```

Diferencia clave: Arctic Shift **no replica el ranking "hot"** de Reddit
(ordena por `created_utc`). Para aproximarlo, se trae una ventana amplia y se
ordena por `score` en local. Además da **histórico** (todo lo que existió), lo
que la web no da.

> Con `post_id` (sin slug) funciona, **siempre que el subreddit sea el
> correcto**: `https://www.reddit.com/r/EmprendedorES/comments/1wykzrq/.rss`
> → `200`, 14 entries. Con subreddit equivocado o placeholder (`r/_/`) → `404`.

---

## 7. Código listo para copiar

### 7.1 Wrapper con reintentos y backoff (ÚSalo siempre)

```js
// Reddit es agresivo con el rate limit: 429 es lo NORMAL, no la excepción.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function get(url, { tries = 5, baseWait = 8000, signal } = {}) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal });
    if (res.status === 429) {
      const wait = baseWait * (i + 1);
      console.warn(`429 en ${url} — reintento en ${wait / 1000}s`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
    return res;
  }
  throw new Error(`Rate limit persistente en ${url}`);
}
```

### 7.2 Post completo por RSS (sin API key)

```js
import { get } from "./http.js";

const ENT = (t) =>
  t.replace(/<script[\s\S]*?<\/script>/g, " ")
   .replace(/<style[\s\S]*?<\/style>/g, " ")
   .replace(/<[^>]+>/g, " ")
   .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
   .replace(/\s+/g, " ").trim();

export async function fetchPost(subreddit, postId) {
  const res = await get(`https://www.reddit.com/r/${subreddit}/comments/${postId}/.rss`);
  const xml = await res.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);

  return entries.map((e) => ({
    title:    (e.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").replace(/&#32;/g, " ").trim(),
    url:      (e.match(/<link href="([^"]+)"/)?.[1] || "").trim(),
    author:   (e.match(/<author>[\s\S]*?<name>([^<]+)/)?.[1] || "").trim(),
    created:  (e.match(/<updated>([^<]+)/)?.[1] || "").trim(),
    body:     ENT(e.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1] || ""),
  }));
}
```

```js
// OJO: el subreddit es obligatorio. r/_/ devuelve 404.
const post = await fetchPost("EmprendedorES", "1wykzrq");
console.log(post[0].title);   // Sacando de la quiebra a mis negocios (día 1)
console.log(post[0].body);    // texto completo del post
console.log(post.length - 1); // 13 comentarios
```

### 7.3 Listar un subreddit sin saber URLs (front page)

```js
export async function listSubreddit(sub, { limit = 25 } = {}) {
  const res = await get(`https://www.reddit.com/r/${sub}/.rss`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(m => m[1])
    .slice(0, limit)
    .map(e => ({
      title:  (e.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").replace(/&#32;/g, " ").trim(),
      url:    (e.match(/<link href="([^"]+)"/)?.[1] || "").trim(),
      author: (e.match(/<author>[\s\S]*?<name>([^<]+)/)?.[1] || "").trim(),
      date:   (e.match(/<updated>([^<]+)/)?.[1] || "").trim(),
    }));
}
```

### 7.4 Arctic Shift (JSON, histórico, batch)

```js
const ARCTIC = "https://arctic-shift.photon-reddit.com/api";

export async function arctic(path, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(ARCTIC + path, { headers: { "User-Agent": "scraper" } });
    const json = await res.json();
    // OJO: Arctic devuelve 200 con error en el body. Hay que mirarlo.
    if (json.data) return json.data;
    console.warn("Arctic timeout, reintento:", json.error);
    await new Promise(r => setTimeout(r, 3000 * (i + 1)));
  }
  throw new Error("Arctic Shift no responde");
}

// Post por id
const [p]    = await arctic(`/posts/ids?ids=1wykzrq`);
// Comentarios de un post
const comentarios = await arctic(`/comments/search?link_id=1wykzrq&limit=100`);
// Listado cronológico del subreddit
const feed   = await arctic(`/posts/search?subreddit=EmprendedorES&limit=100&sort=desc`);
// Ventana temporal
const window_ = await arctic(`/posts/search?subreddit=EmprendedorES&after=2026-10-01&before=2026-10-10`);
// Payload mínimo (4 campos) — mucho más rápido
const slim   = await arctic(`/posts/search?subreddit=EmprendedorES&limit=100&fields=title,author,score,created_utc`);
// Batch de ids
const many   = await arctic(`/posts/ids?ids=1wykzrq,1xawdrc,1xauj2z`);
// Metadata del subreddit
const subInfo = await arctic(`/subreddits/search?subreddit=EmprendedorES`);
```

### 7.5 oEmbed (metadatos, ~800 bytes)

```js
export async function oembed(permalink) {
  const url = `https://www.reddit.com/oembed?url=${encodeURIComponent(permalink)}`;
  return (await (await get(url)).json());
}
```

### 7.6 Combinar: front page → detalle de cada post

```js
const posts = await listSubreddit("EmprendedorES");
for (const p of posts.slice(0, 5)) {
  const id = p.url.match(/comments\/([a-z0-9]+)\//)?.[1];
  const [detalle, ...comentarios] = await fetchPost("EmprendedorES", id);
  console.log(detalle.title, "·", comentarios.length, "comentarios");
  await new Promise(r => setTimeout(r, 20000)); // Reddit 429 si no
}
```

---

## 8. Anti-bot: lo que se observó exactamente

| Comportamiento | Detalle |
|---|---|
| `.json` y familia `api/*.json` | `403` + HTML de 189.906 bytes: *"You've been blocked by network security"* |
| HTML de `www.reddit.com` | `200` pero shell JS de 8.487 B, sin contenido |
| HTML de `www.reddit.com/r/SUB/` | `200` pero "Prove your humanity" (166 KB de challenge) |
| Chrome headless | DOM de 170 KB, solo el challenge, 267 chars de texto |
| RSS | `200` normal, pero `429` si picas fuerte (~10 requests seguidos) |
| RSS | Tras 60–75 s de espera → `200` de nuevo. La **siguiente** request a +8 s o +12 s → `429` |
| `r/_/comments/ID/.rss` | `404` (el subreddit no es opcional en la URL) |
| `/new/.rss`, `/hot/.rss`, `/top/.rss` | `429` incluso espaciados 8 s |
| Arctic Shift | `200` + `{"error":"Timeout..."}` → reintentar con backoff |
| `old.reddit.com` | `302` a `/login/?reason=lor2` → `404` |

**Reglas prácticas de ritmo (medidas, no theory):**

1. **El límite es MUY agresivo.** Tras un cooldown de 60–75 s, la *primera*
   request vuelve a `200`, pero la *segunda* a **+8 s o +12 s ya da `429`**.
   Rango seguro observado: **~1 request cada 20 s** contra `www.reddit.com`.
2. Ante `429`: backoff exponencial, **mínimo 30 s** (probado: 60 s lo resuelve).
3. **Enruta por subdominio**: el 429 es por host, no global. `www.reddit.com`,
   `old.reddit.com` y `embed.reddit.com` cuentan por separado → reparte carga.
4. **Arctic Shift tiene su propio límite y es mucho más permisivo**: para
   volumen, ve por ahí y no por `www.reddit.com`.
5. **Cachea todo**: el RSS de un sub cambia poco en minutos. Guárdalo en disco
   si vas a reconsultar.
6. **Cambia tu User-Agent** si te bloquean; no es un warmup real pero evita
   heurísticas simples.
7. **Batch**: `/api/posts/ids?ids=A,B,C` en Arctic Shift trae N posts en una
   sola request. Multiplicar el rendimiento por N.

---

## 9. Árbol de decisión

```
Necesito el texto de UN post
├─ Tengo API key de Reddit (o puedo registrar una app)
│  └─→ OAuth2 + oauth.reddit.com          ← la mejor de todas, da el .json real
├─ Quiero algo rápido y sin credenciales
│  └─→ RSS:  /r/SUB/comments/ID/.rss      ← 1 request, texto completo
└─ Quiero JSON estructurado con muchos campos
   └─→ Arctic Shift: /api/posts/ids?ids=ID

Necesito el HOME de un subreddit
├─ El listing "hot" real, ahora
│  └─→ RSS:  /r/SUB/.rss                  ← 25 entries con permalinks
├─ Listado histórico o con filtros
│  └─→ Arctic Shift: /api/posts/search?subreddit=SUB&after=&before=
└─ Necesito el HTML renderizado
   └─→ embed.reddit.com/r/SUB/

Necesito escalar a millones de filas
└─→ Arctic Shift (única vía con window temporal + filtros + batch)
    + OAuth2 para lo que sea "en vivo"
```

---

## 10. Monitorear un subreddit (alertas de hilos nuevos)

**Sí se puede.** Pero la fuente correcta **no es el RSS**, y esto es lo más
importante que se midió:

### 10.1 Por qué el RSS NO sirve para "nació un hilo nuevo"

El feed `/r/SUB/.rss` es el listing **"hot"** y además está **cacheado**.
Medido en `r/EmprendedorES` el 20-oct-2026:

| Medición | Resultado |
|---|---|
| Entrada más nueva del feed | `2026-10-20 16:12` → **193 min de antigüedad** |
| Segunda llamada, 35 s después | **idéntica** (mismos 25 ids, mismo orden) |
| Posts que existían y NO aparecían | `1xay0sd` (17:13), `1xb0rn6` (18:54), `1xb1bkv` (19:15) |
| `/r/SUB/new/.rss` (cronológico real) | ⚠️ `429` de forma consistente |

Es decir: el front page te dice **qué se está haciendo viral**, no **qué acaba
de publicarse**. Un hilo nuevo con score 1 puede tardar horas en aparecer ahí.

### 10.2 La fuente correcta: Arctic Shift con cursor `after=`

```
https://arctic-shift.photon-reddit.com/api/posts/search
    ?subreddit={sub}
    &after={ISO-8601}
    &limit=50
    &sort=asc
    &fields=id,title,author,score,created_utc,num_comments,url,selftext,subreddit,link_flair_text
```

**Semántica del cursor (medida):**

| Comportamiento | Resultado |
|---|---|
| `after=<ts exacto de un post>` | **EXCLUSIVO**: ese post **no** sale (2 resultados, el borde no estaba) |
| `after=<ts del post - 5s>` | **Lo incluye** (3 resultados) |
| Solución | cursor = `último_visto - solapamiento` + dedupe por `id` |

> ⚠️ **El solapamiento DEBE superar el retraso de indexación.** Es el error más
> fácil de cometer y **pierde hilos en silencio**.
>
> El motivo: si el hilo A se creó 10 min antes que el hilo B, pero A se indexa
> después que B, al terminar el sondeo el cursor queda en B y A ya está "por
> detrás" del cursor. Con un solapamiento menor que el retraso, **A no aparece
> nunca más**.
>
> Demostrado con un par real de `r/EmprendedorES` separado **10,6 min**
> (`1xa3h0e` / `1xa3ral`):
>
> | Solapamiento | `after` resultante | ¿Recupera A? |
> |---|---|---|
> | 120 s (2 min) | `17:47:21` | ❌ **NO — se pierde para siempre** |
> | 1800 s (30 min) | `17:19:21` | ✅ **Sí** |
> | 3600 s (1 h) | `16:49:21` | ✅ Sí |
>
> **Valor por defecto: 1800 s (30 min)**, con margen de sobra sobre los
> ~10–15 min de retraso. Ajustable con `--overlap`. Es independiente de cada
> cuánto sontees: puedes usar `--every 1h` sin perder nada, porque el
> solapamiento es el que cubre el retraso de indexación.

**Retraso de indexación medido: ~10 min** (post más reciente en el índice:
19:15, hora de la consulta: 19:24).

**Límites y errores de Arctic Shift (medidos):**

| Caso | Comportamiento |
|---|---|
| `limit` > 100 | ⚠️ `400` → *"'limit' must be between 1 and 100"* |
| `limit=100` + ventana amplia | ⚠️ `422` → *"Timeout. Maybe slow down a bit"* (**status 200 con error en el body**) |
| `fields` inválido (ej. `permalink`, `is_self`, `stickied`, `ups`, `locked`, `edited`, `created`, `domain`, `thumbnail`, `upvote_ratio`) | ⚠️ `400` → *"'X' is not a valid field"* |
| `fields` válidos | `id, title, author, author_fullname, score, created_utc, num_comments, url, selftext, subreddit, over_18, link_flair_text, post_hint` |
| `ids=` en `/posts/search` | ⚠️ `400` → usar `/api/posts/ids?ids=…` |
| `q=` en `/posts/search` | ⚠️ `400` → no hay full-text genérico; usar `title=` / `selftext=` |
| Timeout transitorio | hay que **reintentar con backoff** (el 422 es normal, no es un fallo) |

### 10.3 Script listo para usar

```
scripts/reddit-watch.mjs
```

```bash
# Alerta continua cada 5 minutos
node scripts/reddit-watch.mjs --sub EmprendedorES --every 5m

# Solo hilos que mencionen "saas" o "agencia" -> webhook a Discord/Slack
node scripts/reddit-watch.mjs --sub EmprendedorES --every 5m \
  --match "saas,agencia" \
  --webhook https://discord.com/api/webhooks/XXX/YYY

# Backfill de 24h y salir (ideal para cron)
node scripts/reddit-watch.mjs --sub EmprendedorES --once --since 24h

# Detectar tambien "se hizo hot" (complementa a Arctic)
node scripts/reddit-watch.mjs --sub EmprendedorES --once --source both
```

| Flag | Función |
|---|---|
| `--sub <nombre>` | subreddit (repetible) |
| `--every <5m\|30s\|1h>` | intervalo de sondeo |
| `--since <now\|24h\|2d\|ISO>` | desde dónde arrancar la primera vez |
| `--match <kw,kw>` | solo alertar si título/cuerpo contiene alguna |
| `--exclude <kw,kw>` | descartar hilos que contengan esas |
| `--min-score <n>` | ignorar hilos con score bajo |
| `--webhook <url>` | POST JSON (Discord usa `content`, Slack usa `text`; se mandan ambos) |
| `--state <archivo>` | estado (default `.reddit-watch-state.json`, ya en `.gitignore`) |
| `--source <arctic\|rss\|both>` | fuente de datos |
| `--overlap <30m>` | ventana de solapamiento del cursor (default `30m`). **No la bajes por debajo de 20m** (§10.2) |
| `--show-body` | incluir el cuerpo del post |
| `--once` | un solo sondeo y salir |

El estado guarda el cursor y los ids vistos → **nunca repites la misma alerta**.
Verificado: 2ª pasada → *"sin novedades"*; `--match` y `--exclude` filtran
correctamente; los permalinks se construyen a partir de `subreddit`+`id`+slug
(el campo `url` de Arctic es el **enlace externo/media**, no el permalink).

### 10.4 Otras formas de monitorizar

| Vía | Latencia | Notas |
|---|---|---|
| **Arctic Shift** `after=` | ~10 min | La mejor relación señal/ruido. **Recomendada** |
| RSS front page | 30 min – 3 h+ | Listing hot cacheado. Útil para "se hizo hot" |
| Playwright + red real | <1 min | Captura el XHR que la SPA pide; requiere instalar `playwright-core` |
| OAuth2 + `oauth.reddit.com` | <1 min, en vivo | Lo mejor, pero exige registrar una app |
| Pushshift / PullPush | ~1 min | `api.pullpush.io/reddit/submission/search?subreddit=X&after=…` — también tiene cursor |
| Discord/Telegram bot | — | El watcher + `--webhook` cubre esto; o `reddit-monitor` de Docker Hub |

### 10.5 Scheduling

```bash
# cron cada 10 minutos, salida a un log
*/10 * * * * cd /ruta/proyecto && node scripts/reddit-watch.mjs --sub EmprendedorES --once --since 30m >> /var/log/reddit-watch.log 2>&1
```

Con `--since 30m` en cada corrida no necesitas estado: te da todo lo nuevo de
la última media hora. Simple y stateless.

---

## 11. Nota legal / ToS

- El API público de Reddit está governed por las
  [Reddit API Terms](https://www.redditinc.com/policies/data-api-terms) y la
  [Developer Terms](https://www.redditinc.com/policies/developer-terms).
  Automatizar sin OAuth puede violarlas; el acceso a `www.reddit.com` está en
  sus condiciones de scrapeo.
- **Recomendación**: para uso comercial o recurrente, registrar una app y usar
  OAuth2. Es más lento de montar (5 minutos) pero estable, permitido y
  escalable.
- Arctic Shift y PullPush son índices públicos de datos ya publicados; su uso
  para análisis y research es legítimo y transparente.
- Rate limiting agresivo, como el de Reddit, es su forma de decir "no lo
  hagas así". Respeta los límites y usa las vías con soporte.

---

## 12. Checklist antes de dar por muerto un fetch

```
1. ¿Es un endpoint .json de www.reddit.com?      → SIEMPRE 403. Usa RSS o Arctic.
2. ¿Estoy parseando www.reddit.com como HTML?    → Es un shell JS. No hay nada.
3. ¿Estoy usando old.reddit.com?                 → Te manda a login. Prueba .rss en www.
4. ¿Usé ctx_fetch_and_index / webfetch?          → Reddit los bloquea igual que curl.
5. ¿Reintento sin backoff?                       → 429 persiste. Espera 30-60 s.
6. ¿Probé embed.reddit.com?                      → Casi siempre funciona como fallback.
7. ¿El post es viejo (>2 años)?                  → Usa Arctic Shift, tiene todo el histórico.
8. ¿Necesito el ranking "hot" exacto?            → Solo www.reddit.com/r/SUB/.rss lo da.
```
