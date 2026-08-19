#!/usr/bin/env node
import fs from "fs";
import path from "path";
import https from "https";
import { URL } from "url";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * IndexNow URL submission script.
 *
 * Reads URLs from sitemap.xml and submits them to the IndexNow API in batches
 * (max 10,000 URLs per request, per the IndexNow specification).
 *
 * Usage:
 *   INDEXNOW_KEY=<your-key> node scripts/submit-indexnow.js
 *   node scripts/submit-indexnow.js --key <your-key>
 *
 * The sitemap path defaults to:
 *   ./public/sitemap.xml (project)
 *
 * Or pass a remote sitemap via --sitemap https://example.com/sitemap.xml
 */

const MAX_URLS_PER_REQUEST = 10000;
const INDEXNOW_HOST = "api.indexnow.org";
const INDEXNOW_PORT = 443;

const args = process.argv.slice(2);
let key = process.env.INDEXNOW_KEY || "";
let sitemapUrl = "";
let sitemapPath = path.join(__dirname, "..", "public", "sitemap.xml");

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--key" && args[i + 1]) {
    key = args[++i];
  }
  if (args[i] === "--sitemap" && args[i + 1]) {
    sitemapUrl = args[++i];
    sitemapPath = null;
  }
  if (args[i] === "--sitemap-dir" && args[i + 1]) {
    sitemapPath = path.resolve(args[++i]);
  }
  if (args[i] === "--site" && args[i + 1]) {
    global.SITE_HOST = args[++i];
  }
  if (args[i] === "--help" || args[i] === "-h") {
    console.log(`
IndexNow URL Submission Script
==============================

Usage: INDEXNOW_KEY=<key> node scripts/submit-indexnow.js [options]

Options:
  --key <key>        IndexNow API key (or INDEXNOW_KEY env var)
  --sitemap <url>    Remote sitemap URL to fetch URLs from
  --sitemap-dir <dir>  Path to local sitemap.xml (default: ./public/sitemap.xml)
  --site <host>      Host to submit (default: extracted from sitemap URLs)
  --help, -h         Show this help message

The key file {your-key}.txt must be hosted at the root of your site for ownership verification.
Visit https://www.bing.com/webmasters to generate an IndexNow key.
`);
    process.exit(0);
  }
}

if (!key) {
  console.error("Error: IndexNow key is required.");
  console.error("Set INDEXNOW_KEY environment variable or use --key <key>");
  console.error("Generate one at https://www.bing.com/webmasters\n");
  process.exit(1);
}

async function fetchXml(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "GET",
    };
    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extractUrlsFromXml(xml) {
  const urls = [];
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1].trim();
    if (url) urls.push(url);
  }
  return urls;
}

function extractHost(urls) {
  if (urls.length === 0) return "";
  try {
    return new URL(urls[0]).hostname;
  } catch {
    return "";
  }
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function submitToIdx(batch, host) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: global.SITE_HOST || host,
      key: key,
      urlList: batch,
    });

    const postData = Buffer.byteLength(payload);

    const options = {
      hostname: INDEXNOW_HOST,
      port: INDEXNOW_PORT,
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": postData,
      },
    };

    const req = https
      .request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const { statusCode } = res;
          resolve({ statusCode, body });
        });
      })
      .on("error", reject);

    req.write(payload);
    req.end();
  });
}

async function main() {
  let xml = "";

  if (sitemapUrl) {
    console.log(`Fetching sitemap: ${sitemapUrl}`);
    xml = await fetchXml(sitemapUrl);
  } else {
    console.log(`Reading sitemap: ${sitemapPath}`);
    xml = fs.readFileSync(sitemapPath, "utf8");
  }

  const urls = extractUrlsFromXml(xml);

  if (urls.length === 0) {
    console.log("No URLs found in sitemap. Nothing to submit.");
    return;
  }

  const host = extractHost(urls);
  console.log(`\nFound ${urls.length} URL(s) in sitemap.`);
  console.log(`Detected host: ${host || "(none — will use --site value)"}\n`);

  const batches = chunkArray(urls, MAX_URLS_PER_REQUEST);
  let success = 0;
  let totalErrors = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const from = i * MAX_URLS_PER_REQUEST + 1;
    const to = from + batch.length - 1;
    console.log(
      `Submitting batch ${i + 1}/${batches.length} (URLs ${from}-${to}):`
    );

    // Show up to 5 URLs in the batch
    if (batch.length <= 5) {
      batch.forEach((u) => console.log(`  - ${u}`));
    } else {
      batch.slice(0, 5).forEach((u) => console.log(`  - ${u}`));
      console.log(`  ... and ${batch.length - 5} more`);
    }

    try {
      const { statusCode, body } = await submitToIdx(batch, host);
      if (statusCode === 200) {
        console.log(`  [OK] HTTP 200 - URLs accepted by IndexNow.`);
        success += batch.length;
      } else {
        console.log(`  [FAIL] HTTP ${statusCode} - ${body}`);
        totalErrors += batch.length;
      }
    } catch (err) {
      console.log(`  [ERROR] ${err.message}`);
      totalErrors += batch.length;
    }
    console.log("");
  }

  console.log("=".repeat(50));
  console.log(`Total URLs submitted:    ${urls.length}`);
  console.log(`Successfully accepted:   ${success}`);
  console.log(`Errors:                  ${totalErrors}`);
  console.log("=".repeat(50));

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
