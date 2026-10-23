# Limitcode — Capacidades completas

> Documento de referencia de **todas** las capacidades del plugin, explicadas en detalle.
> Generado a partir del código fuente (`providers/`, `tools/`, `session/`, `lib/`, `permission/`, etc.).
> Ruta del runtime: `Packages/Limitcode`.

---

## 1. Qué es Limitcode

Limitcode es un **asistente de código agéntico** para Sublime Text. Integra:

- Chat con streaming dentro del editor (sin salir de Sublime).
- Loop agéntico con **tool calling** real (leer, escribir, editar, ejecutar, buscar).
- **Sistema de permisos** allow/deny/ask por herramienta y por archivo.
- **Multi-provider** (más de 40 identificadores registrados).
- Historial persistente de sesiones, costos, compaction de contexto.
- **OAuth** (Copilot, Codex, Google Antigravity), CLI bridges (Claude Code, Codex CLI).
- **Modos** de trabajo, **subagentes**, **Agent Skills**, **MCP** y snapshots de undo/redo.

El plugin se organiza como paquete nativo de Sublime: runtime en la raíz + paquetes Python
(`providers/`, `tools/`, `session/`, `permission/`, `mcp/`, `oauth/`, `skills/`, `subagents/`,
`modes/`, `prompts/`, `instructions/`, `snapshots/`, `lsp/`, `diff/`, `licensing/`) y docs en `docs/`.

---

## 2. Arquitectura general (mapa de módulos)

```
Limitcode/
├── __init__.py                # ciclo de vida del plugin (plugin_loaded/unloaded)
├── plugin.py                  # entry point alternativo + helpers
├── lib/
│   ├── limitcode.py           # factories: get_provider, is_provider_configured
│   ├── agent_runner.py        # ruta ÚNICA de ejecución del agente (chat y send_to_agent)
│   ├── agent.py               # loop agéntico, tool calls, validaciones, retries
│   ├── chat.py                # ChatView + ChatSession (render, persistencia, status)
│   ├── commands.py            # comandos de Sublime (chat, modelo, OAuth, permisos…)
│   ├── commands.py            # incluye selector unificado de modelo/provider
│   ├── history_index.py       # índice rápido para listar historial
│   ├── project_context.py     # resuelve/compara el proyecto de la sesión
│   ├── session_commands.py    # comandos internos de sesión
│   ├── chat_styles.py         # carga de estilos + overrides del usuario
│   ├── logger.py              # logger a archivo (debug)
│   ├── storage.py             # rutas escribibles de datos de usuario
│   └── debug_listener.py      # utilidades de depuración por consola
├── providers/                 # 40+ providers detrás de una interfaz común
│   ├── provider_registry.py   # registro e instanciación por id
│   ├── base.py                # contratos base (StreamResponse, ToolCall, errores)
│   ├── openai_compatible.py   # ~20 providers con /v1/chat/completions
│   ├── openai_responses.py    # OpenAI Responses API
│   ├── anthropic.py           # Anthropic
│   ├── anthropic_oauth.py     # Anthropic OAuth (deprecado)
│   ├── gemini.py              # Google Gemini
│   ├── gemini_tools.py        # helpers de roles de tools para Gemini/Antigravity
│   ├── google_antigravity.py  # Cloud Code Assist (OAuth)
│   ├── azure.py / bedrock.py / cohere.py
│   ├── openrouter.py          # proxy 500+ modelos
│   ├── copilot.py             # GitHub Copilot (OAuth)
│   ├── codex_oauth.py / codex_cli.py
│   └── claude_code_cli.py     # bridge al CLI oficial de Claude Code
├── tools/                     # herramientas del agente
│   ├── manager.py             # dispatch de herramientas
│   ├── tool_schemas.py        # schemas canónicos (OpenAI/Anthropic) + required args
│   ├── read.py / write.py / edit.py / edit_fuzzy.py / diff.py
│   ├── ls.py / search.py / execute.py / background_jobs.py
│   ├── web_search.py / web_fetch.py
│   ├── skill.py / skill_manager.py / mcp.py / batch.py / checklist.py
├── permission/                # engine allow/deny/ask + prompt UI
├── session/                   # historial API, costos, mensajes, compaction, modelos
├── mcp/                       # cliente MCP local (stdio) y remoto (Streamable HTTP)
├── skills/                    # registro de Agent Skills (.agents/skills)
├── subagents/                 # sistema de subagentes (task tool)
├── instructions/              # descubrimiento de AGENTS.md / CLAUDE.md / etc.
├── prompts/                   # composición modular del system prompt
├── modes/                     # Code / Architect / Ask / Debug
├── snapshots/                 # snapshots de archivos para undo/redo
├── lsp/                       # diagnósticos LSP post-edición
├── diff/                      # UI de diff nativo con toolbar
├── planning/                  # Plan Mode (experimental, no conectado a UI)
└── licensing/                 # Limitcode Pro (activación, grants offline)
```

