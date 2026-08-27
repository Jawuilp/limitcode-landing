# Limitcode Pro vs GitHub Copilot

Comparison of a Sublime Text coding agent and GitHub Copilot.
Canonical page: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-copilot/

## Short answer

GitHub Copilot is exceptional if you work in VS Code, Visual Studio, JetBrains,
or on GitHub — broad models (Claude, GPT-5.x, Gemini, Grok, Kimi), inline
completions, a CLI, a cloud agent that opens pull requests, and code review.
But it has no Sublime Text plugin, and its agent mode excludes Sublime
entirely. Limitcode Pro is an agent that lives inside Sublime Text, edits
files, runs approved commands, and can use Copilot and many other providers as
its brain. For a Sublime-centric developer, Limitcode Pro is the missing piece.

## At a glance

| Aspect | Limitcode Pro | GitHub Copilot |
| --- | --- | --- |
| What it is | Coding agent inside Sublime Text | AI assistance (completions, chat, agents) |
| Sublime Text | Native, first-class | Not supported |
| Agent mode | Works incl. Sublime | VS Code, Visual Studio, JetBrains, Eclipse, Xcode |
| Models | Copilot, OpenAI, Anthropic, Gemini, DeepSeek, local | Very broad (Claude, GPT-5.x, Gemini, Grok, Kimi) |
| Billing | One-time; provider at cost | Subscription + AI Credits |
| Price | One-time license, up to 3 devices | Free, then $10 / $39 / $100 per user/month |

## What is GitHub Copilot?

GitHub's AI coding assistant across VS Code, Visual Studio, JetBrains, Xcode,
Neovim, Eclipse and more, plus directly on GitHub. It offers completions,
next-edit suggestions, an in-editor agent mode, a CLI, a cloud agent, and code
review. Model breadth is huge (Anthropic Claude, OpenAI GPT-5.x, Google
Gemini, xAI Grok, Kimi). Billing is a subscription (Free, Pro, Pro+, Max)
with usage metered through GitHub AI Credits. It is a superb product for the
GitHub and mainstream-IDE ecosystem.

## What is Limitcode Pro?

A lightweight coding agent that lives inside Sublime Text (builds 4050+) -
no separate AI IDE required. It searches
across your project, proposes targeted edits for approval, runs shell commands
under permission rules, searches the web, loads skills, calls MCP servers, and
spawns focused subagents in a side-by-side view with no daemon behind it.
Providers: OpenAI, Anthropic, Gemini, DeepSeek, OpenRouter, Copilot, Ollama,
LM Studio, any OpenAI-compatible endpoint, plus account sign-in with GitHub
Copilot, OpenAI Codex, or Google Antigravity.

## Core difference

GitHub Copilot is built around GitHub and the editors GitHub prioritises; it
does not support Sublime Text and its agent mode excludes it. Limitcode Pro
inverts the relationship: the agent adapts to your editor, works in Sublime
Text, and can route to Copilot's models or to OpenAI, Anthropic, Gemini,
DeepSeek, or a local model — without switching editors or paying a per-seat
subscription.

## Pricing

- Copilot: free tier (2,000 completions/mo), then $10, $39, or $100 per
  user/month, plus GitHub AI Credits ($15/$70/$200 per month) consumed by chat,
  agent mode, code review, cloud agent, and CLI.
- Limitcode Pro: one-time license up to three devices; provider usage at cost.
  Free open-source edition for pair programming (GPL v3).

## FAQ

**Does GitHub Copilot work with Sublime Text?** No — its environments are
GitHub, VS Code, Visual Studio, Xcode, JetBrains, Neovim, Eclipse and others.
Sublime Text is not supported, and agent mode excludes it.

**Can I use Copilot with Limitcode Pro?** Yes — Limitcode Pro supports GitHub
Copilot account sign-in as a provider, alongside OpenAI, Anthropic, Gemini,
DeepSeek and local models.

**Is GitHub Copilot free?** Free tier exists (2,000 completions/mo, limited
chat/agent); then Pro $10, Pro+ $39, Max $100 per user/month, plus credits.

**Main difference?** Copilot is an assistant built around GitHub and
mainstream IDEs; Limitcode Pro is an agent built for Sublime Text that can
call many providers, including local models.

## Links

- Product: https://limitcode.jawuil.dev/
- Pricing: https://limitcode.jawuil.dev/#pricing
- Providers: https://limitcode.jawuil.dev/providers/
- Blog: https://limitcode.jawuil.dev/blog/
- Support: hola@jawuil.dev
