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
