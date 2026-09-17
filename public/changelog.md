# Limitcode Pro — Changelog

## v1.1.7 (2026-09-17) — Chat style customization

The chat status bar can now follow your Sublime Text theme without changing
the rest of the editor.

Added:
- New `chat_style` settings for chip background, border, text, link color, muted text, opacity, radius and padding
- Advanced per-user override through `Packages/User/Limitcode/chat.css`
- Automated coverage for chat style loading, fallbacks and invalid values

Fixed:
- Chip rows no longer overlap when the chat panel is narrow
- Improved legibility of chips, links and muted text on dark themes such as Monokai Pro

## v1.1.6 (2026-09-15) — Menu integration fix

Fixed the ordering of Limitcode entries in the Sublime Text main menu.

Fixed:
- Limitcode menu entries are now ordered consistently under Tools

## v1.1.5 (2026-09-14) — Chat typography controls

The chat can now use its own font size without changing the editor or other
Sublime views.

Added:
- Configurable `chat_font_size` setting with automatic inheritance or a fixed numeric size
- Increase, decrease, and reset chat font size commands in the Command Palette
- Optional chat-only keybindings with no default Ctrl+Plus or Ctrl+Minus shortcuts
- Automated coverage for chat font size behavior

## v1.1.4 (2026-09-13) — Native OpenAI Responses transport

OpenAI now has a native Responses API path while the existing provider
compatibility paths remain available for other services.

Added:
- Native OpenAI Responses provider with streaming and tool-call support
- Improved OpenAI tool and reasoning support through the Responses API
- Dedicated automated coverage for the OpenAI Responses transport

## v1.1.3 (2026-09-13) — GPT-5.6 tool-call compatibility

Improved compatibility and reliability when using GPT-5.6 models with tools.

Added:
- Additional coverage for GPT-5.6 tool use

Fixed:
- GPT-5.6 tool calls now complete reliably with supported reasoning settings

## v1.1.2 (2026-09-09) — More reliable tool history

The agent now preserves the actions it completed so follow-up turns retain a
clearer picture of what happened.

Fixed:
- Preserved completed tool actions across chat turns
- Improved continuity when the model needs to remember earlier tool work

## v1.1.1 (2026-09-03) — Updated Antigravity model discovery

Google Antigravity now uses the verified Gemini Flash identifiers returned by
its discovery catalog.

Added:
- Real Gemini 3.8 and 3.7 Flash model identifiers from Antigravity discovery

Fixed:
- Improved model listing and selection for the Antigravity provider

## v1.1.0 (2026-09-01) — Reasoning, cards, and packaging polish

A broader release focused on richer agent feedback, cross-platform chat
behavior, and a cleaner Package Control layout.

Added:
- Streaming reasoning display and richer tool, subagent, and batch cards
- Clipboard image support across macOS and Linux

Changed:
- Shared runtime modules moved into `lib/` to improve Package Control packaging

Fixed:
- Improved plugin loading and command registration after the package restructure

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
