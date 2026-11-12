# Limitcode Pro — Privacy Policy

Last updated: November 12, 2026

Limitcode Pro and the open-source Limitcode plugin are built by Jawuil (https://jawuil.dev).

## Summary (TL;DR)
- **Zero code middleman in the plugin:** Your source code, file contents, prompts, and model responses go directly from your computer to your chosen AI provider (or stay 100% local with Ollama / LM Studio). Limitcode servers never receive, proxy, log, or store your code or prompts.
- **Local API keys & OAuth tokens:** Provider API keys and OAuth tokens (GitHub Copilot, OpenAI Codex, Google Antigravity) stay in your local Sublime Text configuration and are never sent to Limitcode servers.
- **Minimal license check (Pro only):** Limitcode Pro sends only your license key, plugin version, and a non-reversible machine fingerprint to verify the 3-device limit and issue a 30-day offline grant.
- **Zero editor telemetry:** No usage telemetry, keystroke logging, or crash reporting runs inside Sublime Text.

## 1. Sublime Text Plugin Data Handling
- **Direct-to-provider requests:** All AI requests connect directly from Sublime Text's `plugin_host` to the provider endpoint you configured.
- **Local history & snapshots:** Stored locally on your machine in your Sublime Text data directory.
- **License activation:** Only `license_key`, a hashed machine identifier, and platform/version metadata are sent to the Limitcode license service.

## 2. Website Data Handling (`limitcode.jawuil.dev`)
- **Analytics & Heatmaps:** The website uses self-hosted Umami analytics, own analytics scripts, and Microsoft Clarity (`clarity.ms`) to analyze traffic and anonymized page interactions so we can improve documentation and usability. These scripts run only on the website, never inside the Sublime Text plugin.
- **Purchases (Gumroad):** Orders are processed by Gumroad as Merchant of Record. We receive your purchase email, name, country, and license key to provide license activation, updates, and support, and never see your full payment card details.

## 3. Open-Source Transparency & Contact
- Audit the open-source edition on GitHub: https://github.com/Jawuilp/Limitcode
- Contact: hola@jawuil.dev