---

## 3. Providers y modelos

### 3.1 Estrategia multi-provider

Un **selector unificado** (`LimitcodeChangeModelCommand`) combina los modelos de **todos** los
providers configurados en una sola lista y guarda `default_provider` + `default_model` **juntos**
para evitar desalineaciones. Orden de resolución de modelos:

1. Caché en memoria (`_CACHED_MODELS`, con TTL).
2. Base de datos en disco (`ModelDatabase`).
3. Fallback de emergencia hardcodeado (`FALLBACK_MODELS`).

### 3.2 Providers OpenAI-compatible

Usan el formato `/chat/completions` con un `base_url` + `path` por proveedor:

| Provider | Endpoint base |
|---|---|
| OpenAI (Responses API aparte) | `api.openai.com` |
| Groq | `api.groq.com/openai/v1` |
| Mistral | `api.mistral.ai/v1` |
| xAI (Grok) | `api.x.ai/v1` |
| DeepSeek | `api.deepseek.com` |
| Cerebras | `api.cerebras.ai/v1` |
| DeepInfra | `api.deepinfra.com/v1/openai` |
| Together AI | `api.together.xyz/v1` |
| Venice AI | `api.venice.ai/api/v1` |
| Cloudflare Workers AI | `api.cloudflare.com/client/v4/accounts/{id}/ai/run/{model}` |
| GitLab | `gitlab.com/api/v4/ai` |
| SAP AI Core | `api.ai.sap.com/v1` |
| Perplexity | `api.perplexity.ai` |
| Vercel AI Gateway | `ai-gateway.vercel.sh/v1` |
| Ollama (local) | `http://localhost:11434/v1` |
| LM Studio (local) | `http://localhost:1234/v1` |
| LiteLLM (local/gateway) | `http://localhost:4000/v1` |
| OpenCode Zen | `opencode.ai/zen/v1` |
| OpenCode Go | `opencode.ai/zen/go/v1` |
| Alibaba DashScope | `dashscope.aliyuncs.com/compatible-mode/v1` |
| Helicone | `oai.hconeai.com/v1` |
| NVIDIA NIM | `integrate.api.nvidia.com/v1` |
| Moonshot / Kimi | `api.moonshot.ai/v1` |
| `openai-compatible` / `custom` | URL definida por el usuario |

### 3.3 Providers con handler propio

- **Anthropic** y **Vertex Anthropic**.
- **Google Gemini** y **Vertex** (native `generateContent`).
- **Azure OpenAI** (endpoint Cognitive Services).
- **Amazon Bedrock** (Converse API).
- **Cohere** (Chat API nativa).
- **OpenRouter** (proxy para 500+ modelos con normalización por modelo).
- **GitHub Copilot** (OAuth nativo).
- **Codex CLI** / **Claude Code CLI** (bridges a CLIs locales, auth por el CLI).
- **Anthropic OAuth** (deprecado; Cloudflare bloquea el intercambio de tokens → usar CLI).
- **Codex OAuth** y **Google Antigravity OAuth**.

### 3.4 Configuración de credenciales

En `Limitcode.sublime-settings`:

```json
{
  "default_provider": "openrouter",
  "default_model": "anthropic/claude-sonnet-4-20250514",
  "api_keys": {
    "openrouter": "sk-...",
    "deepseek": "sk-...",
    "moonshot": "sk-...",
    "openai-compatible": "sk-..."
  },
  "provider_base_urls": {
    "openai-compatible": "https://api.example.com/v1"
  }
}
```

