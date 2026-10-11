export interface Post {
  /** Route without trailing slash, e.g. "/blog/limitcode-pro-vs-cursor" */
  url: string;
  /** ISO date used for RSS pubDate and schema dates */
  date: string;
  /** Human label shown on cards, e.g. "Aug 2026" */
  dateLabel: string;
  tag: string;
  title: string;
  description: string;
  cta: string;
  /** Plain-text body used as RSS <description> */
  contentEncoded: string;
}

export const SITE_URL = "https://limitcode.jawuil.dev";

export const RSS_TITLE = "Limitcode Pro Blog";

export const RSS_DESCRIPTION =
  "Comparisons and guides about coding agents for Sublime Text: Limitcode Pro vs Claude Code, Cursor, Copilot, TermMate, and more.";

export const posts: Post[] = [
  {
    url: "/blog/limitcode-pro-vs-claude-code",
    date: "2026-08-27",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs Claude Code",
    description:
      "Claude Code is a terminal-first agent with no official Sublime Text plugin; Limitcode Pro is built for Sublime Text. Models, pricing, and workflow compared.",
    cta: "Read the comparison",
    contentEncoded:
      "Claude Code is one of the best terminal agents ever shipped — if your workflow lives in the terminal. Limitcode Pro is a lightweight agent that runs natively inside Sublime Text, connects to any provider with your own keys (Claude included), and costs a one-time license. We compare Sublime integration, models, provider choice, setup, and pricing ($20–$200/mo subscriptions vs a one-time license), and give an honest verdict on which tool fits which developer.",
  },
  {
    url: "/blog/limitcode-pro-vs-opencode",
    date: "2026-08-27",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs OpenCode",
    description:
      "Both are BYOK agents — but OpenCode lives in the terminal and Limitcode Pro lives inside Sublime Text. Integration, permissions, and pricing compared.",
    cta: "Read the comparison",
    contentEncoded:
      "OpenCode is a free, open-source terminal TUI agent; Limitcode Pro shares the BYOK philosophy but runs natively inside Sublime Text. Both connect to many providers and local models. The difference is where the agent lives: terminal-driven workflow vs editor-native tools like Send to Agent, permission prompts, snapshot undo/redo, and LSP diagnostics. Free and open source vs one-time license — which fits your workflow?",
  },
  {
    url: "/blog/limitcode-pro-vs-pi",
    date: "2026-08-27",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs Pi",
    description:
      "Pi is a minimal harness you assemble yourself; Limitcode Pro is a ready-to-use agent inside Sublime Text. Extensibility, integration, and pricing compared.",
    cta: "Read the comparison",
    contentEncoded:
      "Pi is a minimal, highly extensible coding-agent harness for power users who enjoy building their own workflow from a small core. Limitcode Pro takes the opposite trade: a packaged, ready-to-use agent that runs natively inside Sublime Text with BYOK providers, permission rules, snapshot undo/redo, and a one-time license. Build the harness vs install the agent — an honest look at extensibility, integration, and pricing.",
  },
  {
    url: "/blog/limitcode-pro-vs-cursor",
    date: "2026-08-27",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs Cursor",
    description:
      "Cursor is an AI-first editor you migrate to; Limitcode Pro is an agent inside the Sublime Text you already use. Editor choice, providers, and pricing compared.",
    cta: "Read the comparison",
    contentEncoded:
      "Cursor is an AI-first VS Code fork with Tab completions, agent mode, and background agents — but adopting it means leaving Sublime Text. Limitcode Pro is the other path: a lightweight agent that runs natively inside Sublime, brings your own keys and providers (including local models), and costs a one-time license. We compare editor choice, models, permissions, and pricing ($20–$200/mo plans vs a one-time license).",
  },
  {
    url: "/blog/limitcode-pro-vs-copilot",
    date: "2026-08-26",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs GitHub Copilot",
    description:
      "GitHub Copilot has no Sublime Text plugin and its agent mode excludes Sublime. Limitcode Pro is built for Sublime Text. Models, billing, and workflow compared.",
    cta: "Read the comparison",
    contentEncoded:
      "GitHub Copilot is the most widely used AI coding assistant — and it does not support Sublime Text; its agent mode is confined to VS Code, Visual Studio, JetBrains, Eclipse, and Xcode. Limitcode Pro is an agent that lives inside Sublime Text, edits files, runs approved commands, and can even use Copilot as its provider. We compare models, agent mode, billing ($10–$100/user/mo plus AI Credits vs a one-time license), and workflow.",
  },
  {
    url: "/blog/limitcode-pro-vs-tabnine",
    date: "2026-08-26",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs Tabnine",
    description:
      "Tabnine is an enterprise AI coding platform for teams; Limitcode Pro is a native Sublime Text agent. Editor support, deployment, governance, and pricing compared.",
    cta: "Read the comparison",
    contentEncoded:
      "Tabnine is an enterprise platform a company deploys per seat — SaaS, VPC, on-premises, or air-gapped, with SSO, analytics, and IP indemnification — but its modern supported IDEs exclude Sublime Text. Limitcode Pro is a single agent a developer installs to make Sublime Text agentic. We compare editor support, deployment, governance, and pricing ($39–$59 per user/month vs a one-time license).",
  },
  {
    url: "/blog/limitcode-pro-vs-termmate",
    date: "2026-08-23",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs TermMate",
    description:
      "Both bring AI agents to Sublime Text — but one hosts external CLIs and the other is the agent. Architecture, providers, permissions, and pricing compared.",
    cta: "Read the comparison",
    contentEncoded:
      "TermMate is a free host that docks external coding-agent CLIs (Claude Code, Codex, OpenCode, Pi) inside Sublime Text or VS Code. Limitcode Pro is a self-contained agent that lives in Sublime Text itself, connects straight to your provider of choice (including local models), and applies one consistent permission model to everything it does. Architecture, providers, permissions, and pricing compared.",
  },
  {
    url: "/blog/limitcode-pro-vs-pieces",
    date: "2026-08-23",
    dateLabel: "Aug 2026",
    tag: "Comparison",
    title: "Limitcode Pro vs Pieces",
    description:
      "Pieces remembers everything you do across your apps; Limitcode Pro acts on your code inside Sublime Text. Memory layer or coding agent — which do you need?",
    cta: "Read the comparison",
    contentEncoded:
      "Pieces is a passive memory layer that captures your screens and clipboard every couple of seconds, then lets you search and summarize what happened. Limitcode Pro is an active agent: give it a task and it searches your project, proposes edits, and runs approved commands inside Sublime Text. We compare architecture, privacy, and pricing ($18.99/mo subscription vs a one-time license).",
  },
];