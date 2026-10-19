# Limitcode Pro — User Guide & Quick Reference

Limitcode is a lightweight AI coding agent built natively for Sublime Text 4 (builds 4050+).

## Installation & Activation
1. In Sublime Text, open `Preferences → Browse Packages...`, go one folder up into `Installed Packages`, and drop `Limitcode.sublime-package` inside.
2. Restart Sublime Text.
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run `Limitcode Pro: Activate License`.
4. Connect a provider via `Limitcode: Setup Provider API Key` (`Ctrl+Alt+K`), account sign-in (`GitHub Copilot`, `Codex`, `Google Antigravity`), CLI login (`Claude Code`, `Codex CLI`), or local models (`Ollama`, `LM Studio`, `LiteLLM`).
5. Open the chat panel with `Ctrl+Alt+L`.

## Supported AI Providers (40+)
- **Direct API Keys (`api_keys`)**: OpenRouter (`openrouter`), Anthropic (`anthropic`), OpenAI (`openai`), Google Gemini (`gemini`), DeepSeek (`deepseek`), xAI / Grok (`xai`), Mistral AI (`mistral`), Groq (`groq`), Cerebras (`cerebras`), Together AI (`together`), DeepInfra (`deepinfra`), Moonshot AI / Kimi (`moonshot`), Alibaba DashScope / Qwen (`alibaba`), Xiaomi MiMo (`xiaomi`), NVIDIA NIM (`nvidia`), Perplexity (`perplexity`), Venice AI (`venice`), Cohere (`cohere`), OpenCode Zen (`opencode-zen`), OpenCode Go (`opencode-go`).
- **Enterprise Cloud & Gateways**: Amazon Bedrock (`bedrock`), Azure OpenAI (`azure`), Google Cloud Vertex AI (`vertex`, `vertex_anthropic`), Cloudflare Workers AI (`cloudflare`), Vercel AI Gateway (`vercel`), Helicone (`helicone`), GitLab AI (`gitlab`), SAP AI Core (`sap`), and Custom OpenAI-Compatible endpoints (`openai-compatible`, `custom` via `provider_base_urls`).
- **Account Sign-In (OAuth)**: GitHub Copilot (`copilot`, `Ctrl+Alt+B`), OpenAI Codex OAuth (`codex-oauth`, `Ctrl+Alt+Z`), Google Antigravity OAuth (`google-antigravity`, `Ctrl+Alt+Shift+G`).
- **Local CLI Sessions**: Claude Code CLI (`claude_code_cli`, `Ctrl+Alt+E`), Codex CLI (`codex_cli`).
- **Local & Self-Hosted Runtimes**: Ollama (`ollama`, `http://localhost:11434/v1`), LM Studio (`lm-studio`, `http://localhost:1234/v1`), LiteLLM (`litellm`, `http://localhost:4000/v1`).

## How to Use It Every Day
- **Mention files**: Type `@` in the chat input to attach project paths.
- **Send code selection or active file**: Highlight code and press `Ctrl+Alt+A` (`Limitcode: Send to Agent`).
- **Paste screenshots**: Press `Ctrl+V` / `Cmd+V` in the chat to analyze UI bugs, errors, or diagrams.
- **Web Search (Zero-Config & Pro APIs)**: Out of the box, Limitcode searches the web using DuckDuckGo and Sogou with zero setup. For richer technical results, configure `"web_search"` in `Limitcode.sublime-settings` with a `brave_api_key` or `tavily_api_key`.
- **Switch work modes (`Ctrl+Alt+Shift+M`)**:
  - `Code`: Full implementation (read, create/edit/patch files, run commands, update checklists).
  - `Ask`: Read-only exploration and code explanations.
  - `Architect`: Technical planning and design docs without running shell commands.
  - `Debug`: Diagnosing issues, running tests/commands, and applying targeted fixes.
- **Review & Undo safely**: Review proposed changes in Sublime's native diff view (`Accept` / `Reject`), and revert any agent edit in one shortcut with `Ctrl+Alt+U` (`Redo` with `Ctrl+Alt+Shift+R`, full history with `Ctrl+Alt+Shift+V`).
- **Extend with Project Rules, Skills & MCP**:
  - Add an `AGENTS.md` file in your repo root for project-specific rules (`Ctrl+Alt+F` to inspect loaded instructions).
  - Add reusable Agent Skills in `.agents/skills/<name>/SKILL.md` (`Ctrl+Alt+G` to open the skills folder).
  - Connect local or remote MCP servers via `Limitcode: Open MCP Settings` (`Ctrl+Alt+Q`).

## Essential Keyboard Shortcuts
- `Ctrl+Alt+L` — Open chat
- `Ctrl+Alt+A` — Send selection or active file to agent
- `Ctrl+Alt+N` / `Ctrl+Alt+H` — New chat / Chat history
- `Ctrl+Alt+M` / `Ctrl+Alt+P` — Change model / Change provider
- `Ctrl+Alt+Shift+M` — Change mode (`Code`, `Ask`, `Architect`, `Debug`)
- `Ctrl+Alt+R` — Set reasoning effort (`off`, `low`, `medium`, `high`)
- `Ctrl+Alt+U` / `Ctrl+Alt+Shift+R` — Undo / Redo last agent edit
- `Ctrl+Alt+X` / `Escape` — Cancel active response / Stop agent
- `Ctrl+Alt+Shift+C` — Show session token usage and cost statistics

## Links
- https://limitcode.jawuil.dev/ — Home
- https://limitcode.jawuil.dev/docs/ — Full User Guide & Documentation
- https://limitcode.jawuil.dev/providers/ — Supported AI Providers Guide
- https://limitcode.jawuil.dev/changelog/ — Release Notes
