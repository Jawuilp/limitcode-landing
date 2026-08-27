# Limitcode Pro vs Pi

Ready-to-use Sublime agent vs build-your-own AI harness.
Canonical page: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-pi/

## Short answer

Pi is a minimal, highly extensible coding-agent harness: terminal-first, free
and open source, designed for power users who want to assemble their own
agentic workflow from a small core. Limitcode Pro takes the opposite trade: a
packaged, ready-to-use agent that runs natively inside Sublime Text with BYOK
providers, configurable permission rules, snapshot undo/redo, and a one-time
license. If building the harness is part of the fun, Pi may be the better fit;
if you want the agent to just work where you already edit, Limitcode Pro is
built for that.

## At a glance

| Aspect | Limitcode Pro | Pi |
| --- | --- | --- |
| What it is | Ready-to-use agent inside Sublime Text | Minimal, extensible agent harness |
| Philosophy | Packaged experience: install, connect, work | Small core you extend and assemble |
| Interface | Native side-by-side Sublime view | Terminal-first |
| Sublime Text integration | Native, first-class | None official; TermMate can host the CLI |
| Provider model | BYOK, switchable per task | BYOK, configured by you |
| Extensibility | Skills, MCP, subagents, permission rules | Build your own workflow on the core |
| License | One-time purchase, up to 3 devices | Open source, free |

## What is Pi?

A coding-agent harness with a deliberately small core. Rather than shipping
opinions about your workflow, it exposes the pieces - tools, sessions,
extensions - and lets you compose the agent you want, typically from the
terminal. Free and open source; you pay your model provider for usage. The
trade-off is assembly: the workflow you get out is the workflow you build.

## What is Limitcode Pro?

A lightweight coding agent built to run natively inside Sublime Text (builds
4050+) - no separate AI IDE, and no separate agent daemon required for direct
API providers. It inspects project files, applies approved edits, runs
approved commands, searches the web, loads skills, calls MCP servers, and runs
focused subagents under configurable permission rules. Providers: OpenAI,
Anthropic, Gemini, DeepSeek, OpenRouter, Copilot, Codex, Antigravity, or local
models via Ollama and LM Studio.

## Pricing

- Pi: free, open source; provider usage paid directly.
- Limitcode Pro: one-time license on up to 3 devices; provider usage paid
  directly at cost. Free open-source edition covers pair programming.

## Who should use Pi

Power users who enjoy building and maintaining their own agent harness,
with maximum freedom and terminal-first workflows.

## Who should use Limitcode Pro

Developers who want a finished agentic workflow inside Sublime Text -
editor-native tools, BYOK providers, and a one-time license with support.

More: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-pi/
