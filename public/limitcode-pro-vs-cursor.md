# Limitcode Pro vs Cursor

Stay in Sublime Text without giving up AI agents.
Canonical page: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-cursor/

## Short answer

Cursor is an AI-first code editor built on VS Code: Tab completions, agent
mode, background agents, and frontier models as first-class parts of the
editor. Adopting it means migrating away from your current editor - there is
no Sublime Text plugin. Limitcode Pro is the other path: a lightweight agent
that runs natively inside Sublime Text, with BYOK providers (including local
models), configurable permission rules, snapshot undo/redo, and a one-time
license instead of a subscription. If you want a new editor, Cursor is worth a
look; if you want to stay in Sublime, Limitcode Pro is built for you.

## At a glance

| Aspect | Limitcode Pro | Cursor |
| --- | --- | --- |
| What it is | Coding agent inside Sublime Text | AI-first editor (VS Code fork) with agent |
| Editor | Your Sublime Text, unchanged | Cursor itself - you switch editors |
| Sublime Text support | Native, first-class | None - standalone editor |
| Agent mode | Side-by-side agent with approved edits | Agent mode plus background agents |
| Inline completions | Not included | Tab completions |
| Models | OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter, Copilot, local | Frontier models via Cursor's plans |
| Provider choice | BYOK - your keys, your accounts | Usage through Cursor's billing |
| Price | One-time license, up to 3 devices | Free Hobby, Pro $20/mo, Pro+ $60/mo, Ultra $200/mo, Teams $40/user/mo |

## What is Cursor?

An AI-first code editor built on VS Code by Anysphere. It integrates Tab
completions, in-editor agent mode for multi-step tasks, parallel background
agents, MCP support, and access to frontier models. Pricing runs from a free
Hobby tier through Pro ($20/month), Pro+ ($60/month), Ultra ($200/month), and
Teams ($40/user/month), with model usage metered through Cursor's billing.

## What is Limitcode Pro?

A lightweight coding agent built to run natively inside Sublime Text (builds
4050+) - no separate AI IDE, no editor migration, and no separate agent daemon
required for direct API providers. It inspects project files, applies approved
edits, runs approved commands, searches the web, loads skills, calls MCP
servers, and runs focused subagents under configurable permission rules, with
snapshot undo/redo for agent edits. Providers: OpenAI, Anthropic, Gemini,
DeepSeek, OpenRouter, Copilot, Codex, Antigravity, or local models via Ollama
and LM Studio.

## Pricing

- Cursor: Hobby free (limited), Pro $20/month, Pro+ $60/month, Ultra
  $200/month, Teams $40/user/month; model usage through Cursor's billing.
- Limitcode Pro: one-time license on up to 3 devices; model usage paid
  directly to your chosen provider at cost. Free open-source edition covers
  pair programming.

## Who should use Cursor

Developers open to switching editors who want completions, agents, and
background agents as one integrated product.

## Who should use Limitcode Pro

Developers who want to keep Sublime Text as their editor and add an agentic
workflow to it - BYOK providers, permission rules, and a one-time license.

More: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-cursor/
