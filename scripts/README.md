# IndexNow URL Submission

This script submits all URLs from the sitemap to the IndexNow API so that Bing (and other participating search engines) crawl your pages.

## Prerequisites

You need an IndexNow API key. Generate one at [Bing Webmaster Tools](https://www.bing.com/webmasters).

After generating the key, you must host a verification file at your site root:

```
https://<your-domain>/<your-key>.txt
```

The file should contain just the key string. This proves you own the host.

## Usage

### Submit all URLs (local sitemap)

```bash
npm run indexnow
# or
INDEXNOW_KEY=<your-key> node scripts/submit-indexnow.js
```

### Submit all URLs (remote sitemap)

```bash
INDEXNOW_KEY=<your-key> npm run indexnow:remote
# or
INDEXNOW_KEY=<your-key> node scripts/submit-indexnow.js --sitemap https://your-domain.com/sitemap.xml
```

### Specify key and sitemap explicitly

```bash
node scripts/submit-indexnow.js --key <your-key> --sitemap https://your-domain.com/sitemap.xml
```

### Specify a custom host

```bash
node scripts/submit-indexnow.js --key <your-key> --site limitcode.jawuil.dev
```

### Use a local sitemap from a custom path

```bash
node scripts/submit-indexnow.js --key <your-key> --sitemap-dir ./dist/sitemap.xml
```

## Options

| Flag | Description |
|------|-------------|
| `--key <key>` | IndexNow API key (or `INDEXNOW_KEY` env var) |
| `--sitemap <url>` | Fetch sitemap from this remote URL instead of reading the local file |
| `--sitemap-dir <path>` | Read local sitemap from this path (default: `./public/sitemap.xml`) |
| `--site <host>` | Override the host extracted from the sitemap URLs |
| `--help` | Show help message |

## How it works

1. Reads the `sitemap.xml` file (local or remote) and extracts all `<loc>` URLs.
2. Splits URLs into batches of up to 10,000 (the IndexNow limit per request).
3. Sends a POST request to `https://api.indexnow.org/indexnow` with the batch of URLs.
4. Reports success/failure for each batch.

## API reference

See the official documentation: https://www.indexnow.org/documentation

---

# Reddit Watch

`scripts/reddit-watch.mjs` monitors one or more subreddits and alerts you when
new threads appear. It uses the [Arctic Shift](https://arctic-shift.photon-reddit.com/)
public Reddit index (no API key, no auth) because Reddit's own `.json` and
front-page RSS endpoints are blocked from datacenter IPs and the front-page RSS
is a cached "hot" listing that lags hours behind.

See the full reference in [`../REDDIT_DATA_GUIDE.md`](../REDDIT_DATA_GUIDE.md) (§10).

## Usage

```bash
# Poll every 5 minutes
node scripts/reddit-watch.mjs --sub EmprendedorES --every 5m

# Only threads matching keywords, pushed to a Discord/Slack webhook
node scripts/reddit-watch.mjs --sub EmprendedorES --every 5m \
  --match "saas,agencia" \
  --webhook https://discord.com/api/webhooks/XXX/YYY

# One-shot backfill of the last 24 hours (stateless, ideal for cron)
node scripts/reddit-watch.mjs --sub EmprendedorES --once --since 24h
```

## Options

| Flag | Description |
|------|-------------|
| `--sub <name>` | Subreddit to watch (repeatable) |
| `--every <5m\|30s\|1h>` | Poll interval (default: `5m`) |
| `--since <now\|24h\|2d\|ISO>` | Where to start on the first run (default: `now`) |
| `--match <kw,kw>` | Only alert if title/body contains one of these |
| `--exclude <kw,kw>` | Skip threads containing these |
| `--min-score <n>` | Skip threads with score below `n` |
| `--webhook <url>` | POST JSON alert (Discord `content` / Slack `text` — both sent) |
| `--state <file>` | State file (default `.reddit-watch-state.json`, gitignored) |
| `--source <arctic\|rss\|both>` | Data source (default: `arctic`) |
| `--overlap <30m>` | Cursor overlap window (default: `30m`). **Don't lower it below 20m** — it must exceed Arctic Shift's indexing delay, or threads are silently lost |
| `--show-body` | Include the post body in the output |
| `--once` | Single poll, then exit |
| `--help` | Show help |

## Notes

- Arctic Shift indexes posts with roughly a **10 minute delay**. The cursor
  overlap (`--overlap`, default 30m) must exceed that delay, otherwise a thread
  created just before a poll but indexed after it is **silently lost**. This is
  independent of the poll interval — `--every 1h` is safe.
- The state file stores the cursor and seen IDs, so the same thread is never
  alerted twice.
- For real-time (<1 min) alerts you need an authenticated path — see the
  OAuth2 section of the guide.
