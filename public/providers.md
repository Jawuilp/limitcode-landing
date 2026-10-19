# Providers — Limitcode Pro

Limitcode connects to 40+ AI providers in four ways: direct API keys, account sign-in (OAuth), local CLI sessions, and local runtimes. Direct API providers need no separate agent daemon — the plugin connects directly from inside Sublime Text with your own key.

## Direct API Keys (`api_keys`)
Configure via `Limitcode: Setup Provider API Key` (`Ctrl+Alt+K`) or under `"api_keys"` in `Limitcode.sublime-settings`:
- **OpenRouter** (`openrouter`) — 500+ models across all major labs with a single key
- **Anthropic** (`anthropic`) — Claude Sonnet 5, Claude Opus 5.5, Claude Fable 5.1
- **OpenAI** (`openai`) — GPT-6, GPT-6 Astra, GPT-6 Sol, and reasoning series
- **Google Gemini** (`gemini`) — Gemini 4 Argon, Gemini 3.7 Flash
- **DeepSeek** (`deepseek`) — DeepSeek V4 and reasoning series (`api.deepseek.com`)
- **xAI / Grok** (`xai`) — Grok 4.20 and coding models (`api.x.ai/v1`)
- **Mistral AI** (`mistral`) — Mistral Large, Codestral, Devstral (`api.mistral.ai/v1`)
- **Groq** (`groq`) — Ultra-fast LPU inference (`api.groq.com/openai/v1`)
- **Cerebras** (`cerebras`) — High-speed wafer-scale inference (`api.cerebras.ai/v1`)
- **Together AI** (`together`) — Open-weight coding and chat models (`api.together.xyz/v1`)
- **DeepInfra** (`deepinfra`) — Serverless open-model inference (`api.deepinfra.com/v1/openai`)
- **Moonshot AI / Kimi** (`moonshot`) — Kimi K2.5 (`api.moonshot.ai/v1`)
- **Alibaba DashScope / Qwen** (`alibaba`) — Qwen3 Coder and Qwen series (`dashscope.aliyuncs.com/compatible-mode/v1`)
- **Xiaomi MiMo** (`xiaomi`) — Xiaomi MiMo reasoning and coding models
- **NVIDIA NIM** (`nvidia`) — NVIDIA-hosted inference (`integrate.api.nvidia.com/v1`)
- **Perplexity** (`perplexity`) — Sonar online and reasoning models (`api.perplexity.ai`)
- **Venice AI** (`venice`) — Privacy-focused model inference (`api.venice.ai/api/v1`)
- **Cohere** (`cohere`) — Command R+ and enterprise Cohere models
- **OpenCode Zen & OpenCode Go** (`opencode-zen`, `opencode-go`) — `opencode.ai/zen/v1` and `opencode.ai/zen/go/v1`

## Enterprise Cloud, Gateways & Custom Endpoints
- **Amazon Bedrock** (`bedrock`) — AWS Bedrock Converse API
- **Azure OpenAI** (`azure`) — Microsoft Azure Cognitive Services
- **Google Cloud Vertex AI** (`vertex`, `vertex_anthropic`) — Vertex AI Gemini and Claude endpoints
- **Cloudflare Workers AI** (`cloudflare`) — `api.cloudflare.com`
- **Vercel AI Gateway** (`vercel`) — `ai-gateway.vercel.sh/v1`
- **Helicone** (`helicone`) — `oai.hconeai.com/v1`
- **GitLab AI** (`gitlab`) — `gitlab.com/api/v4/ai`
- **SAP AI Core** (`sap`) — `api.ai.sap.com/v1`
- **Custom OpenAI-Compatible** (`openai-compatible`, `custom`) — Custom URL in `provider_base_urls` + key in `api_keys`

## Account Sign-In (OAuth)
- **GitHub Copilot** (`copilot`) — Sign in with GitHub via `Limitcode: Login with GitHub Copilot` (`Ctrl+Alt+B`)
- **OpenAI Codex OAuth** (`codex-oauth`) — OpenAI browser login via `Limitcode: Login with Codex` (`Ctrl+Alt+Z`)
- **Google Antigravity OAuth** (`google-antigravity`) — Google OAuth via `Limitcode: Login with Google Antigravity` (`Ctrl+Alt+Shift+G`; unofficial experimental integration with elevated account risk — prefer a secondary Google account)

## CLI Sessions
- **Claude Code CLI** (`claude_code_cli`) — Reuses an existing local `claude login` session (`Ctrl+Alt+E`)
- **Codex CLI** (`codex_cli`) — Reuses an existing local `codex login` session

## Local Runtimes
- **Ollama** (`ollama`) — Default `http://localhost:11434/v1`
- **LM Studio** (`lm-studio`) — Default `http://localhost:1234/v1`
- **LiteLLM** (`litellm`) — Default `http://localhost:4000/v1`

Note: account-based integrations depend on provider-controlled behavior and can change independently of Limitcode. See https://limitcode.jawuil.dev/providers/
