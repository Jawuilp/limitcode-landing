# What is Limitcode?

Limitcode is a lightweight AI coding agent that runs inside Sublime Text
(builds 4050+). It is built for developers who want an agentic workflow
without moving to a heavy AI IDE or adopting a terminal-first workflow. It
works in a side-by-side chat view and can inspect project files, apply
approved edits, run approved commands, search the web, load skills, call MCP
servers, and run focused subagents under configurable permission rules.

It comes in two editions:

## Open source edition (Limitcode)
- AI **pair programming** assistant: three tools (`read_file`, `write_to_file`,
  `edit_file`) that only operate on files open in the editor. No shell access,
  no filesystem roaming, no autopilot.
- Free, GNU GPL v3, on GitHub: https://github.com/Jawuilp/Limitcode

## Limitcode Pro
- Fully **autonomous** agent: project-wide search, targeted edits, approved
  shell commands, web search, skills, MCP servers, subagents, account sign-in
  (GitHub Copilot, OpenAI Codex, Google Antigravity), automatic context
  compaction, snapshot undo/redo.
- One-time purchase, up to 3 devices: https://limitcode.jawuil.dev/

## Why it exists
Sublime Text was never built to host a coding agent. Limitcode exists to push
Sublime Text to its limit - a full agentic workflow natively inside the
editor, not beside it.

## Who it is for (and who it is not)
Limitcode is for Sublime Text users who want the agent to live where they
already work, bring their own keys or accounts, and keep permission rules
under their control. It is not trying to replace terminal-first workflows:
terminal agents such as Claude Code, Codex, Pi, and OpenCode are excellent
for developers who work in the shell, and Limitcode is not a full AI IDE
that replaces your editor.

## Quick facts
- Runs inside Sublime Text; no separate agent daemon required for direct API providers
- Providers: OpenAI, Anthropic, Gemini, OpenRouter, DeepSeek, Copilot,
  Ollama, LM Studio, and OpenAI-compatible endpoints
- Every mutating action follows configurable permission rules
- Web: https://limitcode.jawuil.dev/
- Support: hola@jawuil.dev
