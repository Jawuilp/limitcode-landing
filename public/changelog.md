# Limitcode Pro — Changelog

## v1.0.0-rc.1 (2026-08-10) — V1 release candidate

The first packaged Limitcode Pro V1 candidate brings the full coding-agent
loop into a side-by-side Sublime Text view.

Added:
- Side-by-side chat with streaming responses, reasoning display, cancellation, and visible tool results
- Code, Architect, Ask, and Debug modes with mode-specific tool access
- Project tools: file listing, reading, searching, creation, targeted edits, patches, web access, shell commands
- Configurable permission rules (reads frictionless; mutating tools ask by default)
- Project-scoped conversation history, prompt history, automatic long-context compaction
- Agent edit snapshots with Undo/Redo during the active session
- Provider, model, reasoning-effort, context, and cost controls in the chat status bar
- Providers: OpenAI, Anthropic, Gemini, OpenRouter, Copilot, DeepSeek, OpenAI-compatible and local paths
- Account sign-in: GitHub Copilot, OpenAI Codex, Google Antigravity
- Web search and URL fetching as permission-gated tools
- LSP diagnostics after edits (syntax and type errors back to the agent)
- Multimodal image attachments
- Reusable skills, MCP connections, checklists, batches, subagents
- Dynamic model discovery with per-provider caches
- Session cost statistics and token tracking

Changed:
- Separate downloads for current and next-generation Sublime plugin hosts

Fixed:
- Improved startup and module loading from the installed package

See https://limitcode.jawuil.dev/changelog/ for the full changelog.