- `Limitcode: Setup Provider API Key` pide la key del provider seleccionado (y la base URL en
  `custom` / `openai-compatible`).
- `is_provider_configured()` decide, sin lanzar excepción, si un provider tiene credenciales.
- OpenCode Go puede heredar la key de OpenCode Zen.
- Providers locales (`ollama`, `lm-studio`, `litellm`) se consideran configurados si son el
  provider por defecto, tienen key o tienen base URL.

### 3.5 Nivel de razonamiento (thinking)

`Limitcode: Set Reasoning Effort` → `off` (defecto), `low`, `medium`, `high` (y valores internos
`none`, `minimal`, `xhigh`). Se mapea al parámetro nativo:

- **Anthropic**: `output_config.effort`.
- **OpenAI**: `reasoning_effort` (o1/o3/o4/gpt-5).
- **Codex**: `reasoning.effort`.
- **Gemini**: `thinkingConfig.thinkingBudget`.
- **DeepSeek**: `thinking` + `reasoning_effort` (`high`/`max`).
- **Moonshot/Kimi**: `thinking` + `temperature`/`top_p` según familia.
- **OpenRouter / OpenCode**: `reasoning.effort` normalizado por modelo.

Los modelos sin soporte ignoran el ajuste sin romper la petición.

---

## 4. Tool calling — herramientas del agente

El agente recibe un catálogo de herramientas (`tools/tool_schemas.py`) y las ejecuta vía
`tools/manager.py`. Cada modo filtra cuáles están disponibles.

| Herramienta | Para qué sirve |
|---|---|
| `read_file` | Leer un archivo (con `start_line`/`end_line` opcionales). |
| `write_to_file` | Crear o sobrescribir un archivo completo. |
| `edit_file` | Reemplazo puntual `old_str` → `new_str` (fuzzy matching, encoding). |
| `apply_diff` | Aplicar un parche unified diff a un archivo. |
| `list_files` | Listar archivos de un directorio. |
| `search_files` | Buscar patrones en archivos por `file_pattern` (grep nativo, ripgrep, Python). |
| `execute_command` | Ejecutar comando de shell (build, tests, git…). Soporta jobs en background. |
| `background_job` | Inspeccionar/detener un job lanzado antes por `execute_command`. |
| `web_search` | Búsqueda web real (Brave / Tavily / DuckDuckGo / Sogou). |
| `web_fetch` | Descargar y parsear URL (HTML→Markdown, con límites anti-SSRF). |
| `skill` | Cargar las instrucciones/recursos completos de un Agent Skill. |
| `skill_manager` | Listar/crear/instalar/buscar skills en `.agents/skills`. |
| `mcp` | Listar tools de servidores MCP o invocar una concreta. |
| `task` | Lanzar un subagente para trabajo enfocado. |
| `batch` | Ejecutar varias tool calls independientes en paralelo. |
| `update_checklist` | Publicar la lista de tareas para el checklist en vivo de la UI. |

### 4.1 Detalles de implementación destacables

- **`edit_file` con fuzzy matching** (`tools/edit_fuzzy.py`): múltiples estrategias de matching
  (exacto, normalizado de escapado, indentación flexible, etc.) para tolerar diferencias de
  formato/encoding.
- **`apply_diff`** (`tools/diff.py`): valida y aplica hunks; si falla sugiere caer a `edit_file`.
- **`search_files`** (`tools/search.py`): detecta el mejor backend disponible (ripgrep, grep de
  Git for Windows, o Python como último recurso), respeta `skip_dirs`/`skip_extensions` y
  `permission.file.deny`.
- **`execute_command`** (`tools/execute.py`): resuelve el shell nativo (`powershell`, `pwsh`,
  `cmd`, `git-bash`, `bash`, `zsh`, `sh`) desde `terminal_shell`; evita abrir ventanas de consola
  en Windows; integra jobs en background.
