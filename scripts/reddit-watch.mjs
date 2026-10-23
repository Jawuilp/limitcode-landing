#!/usr/bin/env node
/**
 * Reddit subreddit watcher — detecta hilos nuevos y dispara alertas.
 *
 * Por qué Arctic Shift y no el RSS de Reddit:
 *   - El feed /r/SUB/.rss de Reddit es un listing "hot" CACHEADO. Medido:
 *     dos llamadas separadas 35 s devolvieron contenido IDÉNTICO, y su entrada
 *     más nueva tenía 193 min de antigüedad. Los hilos nuevos con score bajo
 *     tardan horas en aparecer ahí. Serviría para "se hizo hot", no para
 *     "nació".
 *   - /r/SUB/new/.rss (que sí es cronológico) responde 429 de forma
 *     consistente desde IPs de datacenter.
 *   - Arctic Shift: /api/posts/search?subreddit=X&after=<cursor> devuelve los
 *     posts en orden cronológico estricto. Retraso de indexación medido: ~10 min.
 *
 * El cursor usa una ventana solapada porque `after` es EXCLUSIVO (strictly
 * greater than): si el cursor fuera exactamente el timestamp del último post
 * visto, ese post se saltaría. Por eso restamos OVERLAP_SEC y deduplicamos
 * por id.
 *
 * Uso:
 *   node scripts/reddit-watch.mjs --sub EmprendedorES --every 5m
 *   node scripts/reddit-watch.mjs --sub EmprendedorES --once --since 24h
 *   node scripts/reddit-watch.mjs --sub EmprendedorES --match "saas,agencia" \
 *     --webhook https://discord.com/api/webhooks/XXX/YYY
 */

import fs from "fs";
import path from "path";

const ARCTIC = "https://arctic-shift.photon-reddit.com/api";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// `after` es exclusivo -> solapamos para no perder posts con el mismo timestamp.
//
// IMPORTANTE: el solapamiento DEBE superar el retraso de indexacion de Arctic
// Shift (~10-15 min medidos). Si solapas menos que el retraso, un post creado
// justo antes de un sondeo pero indexado despues se salta por el medio y NUNCA
// lo veras. 30 min deja margen de sobra. Ajustable con --overlap.
const OVERLAP_SEC = 1800;
// maximo real del API (400 si te pasas)
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;
// ids vistos que conservamos (el solapamiento re-trae posts ya vistos)
const SEEN_CAP = 2000;
// campos confirmados validos en Arctic Shift
const FIELDS = [
  "id",
  "title",
  "author",
  "score",
  "created_utc",
  "num_comments",
  "url",
  "selftext",
  "subreddit",
  "link_flair_text",
].join(",");

