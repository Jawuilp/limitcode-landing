# Limitcode Pro vs TermMate

Comparison of two AI coding-agent options for Sublime Text. Canonical page:
https://limitcode.jawuil.dev/blog/limitcode-pro-vs-termmate/

## Short answer

TermMate is a free host that docks external coding-agent CLIs — Claude Code,
Codex, OpenCode, and Pi Agent — inside Sublime Text or VS Code. Limitcode Pro
is a self-contained agent that lives in Sublime Text itself, connects directly
to your provider of choice (including local models), and applies one consistent
permission model to everything it does. For a single, predictable Sublime Text
workflow, Limitcode Pro is the more complete option; TermMate fits developers
who already pay for Claude Code or Codex and want them embedded in an editor.

## At a glance

| Aspect | Limitcode Pro | TermMate |
| --- | --- | --- |
| What it is | Native coding agent inside Sublime Text | Host for external agent CLIs |
| Editors | Sublime Text 4 | Sublime Text + VS Code |
| Setup | One package | One install per hosted CLI |
| Models | Direct API keys, account sign-in, local models | Whatever each hosted agent supports |
| Permissions | One configurable rule set | Approval settings differ per agent |
| Undo | Snapshot undo/redo | Depends on connected agent |
| Price | One-time license, up to 3 devices | Free; hosted agents billed separately |

## What is TermMate?

A package for Sublime Text and VS Code that embeds third-party agents —
Claude Code, Codex, OpenCode, Pi Agent — in an editor panel. Free to install,
sessions persist across restarts, agents are tied to the current window and
folder. The agent doing the work is never TermMate itself: each CLI brings its
own runtime, auth, approvals, and update cycle. TermMate's own feature matrix
shows gaps: slash commands and sandbox mode only for Claude Code and Codex,
thinking blocks only for Pi, no MCP tools on Pi.

## What is Limitcode Pro?

A lightweight coding agent built to run natively inside Sublime Text (builds
4050+) - no separate AI IDE required, not a
wrapper around another CLI. It searches across your project, proposes edits for
approval, runs shell commands under permission rules, searches the web, loads
skills, calls MCP servers, and runs focused subagents in a side-by-side view.
Providers: OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter, Copilot, Ollama,
LM Studio, any OpenAI-compatible endpoint, plus account sign-in with GitHub
Copilot, OpenAI Codex, or Google Antigravity.

## Core difference

TermMate's editor experience is only as consistent as the four CLIs behind it:
four runtimes to install, four auth flows, features that vary per agent.
Limitcode Pro is one runtime with uniform permission rules, snapshot undo/redo,
automatic context compaction, and direct provider connections — swapping models
is a settings change, not a new toolchain.

## Pricing

- TermMate: free to install; hosted agents may require their own subscriptions
  or API plans (Claude, ChatGPT, API credits).
- Limitcode Pro: one-time license valid on up to three devices; your provider
  bills usage directly. A free open-source edition covers pair programming on
  open files (GPL v3).

## FAQ

**Is TermMate free?** Yes; the agent CLIs it hosts may require their own paid
plans.

**Does TermMate work with Sublime Text?** Yes, via Package Control; there is
also a VS Code extension.

**Main difference?** TermMate is a bridge to external CLIs; Limitcode Pro is a
self-contained native agent.

**Own API key needed for Limitcode Pro?** Bring API keys or use account
sign-in (Copilot, Codex, Antigravity); local models supported.

**Offline/local models?** Ollama and LM Studio are supported by Limitcode Pro.

**Free version of Limitcode?** Yes, the open-source pair-programming edition.

## Links

- Product: https://limitcode.jawuil.dev/
- Pricing: https://limitcode.jawuil.dev/#pricing
- Providers: https://limitcode.jawuil.dev/providers/
- Docs: https://limitcode.jawuil.dev/docs/
- Support: hola@jawuil.dev
