# Limitcode Pro vs OpenCode

Comparison of two BYOK coding agents: one editor-native, one terminal-first.
Canonical page: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-opencode/

## Short answer

Both agents share the same philosophy: bring your own keys and choose your
providers, including local models. The difference is where the agent lives.
OpenCode is a free, open-source coding agent that runs in the terminal as a
TUI, with a client/server architecture, LSP integration, and MCP support -
a strong pick for terminal-first developers. Limitcode Pro runs natively
inside Sublime Text with editor-native tools: Send to Agent for the selection
or active file, permission prompts in the editor, snapshot undo/redo for agent
edits, and LSP diagnostics fed back to the agent. There is no official Sublime
Text plugin for OpenCode; hosts like TermMate can dock the CLI, but the agent
doing the work is still the CLI.

## At a glance

| Aspect | Limitcode Pro | OpenCode |
| --- | --- | --- |
| What it is | Coding agent inside Sublime Text | Free, open-source terminal agent |
| Interface | Native side-by-side Sublime view | Terminal TUI |
| Sublime Text integration | Native, first-class | None official; TermMate can host the CLI |
| Provider model | BYOK, many providers + local | BYOK, many providers + local |
| Editor-native tools | Send to Agent, undo/redo, LSP feedback | Terminal-driven workflow |
| License | One-time purchase, up to 3 devices | Open source, free |

## What is OpenCode?

An open-source AI coding agent built for the terminal. It presents a TUI,
connects to many model providers with your own keys (including local
endpoints), supports LSP integration, MCP servers, and extensibility, and
follows a client/server architecture. It is free software; you pay your model
provider directly for usage.

## What is Limitcode Pro?

A lightweight coding agent built to run natively inside Sublime Text (builds
4050+) - no separate AI IDE, and no separate agent daemon required for direct
API providers. It inspects project files, applies approved edits, runs
approved commands, searches the web, loads skills, calls MCP servers, and runs
focused subagents under configurable permission rules. Providers: OpenAI,
Anthropic, Gemini, DeepSeek, OpenRouter, Copilot, Codex, Antigravity, or local
models via Ollama and LM Studio.

## Pricing

- OpenCode: free, open source; provider usage paid directly.
- Limitcode Pro: one-time license on up to 3 devices; provider usage paid
  directly at cost. Free open-source edition covers pair programming.

## Who should use OpenCode

Terminal-first developers who want a free, open-source TUI agent they can
configure and extend themselves.

## Who should use Limitcode Pro

Developers who want the agent inside Sublime Text - editor-native context,
permission prompts, snapshot undo/redo, and a packaged experience with a
one-time license.

More: https://limitcode.jawuil.dev/blog/limitcode-pro-vs-opencode/