- **`web_fetch`** (`tools/web_fetch.py`): convierte HTML a Markdown o texto plano y respeta
  límites de seguridad/SSRF.
- **Búsqueda web con múltiples backends** (`tools/web_search.py`): Brave, Tavily, DuckDuckGo y
  Sogou. Configurable con `web_search.provider` (`auto`) y `web_search.max_results`.

### 4.2 Búsqueda nativa del proveedor

Algunos providers exponen búsqueda web nativa que reemplaza a la genérica:

- **Anthropic**: `web_search_20250305` (server-side).
- **Moonshot/Kimi**: schema nativo `$web_search` (el agente lo trata como nativo).
- **Gemini API pública**: `google_search` solo en modo sin function calls.
- **Antigravity**: no inyecta búsqueda nativa (usa la genérica).

---

## 5. Sistema de permisos

`permission/engine.py` + `permission/prompt.py`.

- Semántica **last-match-wins** sobre reglas `{permission, pattern, action}`.
- Acciones: `allow`, `deny`, `ask`.
- Matching flexible: path absoluto, basename y sufijos relativos (ej. `src/**`, `*.py`).
- Permisos **por herramienta** (`tool.read_file`) y **por archivo** (`file`).
- `always allow` tiene alcance de **sesión** (en memoria, no se persiste).
- Prompt unificado `ask_permission(...)` con fallback modal y soporte de cancelación.
- Si el usuario deniega, el agente recibe un error que le indica **no reintentar** ni buscar la
  misma acción por otras herramientas.

Configuración típica:

```json
"permission": {
  "outside_project": "ask",
  "allowed_external_paths": [],
  "tool": {
    "read_file": "allow",
    "list_files": "allow",
    "search_files": "allow",
    "web_search": "ask",
    "web_fetch": "ask",
    "write_to_file": "ask",
    "edit_file": "ask",
    "apply_diff": "ask",
    "skill": "ask",
    "skill_manager": "ask",
    "mcp": "ask",
    "execute_command": "ask",
    "background_job": "allow"
  },
  "file": {
    "allow": ["src/**", "lib/**", "*.py", "*.js", "*.ts", "*.md"],
    "deny": [".env", "**/.env", "**/*.pem", "**/*.key", "**/node_modules/**", "**/.git/**"]
  }
}
```

- `outside_project` controla accesos fuera del workspace (`allow`/`ask`/`deny`).
- `allowed_external_paths` autoriza rutas externas concretas.
- Comandos: `Limitcode: Toggle Permissions`, `Trust Agent (Allow All)`, `Untrust Agent (Ask All)`.

### 5.1 Chequeos de seguridad en ejecución

- `tools/execute.py` aplica validaciones de seguridad sobre comandos.
- `is_secure` en providers detecta `http://` (no HTTPS).
- `_mask_url` elimina query params sensibles de los logs.

---

## 6. Modos de trabajo

`modes/mode.py` define y filtra qué herramientas puede usar el agente:

| Modo | Descripción | Herramientas permitidas |
|---|---|---|
| **code** | Tareas generales de código | read, write, edit, diff, list, search, execute, background, skill, skill_manager, mcp, checklist |
| **architect** | Planificación y diseño técnico | read, write, list, search, skill, skill_manager, mcp (+ archivos de contexto) |
| **ask** | Preguntas y explicaciones | read, list, search, skill, skill_manager, mcp (solo lectura) |
| **debug** | Diagnóstico y corrección | read, write, edit, diff, search, execute, background, skill, skill_manager, mcp |

`Limitcode: Change Mode` (`Ctrl+Alt+Shift+M`) cambia el modo.

---

## 7. Subagentes (`task` tool)

`subagents/manager.py`. Cada subagente es una **sesión hija** con su propio agente y permisos
restringidos. Los subagentes **no** pueden crear otros subagentes.

| Tipo | Rol | Herramientas | Máx. iter. |
|---|---|---|---|
| `explore` | Explorar estructura y hallar info | read, list, search | 10 |
| `general` | Investigación y resumen | read, list, search | 25 |
| `implement` | Tarea de código acotada (crear/editar) | read, list, search, write, edit, diff | 15 |
| `plan` | Crear un plan detallado en Markdown | read, list, search | 15 |
| `test` | Ejecutar tests y reportar | read, execute_command, list | 10 |

