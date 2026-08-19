# Limitcode — Quick Reference

Limitcode is a coding agent for Sublime Text (builds 4050+). Two editions:
open source (pair programming, open files only) and Limitcode Pro (autonomous).

## Install
1. Place the package in Sublime Text's `Packages/` directory (or `Installed Packages`).
2. Restart Sublime Text.
3. `Limitcode: Setup Provider API Key` from the Command Palette.
4. Open chat with `Ctrl+Alt+L`.

## Key shortcuts
- `Ctrl+Alt+L` open chat
- `Ctrl+Alt+A` send selection/file to agent
- `Ctrl+Alt+M` change model
- `Ctrl+Alt+P` change provider
- `Ctrl+Alt+X` cancel active response
- `Enter` send message (in chat view)
- `Escape` stop agent (chat focused)

## Key settings (`Limitcode.sublime-settings`)
- `default_provider`, `default_model`, `api_keys`
- `temperature` ("auto" or number), `max_tokens`, `max_iterations`
- `reasoning_effort` (off/low/medium/high), `show_thoughts`
- `permission` rules per tool (allow/ask) and file globs (allow/deny)

## Capabilities
- Streaming side-by-side chat with visible tool results
- File inspection, targeted edits, patches, approved command execution
- Web search and URL fetching (permission-gated)
- Skills (on-demand specialized instructions) and MCP servers
- Subagents, batches, checklists
- Automatic context compaction, snapshot undo/redo, session history per project
- Cost statistics and token tracking

## Where things live
- https://limitcode.jawuil.dev/ — home
- https://limitcode.jawuil.dev/docs/ — full documentation
- https://limitcode.jawuil.dev/providers/ — provider guide
- https://limitcode.jawuil.dev/changelog/ — release notes
- https://github.com/Jawuilp/Limitcode — open source edition
