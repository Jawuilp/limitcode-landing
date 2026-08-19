# Limitcode Pro Landing Brief

## Goal

Turn a Sublime Text user who lands on the page into one of two actions:

1. Buy Limitcode Pro through Gumroad.
2. Watch a short demo, then decide whether it fits their workflow.

The page should sell a native coding-agent workflow, not promise unbreakable protection or generic "AI productivity".

## Audience

Developers who already use Sublime Text and want agentic help without moving their work to another editor or managing a separate coding-agent CLI.

They care about speed, keyboard-driven workflows, project context, predictable tooling, and keeping control of their own provider credentials.

## Positioning

Primary message:

> A coding agent that lives inside Sublime Text.

Supporting line:

> Plan, inspect, edit, and run work from the editor you already use, with your own AI provider.

Do not claim that Limitcode is the only AI tool for Sublime Text. Make the specific distinction clear instead: it is a native agent workflow, rather than only a simple chat window or a thin launcher for an external CLI.

## Visual Direction

Use a **developer field manual** aesthetic: warm paper for reading, deep editor panels for proof, compact monospace annotations, and one confident orange purchase accent. It should feel like a tool made by someone who uses Sublime every day, not a generic AI startup.

Avoid a purple gradient, floating glass cards, stock developer photos, fake company logos, and AI-generated illustrations.

### Palette

| Role | Color | Use |
| --- | --- | --- |
| Paper | `#F3EFE5` | Main page background |
| Ink | `#17212B` | Body copy and navigation |
| Editor | `#202B36` | Demo frame and dark sections |
| Editor line | `#344556` | Borders inside the demo frame |
| Signal orange | `#E86132` | Primary CTA and critical highlights |
| Sublime blue | `#4E89D6` | Links, active states, code markers |
| Sage | `#7DAA8B` | Small success/status details |
| Muted | `#69747C` | Secondary copy |

Keep orange scarce. It should mean "buy", "start", or "important", never decorate every section.

### Typography

- Display and headings: `DM Sans` or `Manrope`, semibold, with tight but not compressed tracking.
- Interface labels, commands, prices, and annotations: `IBM Plex Mono` or `JetBrains Mono`.
- Body copy: use the display family; keep paragraphs short.

Do not use Inter, Arial, or a system font stack as the main identity. Use monospace only for interface-like information, not every paragraph.

### Layout

- Maximum content width: 1180px.
- Desktop grid: 12 columns.
- Large breathing room between sections, but dense information inside the product demo.
- The hero should be asymmetrical: text on the left, a real Limitcode screenshot occupying more space on the right.
- On mobile, stack copy before the screenshot and keep the primary CTA visible without excessive scrolling.

## Page Structure

### 1. Minimal Navigation

Left: Limitcode Pro wordmark.

Right: `Features`, `How it works`, `FAQ`, and a compact `Buy Pro` button.

Do not add a large marketing navigation, blog menu, or fake enterprise links.

### 2. Hero

Eyebrow:

`FOR SUBLIME TEXT 4`

Headline:

`Your coding agent, inside Sublime Text.`

Supporting copy:

`Give Limitcode a task. It can inspect your project, work with files and tools, and keep the conversation where you write code.`

Primary CTA:

`Buy Limitcode Pro` -> Gumroad product URL

Secondary CTA:

`Watch the 90-second demo` -> video/modal or an anchored demo section

Hero proof:

- Use a real, high-resolution screenshot of Limitcode answering a real request.
- Show the provider, project context, tool activity, and a useful response if they are legible.
- Place small monospace annotations around the screenshot: `Project context`, `Tool permissions`, `Your provider`, `Native panel`.

### 3. Proof Strip

Directly under the hero, use a single compact horizontal strip:

`Native Sublime workflow` / `Bring your own provider` / `Project-aware tools` / `Your files stay in your editor`

Only include claims that are true for the release build. Do not invent security or privacy claims.

### 4. What Makes It an Agent

Use a dark editor-colored section, not a grid of generic feature cards.

Present the workflow as four numbered actions:

1. `Ask` - Describe the task in natural language.
2. `Inspect` - Reference files and project context.
3. `Act` - Let the agent use available tools with your configured permissions.
4. `Review` - Keep control of the changes and continue in the same Sublime window.

Use a real sequence from the product, with a screenshot or short GIF beside it.

### 5. Providers and Control

Headline:

`Use the provider that fits your work.`

Show only providers confirmed in the current product: OpenAI, Anthropic, Gemini, Copilot, and OpenRouter.

Explain plainly that the user brings their own provider credentials and pays their provider directly. Do not over-explain architecture.

### 6. Installation

Keep this to three steps:

1. Buy Limitcode Pro through Gumroad.
2. Install the `.sublime-package` in Sublime Text.
3. Add a provider key and start a task.

Include a link to detailed installation documentation. Do not put the full manual on the landing page.

### 7. Pricing and CTA

Use one clear price and one product tier for launch. Avoid a pricing table unless there are genuinely different plans.

Suggested structure:

`Limitcode Pro`

`One license. Up to 3 of your devices.`

`[Price]` one-time purchase

`Buy Limitcode Pro` -> Gumroad product URL

Under the CTA, add a quiet line such as: `License validation supports offline work after activation.` Do not describe it as copy protection.

### 8. FAQ

Keep it specific and short:

- Does it work with my Sublime Text version?
- Which AI providers can I use?
- Do I need my own API key?
- How many devices can I activate?
- What does the license include?
- Where can I get help?

Answer only with verified release behavior. Link to `hola@jawuil.dev` for unanswered questions.

### 9. Footer

Include:

- `Jawuil` and `jawuil.dev`
- `hola@jawuil.dev`
- Terms of license
- Privacy information once the exact data handling is documented

## Copy Rules

- Write for a developer who already knows Sublime Text.
- Prefer concrete verbs: inspect, edit, run, review, configure.
- Show the product instead of using claims like "revolutionary", "10x", or "best-in-class".
- Use English for the first public launch if targeting Sublime communities worldwide. Add Spanish later if it serves a distinct audience.
- State limitations honestly: customers supply their own provider credentials and usage costs.

## Assets Needed Before Publishing

- One clean hero screenshot at desktop width.
- One 60-90 second unedited workflow demo.
- One example task with a visible useful outcome.
- Final Gumroad purchase URL.
- Final price and exactly what the license includes.
- Installation documentation URL.
- A reviewed privacy statement matching the actual product behavior.

## Launch Checklist

- [ ] Primary Gumroad button works.
- [ ] Page works at 320px, tablet, and desktop widths.
- [ ] Screenshot text is readable and not cropped.
- [ ] Demo has captions or enough on-screen context to work muted.
- [ ] Claims match the shipped build.
- [ ] Support email and license terms are linked.
- [ ] Analytics, if used, are privacy-conscious and disclosed.
- [ ] A buyer can understand installation and first use in under one minute.