Los permisos del subagente derivan del padre (hereda `_always_allowed`) pero acotados a la lista
`allowed_tools`.

---

## 8. Agent Skills

`skills/registry.py`. Skills son **bundles de instrucciones** con recursos opcionales:

```
<skill>/
├── SKILL.md      # instrucciones principales (frontmatter YAML)
├── scripts/      # scripts auxiliares
├── templates/    # plantillas de código
└── references/   # documentación de referencia
```

- Se descubren en: bundled (con el plugin), proyecto (`.agents/skills/<name>/SKILL.md`) y global
  (`~/.agents/skills/<name>/SKILL.md`).
- `.limitcode/skills` sigue cargando como compatibilidad legacy.
- `skill_manager` permite listar, crear, instalar (carpeta local), buscar remotas y devolver la
  ruta de la carpeta de skills.
- La tool `skill` carga las instrucciones completas cuando la tarea coincide.

---

## 9. MCP (Model Context Protocol)

`mcp/`. Soporte MVP:

- **Local por stdio** (`type: "local"`): arranca un proceso y habla JSON-RPC por stdio.
- **Remoto Streamable HTTP** (`type: "remote"`): URL + headers/API key.

```json
"mcp": {
  "local-example": {
    "type": "local",
    "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
    "enabled": true,
    "timeout": 5000,
    "environment": {}
  },
  "stripe": {
    "type": "remote",
    "url": "https://mcp.stripe.com",
    "headers": { "Authorization": "Bearer {env:STRIPE_RESTRICTED_KEY}" },
    "enabled": true,
    "timeout": 10000
  }
}
```

- La tool `mcp` lista tools o invoca una concreta (`list_tools` antes de `call_tool`).
- Expansión de variables de entorno con `{env:VAR}`.
- OAuth queda fuera de alcance por ahora.
- Comando: `Limitcode: Open MCP Settings` (`Ctrl+Alt+Q`).

---

## 10. Sesiones, historial, compaction y costos

### 10.1 Sesiones e historial

- Cada chat guarda mensajes visibles en `history/*.md` (Markdown, ignorado por Git).
- Se conserva `api_messages` para memoria del agente durante la sesión.
- `history_index.py` acelera el listado del historial.
- Comandos: `Chat History`, `New Chat`, `Rename Session`, `Delete Session`, `Clear Chat`.
- Navegación de historial de input con flechas arriba/abajo en el chat.

### 10.2 Modelo de mensajes tipados

`session/message.py` usa **partes tipadas** en lugar de texto plano:

- `TextPart` (texto usuario/asistente), `ReasoningPart` (thinking), `ToolPart` (tool calls con
  estado), `FilePart` (archivos/imágenes/PDF), `StepPart` (límite de iteración con tokens/costo),
  `CompactionPart` (marca de compaction), `ErrorPart` (errores/reintentos).

### 10.3 Compaction de contexto

`session/compaction.py`. Cuando el contexto se acerca al límite del modelo
(`COMPACTION_THRESHOLD = 0.75` del `context_window`), un **agente de compaction dedicado** resume
la conversación preservando detalle técnico crítico, y ese resumen se reinyecta como contexto
principal. La compaction ya está conectada al flujo principal.

### 10.4 Costos

`session/cost_tracker.py` + `session/pricing.py`:

- Rastrea `session_cost`, tokens de entrada/salida, y `last_context_tokens`.
- Precio por modelo vía `get_pricing()` (y `ModelDatabase`).
- Alerta al superar `budget_limit` (por defecto `$10`).
- Comando: `Limitcode: Show Cost Statistics` (`Ctrl+Alt+Shift+C`).

### 10.5 ModelDatabase

`session/model_database.py`. Rastrea dinámicamente **context limits y precios** desde la API de
`models.dev`, con caché local en `Packages/User/Limitcode_models_cache.json` y metadatos
dinámicos de providers (precio, contexto, multimodal, tools, reasoning) en
`Limitcode_dynamic_cache.json`. Incluye alias de provider (ej. `moonshot` → `moonshotai`).

