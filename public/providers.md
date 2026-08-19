# Providers — Limitcode

Limitcode connects to AI providers in four ways: API keys, account sign-in,
CLI sessions, and local runtimes.

## Direct API keys
- OpenAI
- Anthropic
- Google Gemini
- OpenRouter (all models enabled for your account)
- DeepSeek
- Other OpenAI-compatible APIs (Groq, Mistral, xAI, Together, custom gateways)

## Account sign-in (OAuth)
- GitHub Copilot — sign in with GitHub; requires an eligible Copilot subscription
- OpenAI Codex — OpenAI browser login with a local callback
- Google Antigravity — Google OAuth; unofficial integration with elevated account risk (prefer a secondary Google account)

## CLI sessions
- Claude Code CLI (existing `claude login` session)
- Codex CLI (existing `codex login` session)

## Local runtimes
- Ollama
- LM Studio
- LiteLLM
- Custom OpenAI-compatible endpoint

Note: account-based integrations depend on provider-controlled behavior and
can change independently of Limitcode. See https://limitcode.jawuil.dev/providers/
