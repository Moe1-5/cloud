# Project Index

> **Canonical map of every important file in the repo.**
> Auto-loaded reference for the assistant — look here first instead of guessing or searching.
> **Update rule:** any time a file is added, moved, renamed, or changes scope, update this index in the same task.

---

## Quick "Where do I look for…" lookup

| If you need… | Go to |
|---|---|
| Project rules / workflow | `CLAUDE.md` (root) |
| Cross-tool assistant rules / Read Aloud | `AGENTS.md` (root) |
| Current project state (stage, sprint, stack) | `.context/current.md` |
| Active sprint + goal | `tasks/active.md` → `tasks/sprints/sprint-NN-*.md` |
| AI self-correction lessons | `tasks/lessons.md` → `## Active` |
| Tech stack / folder structure / patterns | `docs/architecture.md` |
| Architectural decision history (ADR) | `docs/decisions.md` |
| Docs-only routing | `docs/INDEX.md` |
| Sprint-log hook scripts | `scripts/sprint-log/` |
| Env variable template | `.env.example` |
| CI pipeline | `.github/workflows/ci.yml` |

---

## Root

| File | What's inside |
|---|---|
| `CLAUDE.md` | Auto-loaded session rules: session-start sequence, lookup rule, workflow, sprint-log rule, folder ownership, code rules, testing protocol, Read Aloud. |
| `AGENTS.md` | Cross-tool instructions for any AI coding assistant (Codex, Cursor, Aider, etc.). Defers to `CLAUDE.md`; carries the Read Aloud rule. |
| `INDEX.md` | This file. Master TOC. |
| `.env.example` | Documented template for every env var the app needs. No real values ever — copy to `.env` (gitignored). |
| `.gitignore` | Version-control exclusions (multi-stack: Node, Python, Java/Kotlin, Dart, Rust) + `.claude/sprint-sessions/`. |

---

## `.context/` — project state

| File | What's inside |
|---|---|
| `current.md` | ≤ 40 lines. Project name, stage, active sprint, tech stack, last decision, status flags. **Read first after this index.** |

---

## `tasks/` — sprint + lessons tracking

| File | What's inside |
|---|---|
| `active.md` | Routing table — which sprint files are running. **Read after `current.md`.** |
| `lessons.md` | AI self-improvement lessons. `## Active` (enforce now) + `## Internalized` (graduated). |
| `sprints/sprint-01-init.md` | Initial scaffold sprint. Sprint files carry a `## Session Log` (hook-enforced — see `CLAUDE.md`). |
| `archive/` | Closed sprints (audit trail). Empty until the first sprint closes. |

---

## `docs/` — documentation

| File | What's inside |
|---|---|
| `INDEX.md` | Docs-only sub-index. Routes within `docs/`; the master map is this root `INDEX.md`. |
| `architecture.md` | Stack table, folder structure, key patterns, external services. |
| `decisions.md` | Append-only Architecture Decision Record (ADR) log. |

---

## `scripts/` — build & automation

| File | What's inside |
|---|---|
| `sprint-log/record-edit.mjs` | PostToolUse hook — records which file kinds were edited this session (observe only, never blocks). |
| `sprint-log/check-sprint-log.mjs` | Stop hook — blocks session end if source code was edited but no sprint file was updated. |

---

## `.claude/` — Claude Code config

| File | What's inside |
|---|---|
| `settings.json` | Permission allowlist + the PostToolUse/Stop hooks that enforce the sprint-log rule. |

---

## `.github/` — CI

| File | What's inside |
|---|---|
| `workflows/ci.yml` | CI placeholder. Replace the placeholder job with real lint → test → build steps for your stack. |

---

## Maintenance rule

When a file is **created**, **moved**, **renamed**, or **changes scope** — update this index in the same task. If you can't find what you need above, the index is stale: search, then update the index before finishing the task.