---

## 11. Interfaz de chat (UX)

`lib/chat.py` (`ChatView` + `ChatSession`):

- **Streaming** de texto y de reasoning (thinking) en vivo.
- **Tool cards** que muestran cada tool call y su resultado.
- **Checklist** en vivo alimentado por `update_checklist`.
- **Status bar**: modelo, provider, costo, contexto y modo.
- **Bloques de código** con acciones: copiar bloque, insertar en el editor, crear archivo nuevo.
- Pega **imágenes** (adjuntos multimodales) con `LimitcodePasteCommand`.
- Ajuste de **fuente del chat** independiente (`chat_font_size`, `"auto"` hereda Sublime).
- **Estilos** configurables (`chat_style`: chips, colores, radios, opacidad) vía `chat_styles.py`.
- Cancelación: `Ctrl+Alt+X` (request activo) y `Ctrl+Alt+Shift+X` / `Escape` (detener agente).

---

## 12. Snapshots, undo/redo y diff

### 12.1 Snapshots (`snapshots/manager.py`)

- Capturan el estado de un archivo **antes** de editarlo.
- Habilitan: **undo** de cambios del agente, detección de modificaciones externas y prevención de
  **stale edits** (archivo cambiado entre lectura y edición).
- `FileWatcher` vigila cambios externos.
- Comandos: `Undo Last Agent Edit`, `Redo Last Agent Edit`, `Show Snapshot History`.

### 12.2 Diff nativo (`diff/toolbar.py`)

- Usa `set_reference_document()` de Sublime para el modo diff nativo.
- Toolbar con **Accept / Reject / Next / Prev** para revisar cambios.
- `tools/diff.py` (`ApplyDiffTool`) aplica parches unified diff.

---

## 13. Diagnósticos LSP post-edición

`lsp/diagnostics.py`. Tras una edición del agente:

1. Espera brevemente a que el servidor LSP publique diagnósticos frescos.
2. Recoge los diagnósticos del archivo editado.
3. Si hay errores, se los reporta al modelo para **auto-corrección**.

Es tolerante a fallos: si no hay LSP o no responde, no rompe el flujo.

---

## 14. OAuth y autenticación

`oauth/` + `providers/*_oauth.py`:

- **Flujos simples**: Anthropic OAuth y Codex OAuth usan `_run_simple_oauth_login(...)`.
- **Flujos Google manuales (PKCE)**: Antigravity usa `_start_manual_google_oauth(...)` y
  `_process_manual_google_oauth(...)`:
  1. genera PKCE verifier/challenge,
  2. abre el navegador con la URL de autorización,
  3. el usuario pega la callback URL,
  4. valida `state`, intercambia tokens, descubre proyecto/email,
  5. persiste credenciales y cambia provider/model.
- **CLI bridges**: `claude_code_cli` y `codex_cli` heredan la sesión del CLI local (no requieren
  login dentro de Sublime).
- **Copilot**: OAuth de GitHub, token guardado en `api_keys.copilot`.
- Credenciales OAuth en `oauth_credentials` dentro de settings.
- Comandos: `Login with GitHub Copilot`, `Login with Claude Code`, `Login with Codex`,
  `Login with Google Antigravity`, `Logout OAuth`.
- `oauth/callback_server.py` levanta un servidor HTTP local para capturar el callback.

---

## 15. Instrucciones y system prompt

### 15.1 Descubrimiento de instrucciones

`instructions/discovery.py` camina el árbol de directorios hacia arriba y auto-descubre:
`AGENTS.md`, `CLAUDE.md`, `.limitcode.md`, `.kilocode.md`, `INSTRUCTIONS.md` (configurable en
`instruction_files`). Comando: `Limitcode: Show Instructions`.

### 15.2 Composición del prompt

`prompts/manager.py` compone el system prompt de forma modular (`prompts/base.txt`,
`task_approach.txt`, `tools_policy.txt`, `ui_aesthetics.txt`) + contexto de OS/shell/proyecto +
instrucciones del usuario + archivos descubiertos.

### 15.3 Loop agéntico (`lib/agent.py`)