const args = process.argv.slice(2);
const opts = {
  subs: [],
  every: "5m",
  since: "now",
  match: [],
  exclude: [],
  minScore: null,
  webhook: null,
  state: path.resolve(process.cwd(), ".reddit-watch-state.json"),
  once: false,
  source: "arctic",
  showBody: false,
  overlap: null,
};

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  const next = () => args[++i];
  if (a === "--sub") opts.subs.push(next().replace(/^\/?r\//i, ""));
  else if (a === "--every") opts.every = next();
  else if (a === "--since") opts.since = next();
  else if (a === "--match") opts.match.push(...next().split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  else if (a === "--exclude") opts.exclude.push(...next().split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  else if (a === "--min-score") opts.minScore = Number(next());
  else if (a === "--webhook") opts.webhook = next();
  else if (a === "--state") opts.state = path.resolve(process.cwd(), next());
  else if (a === "--once") opts.once = true;
  else if (a === "--source") opts.source = next();
  else if (a === "--show-body") opts.showBody = true;
  else if (a === "--overlap") opts.overlap = parseDuration(next());
  else if (a === "--help" || a === "-h") {
    console.log(`
Reddit Watch — alerta de hilos nuevos en un subreddit
=====================================================

  node scripts/reddit-watch.mjs --sub <nombre> [opciones]

Opciones:
  --sub <nombre>       subreddit (repetible). Ej: --sub EmprendedorES
  --every <5m|30s|1h>  intervalo de sondeo (default: 5m)
  --since <now|24h|2d|ISO>   desde donde arrancar la primera vez (default: now)
  --match <kw,kw>      solo alertar si el titulo/cuerpo contiene alguna de estas
  --exclude <kw,kw>    descartar hilos que contengan estas palabras
  --min-score <n>      ignorar hilos con score < n
  --webhook <url>      enviar alerta por POST JSON (Discord o Slack)
  --state <archivo>    archivo de estado (default: .reddit-watch-state.json)
  --source <arctic|rss|both>  fuente de datos (default: arctic)
  --show-body          incluir el cuerpo del post en la salida
  --overlap <30m>      ventana de solapamiento del cursor (default: 30m)
  --once               un solo sondeo y salir (ideal para cron)
  --help               esta ayuda

Notas:
  - Arctic Shift tiene ~10 min de retraso de indexacion.
  - El RSS (/r/SUB/.rss) es un listing hot CACHEADO: sirve para detectar
    "se hizo hot", no "nacio". Con --source=both se consultan ambos.
  - El estado guarda el cursor y los ids vistos, para no repetir alertas.
`);
    process.exit(0);
  }
}

if (!opts.subs.length) {
  console.error("Error: falta --sub <nombre>");
  console.error("Ej: node scripts/reddit-watch.mjs --sub EmprendedorES --every 5m");
  process.exit(1);
}

function parseDuration(s) {
  const m = /^(\d+)(s|m|h|d)$/i.exec(String(s).trim());
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  return n * { s: 1, m: 60, h: 3600, d: 86400 }[unit];
}

function resolveSince(s) {
  const v = String(s).trim();
  if (v === "now") return Math.floor(Date.now() / 1000);
  const dur = parseDuration(v);
  if (dur) return Math.floor((Date.now() - dur * 1000) / 1000);
  const d = Date.parse(v);
  if (!Number.isNaN(d)) return Math.floor(d / 1000);
  throw new Error(`--since invalido: ${s}`);
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(opts.state, "utf8"));
  } catch {
    return { subs: {} };
  }
}

function saveState(state) {
  fs.writeFileSync(opts.state, JSON.stringify(state, null, 2));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Consulta Arctic Shift. Reintenta los timeouts (422) con backoff y NO
 * reintenta los errores de parametro (400), que no se van a arreglar.
 */
async function arctic(pathname, { tries = 6 } = {}) {
  for (let i = 0; i < tries; i++) {
    let json;
    try {
      const res = await fetch(ARCTIC + pathname, {
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
      const text = await res.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: `respuesta no-JSON (${res.status})` };
      }
    } catch (err) {
      json = { error: err.message };
    }

    if (json && Array.isArray(json.data)) return json.data;

    const err = (json && json.error) || "sin data";
    if (/is not a valid field|must be between|Unknown query parameter/i.test(err)) {
      throw new Error(`peticion invalida a Arctic Shift: ${err}`);
    }
    // 422 "Timeout. Maybe slow down a bit" -> transitorio, reintentar
    const wait = 2000 * (i + 1);
    console.error(`  [arctic] ${err} -> reintento en ${wait / 1000}s`);
    await sleep(wait);
  }
  throw new Error("Arctic Shift no respondio tras varios intentos");
}

/** RSS del front page (listing hot cacheado). Alternativa/complemento. */
async function rssFrontPage(sub) {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(`https://www.reddit.com/r/${sub}/.rss`, {
      headers: { "User-Agent": UA },
    });
    if (res.status === 429) {
      const wait = 30000 * (i + 1);
      console.error(`  [rss] 429 en r/${sub} -> espero ${wait / 1000}s`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`RSS ${res.status} en r/${sub}`);
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => {
      const e = m[1];
      return {
        id: (e.match(/comments\/([a-z0-9]+)\//) || [])[1],
        title: ((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").replace(/&#32;/g, " ").trim(),
        author: ((e.match(/<author>[\s\S]*?<name>([^<]+)/) || [])[1] || "").replace(/^\/u\//, ""),
        created_utc: Math.floor(
          Date.parse((e.match(/<updated>([^<]+)/) || [])[1] || 0) / 1000
        ),
        url: (e.match(/<link href="([^"]+)"/) || [])[1] || "",
        score: null,
        num_comments: null,
        selftext: "",
      };
    });
  }
  throw new Error(`RSS r/${sub}: rate limit persistente`);
}

function matches(post) {
  const hay = `${post.title || ""}\n${post.selftext || ""}`.toLowerCase();
  if (opts.exclude.some((k) => hay.includes(k))) return false;
  if (opts.match.length && !opts.match.some((k) => hay.includes(k))) return false;
  if (opts.minScore !== null && (post.score ?? 0) < opts.minScore) return false;
  return true;
}

function permalinkOf(post, sub) {
  const slug = String(post.title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return `https://www.reddit.com/r/${sub}/comments/${post.id}/${slug}/`;
}

function formatPost(post, sub) {
  const when = new Date(post.created_utc * 1000).toISOString().replace("T", " ").slice(0, 16);
  const score = post.score === null || post.score === undefined ? "" : ` [${post.score} pts]`;
  const comments = post.num_comments === null || post.num_comments === undefined ? "" : ` (${post.num_comments} com.)`;
  const flair = post.link_flair_text ? ` <${post.link_flair_text}>` : "";
  // `url` de Arctic es el link externo/media, NO el permalink del hilo
  const link = permalinkOf(post, sub);
  let out = `  ${when}${score}${comments} u/${post.author}${flair}\n    ${post.title}\n    ${link}`;
  const external = post.url && !post.url.includes("reddit.com/r/") ? post.url : null;
  if (external) out += `\n    (enlace externo: ${external})`;
  if (opts.showBody && post.selftext) {
    out += `\n    ${post.selftext.slice(0, 400).replace(/\n+/g, " ")}`;
  }
  return out;
}

async function notify(title, body) {
  if (!opts.webhook) return;
  // Discord usa {content}, Slack usa {text}: mandamos ambos.
  const payload = { content: `${title}\n${body}`, text: `${title}\n${body}` };
  try {
    const res = await fetch(opts.webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error(`  [webhook] HTTP ${res.status}`);
  } catch (err) {
    console.error(`  [webhook] ${err.message}`);
  }
}

async function pollOnce(state) {
  let total = 0;

  for (const sub of opts.subs) {
    if (!state.subs[sub]) {
      const since = resolveSince(opts.since);
      state.subs[sub] = { cursor: since, seen: [] };
      console.log(`[init] r/${sub} arrancando desde ${new Date(since * 1000).toISOString()}`);
    }
    const st = state.subs[sub];
    const seen = new Set(st.seen);

    let candidates = [];

    if (opts.source === "arctic" || opts.source === "both") {
      // `after` es EXCLUSIVO -> retrocedemos el solapamiento y deduplicamos por id
      const overlap = opts.overlap ?? OVERLAP_SEC;
      const from = st.cursor - overlap;
      const qs = new URLSearchParams({
        subreddit: sub,
        after: new Date(from * 1000).toISOString(),
        limit: String(MAX_LIMIT),
        sort: "asc",
        fields: FIELDS,
      });
      const posts = await arctic(`/posts/search?${qs}`);
      candidates = posts.map((p) => ({ ...p, _src: "arctic" }));
    }

    if (opts.source === "rss" || opts.source === "both") {
      const posts = await rssFrontPage(sub);
      const rssIds = new Set(posts.map((p) => p.id));
      // combina: lo que el RSS tiene y Arctic aun no vio
      const soloRss = posts.filter((p) => p.id && !candidates.some((c) => c.id === p.id));
      candidates = candidates.concat(soloRss.map((p) => ({ ...p, _src: "rss" })));
    }

    const fresh = candidates.filter((p) => p.id && !seen.has(p.id));
    fresh.sort((a, b) => a.created_utc - b.created_utc);

    const alerted = [];
    for (const post of fresh) {
      seen.add(post.id);
      st.cursor = Math.max(st.cursor, post.created_utc);
      if (!matches(post)) continue;
      alerted.push(post);
    }

    if (alerted.length) {
      console.log(`\n[r/${sub}] ${alerted.length} hilo(s) nuevo(s):`);
      const chunk = alerted.map((p) => formatPost(p, sub)).join("\n");
      console.log(chunk);
      await notify(`🔔 r/${sub} — ${alerted.length} hilo(s) nuevo(s)`, chunk);
      total += alerted.length;
    } else {
      console.log(`[r/${sub}] sin novedades`);
    }

    // podar ids vistos (mantenemos los 500 mas recientes)
    st.seen = [...seen].slice(-SEEN_CAP);
  }

  saveState(state);
  return total;
}

async function main() {
  const state = loadState();
  const intervalMs = parseDuration(opts.every) * 1000 || 300000;

  if (opts.once) {
    const n = await pollOnce(state);
    console.log(`\nTotal alertado: ${n}`);
    return;
  }

  console.log(`Watch activo cada ${opts.every} (Ctrl+C para salir)`);
  for (;;) {
    try {
      const n = await pollOnce(state);
      if (n) console.log(`\n[${new Date().toISOString()}] ${n} alerta(s)`);
    } catch (err) {
      console.error(`[error] ${err.message}`);
    }
    await sleep(intervalMs);
  }
}

process.on("SIGINT", () => {
  console.log("\nSaliendo. Estado guardado.");
  process.exit(0);
});

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