- **Iteraciones controladas** por `max_iterations` (default en settings: `200`).
- **Recuperación de finales vacíos**: si el modelo devuelve turno vacío tras tool results, se
  reintenta forzando respuesta sin tools.
- **Prevención de bucles**: detecta tool calls duplicadas consecutivas.
- **Thinking hygiene**: aísla `<think>...</think>` en `reasoning_content`.
- **Compatibilidad XML tool calls** para modelos sin tool calling nativo.
- **Serialización provider-aware** (Anthropic/Gemini/OpenAI-like).
- **Validación de argumentos requeridos** antes de ejecutar una tool.
- **Resolución de rutas relativas** y chequeo de permisos antes de ejecutar.

---

## 16. Limitcode Pro (licensing)

`licensing/`:

- `manager.py`: ciclo de vida de licencia contra el servicio de licencias.
- `grant.py`: verifica grants offline **RS256** usando solo la stdlib.
- `storage.py`: almacenamiento local ligado a la máquina (firma de grants offline).
- `client.py` + `config.py`: cliente y configuración del servicio.
- Soporta periodo de gracia offline tras una validación correcta.
- Comandos: `Activate License`, `Show License Status`, `Deactivate This Device`.
- `scripts/build_pro_package.py` construye el artefacto `.sublime-package` de Pro limpio.

---

## 17. Plan Mode (experimental)

`planning/plan_mode.py`. Prototipo **no conectado** a comandos, menús ni UI actual. Flujo previsto:
**Explore → Design → Review → Execute**. Excluido de los paquetes de release hasta integrarse y
probarse como feature pública.

---

## 18. Referencia de atajos de teclado

| Acción | Atajo |
|---|---|
| Abrir chat | `Ctrl+Alt+L` |
| Enviar selección/archivo al agente | `Ctrl+Alt+A` |
| Nuevo chat | `Ctrl+Alt+N` |
| Historial de chats | `Ctrl+Alt+H` |
| Renombrar sesión | `Ctrl+Alt+Y` |
| Borrar sesión | `Ctrl+Alt+D` |
| Cambiar modelo | `Ctrl+Alt+M` |
| Cambiar provider | `Ctrl+Alt+P` |
| Cambiar modo | `Ctrl+Alt+Shift+M` |
| Set reasoning effort | `Ctrl+Alt+R` |
| Toggle show thoughts | `Ctrl+Alt+T` |
| Setup API key | `Ctrl+Alt+K` |
| Abrir settings | `Ctrl+Alt+S` |
| Abrir MCP settings | `Ctrl+Alt+Q` |
| Abrir carpeta de skills | `Ctrl+Alt+G` |
| Toggle permissions | `Ctrl+Alt+O` |
| Trust agent (allow all) | `Ctrl+Alt+Shift+Y` |
| Untrust agent (ask all) | `Ctrl+Alt+Shift+U` |
| Show instructions | `Ctrl+Alt+F` |
| Clear chat | `Ctrl+Alt+C` |
| Cancelar request activo | `Ctrl+Alt+X` |
| Detener agente | `Ctrl+Alt+Shift+X` / `Escape` |
| Copilot OAuth login | `Ctrl+Alt+B` |
| Login Claude OAuth | `Ctrl+Alt+E` |
| Login Codex OAuth | `Ctrl+Alt+Z` |
| Login Google Antigravity | `Ctrl+Alt+Shift+G` |
| Logout OAuth | `Ctrl+Alt+Shift+L` |
| Cost statistics | `Ctrl+Alt+Shift+C` |
| Undo last agent edit | `Ctrl+Alt+U` |
| Redo last agent edit | `Ctrl+Alt+Shift+R` |
| Show snapshots | `Ctrl+Alt+Shift+V` |
| Enviar mensaje desde chat | `Enter` / `Shift+Enter` |
| Historial de input (arriba/abajo) | `↑` / `↓` |

---

## 19. Configuración de referencia

`Limitcode.sublime-settings` (claves principales):

| Clave | Descripción |
|---|---|
| `default_provider` / `default_model` | Provider y modelo activos. |
| `api_key` / `base_url` | Legado (fallback global). |
| `api_keys` | Keys por provider. |
| `provider_base_urls` | Base URLs por provider. |
| `temperature` | Temperatura de generación. |
| `max_tokens` | Cap de salida (entero) o `"auto"` (límite nativo del modelo). |
| `max_iterations` | Máximo de iteraciones del loop agéntico. |
| `reasoning_effort` | `off`/`low`/`medium`/`high`. |
| `chat_font_size` | Tamaño de fuente del chat (`auto` hereda). |
| `chat_bottom_spacer_height` | Espacio inferior del chat. |
| `chat_style` | Chips, colores, radios, opacidad. |
| `show_thoughts` | Mostrar reasoning del modelo. |
| `hide_minimap_in_chat` | Ocultar minimapa en el chat. |
| `debug_console_log` | Espejo de consola a `history/sublime_console.log`. |
| `debug_log` | Log JSON saneado + errores en status bar. |
| `web_search` | `provider`, `brave_api_key`, `tavily_api_key`, `max_results`. |
| `skip_dirs` / `skip_extensions` | Exclusiones de exploración/búsqueda. |
| `permission` | Reglas de permisos (ver §5). |
| `instruction_files` | Archivos de instrucciones a descubrir. |
| `skills` / `mcp` | Skills y servidores MCP. |
| `auto_discover_instructions` | Auto-descubrir instrucciones. |
| `show_cost_estimate` | Mostrar estimación de costo. |
| `streaming` / `timeout` | Streaming y timeout de red. |
| `terminal_shell` | Shell para `execute_command`. |

---

## 20. Logging y troubleshooting

`lib/logger.py` escribe junto al paquete: `Packages/Limitcode/limitcode_debug.log`.

Tags: `[AGENT]`, `[COMMANDS]`, `[PROVIDER]`/`[NOMBRE_PROVIDER]`, `[OAUTH]`.

Errores frecuentes:

- **`HTML received in stream`**: proxy/CDN/auth/quota devolviendo HTML en vez de SSE/JSON. Revisar
  status, `content_type` y `body` logueados por `_raise_for_http_error`.
- **`Stream timeout`**: el provider mantiene el socket abierto sin chunks → usar otro modelo o
  simplificar el prompt.
- **Prompts de permiso repetidos**: ampliar `permission.file.allow` con los patrones reales.
- **Tool call por argumentos faltantes**: se rechaza explícitamente con `get_required_args_for_tool`.

---

## 21. Validación local

```bash
python -B -m unittest discover -s tests
python -B -m compileall -q .
```

Si los tests pasan y `compileall` no imprime nada, la validación pasó.

---

## 22. Resumen de capacidades por área

| Área | Capacidad |
|---|---|
| **Chat** | Streaming texto + thinking, tool cards, checklist, bloques de código, imágenes. |
| **Providers** | 40+ registrados; OpenAI-compatible, Anthropic, Gemini, Azure, Bedrock, Cohere, OpenRouter, Copilot, CLI bridges, OAuth. |
| **Agente** | Loop con tool calling, validación, retries, anti-bucles, XML fallback, provider-aware. |
| **Herramientas** | 17 tools: read/write/edit/diff/ls/search/execute/background/web/skill/mcp/task/batch/checklist. |
| **Permisos** | allow/deny/ask por tool y archivo, wildcard, last-match-wins, always-allow por sesión. |
| **Modos** | code / architect / ask / debug con filtrado de tools. |
| **Subagentes** | explore / general / implement / plan / test con permisos restringidos. |
| **Skills** | Bundles `.agents/skills` (proyecto/global) + skill_manager. |
| **MCP** | Servidores locales stdio y remotos Streamable HTTP. |
| **Sesiones** | Historial Markdown, mensajes tipados, compaction al 75%, costos y precios. |
| **Seguridad** | Snapshots stale-edit, diff con toolbar, diagnósticos LSP post-edición. |
| **Auth** | OAuth simple, Google PKCE manual, CLI bridges, Copilot. |
| **Prompt** | Instrucciones auto-descubiertas + composición modular. |
| **Pro** | Licencia con grants offline RS256 y build dedicado. |
