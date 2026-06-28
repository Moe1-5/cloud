# CLAUDE.md

## Session Start
1. Read `INDEX.md` — master file map; look here first instead of guessing or searching
2. Read `.context/current.md` — project state at a glance
3. Read `tasks/active.md` — which sprints are currently running
4. Read each sprint file listed in `tasks/active.md`
5. Read `tasks/lessons.md` — focus on `## Active` section first

## Lookup Rule
Before searching the filesystem for any file, scan `INDEX.md` — the Quick "Where do I look for…" table covers the common case. Only fall back to Glob/Grep if the index doesn't list it, and if something's missing, update the index in the same task.

## Workflow
- **Any task**: plan → implement → verify → update the relevant sprint file
- **Non-trivial (3+ steps)**: enter plan mode, confirm before coding
- **After any correction**: add entry to `tasks/lessons.md` under `## Active` immediately
- **Sprint ends**: move sprint file to `tasks/archive/`, remove it from `tasks/active.md`, update `.context/current.md` — **only when the user explicitly says "close sprint N"**; never archive based on checkboxes alone
- **Lesson internalized** (not violated in 2+ sprints): move it from `## Active` to `## Internalized`

## Sprint File Update Rule (mandatory)

After **every implementation session** — whether a full feature, a bug fix, a refactor, or a test run — append a dated entry to the active sprint file before the session ends. No exceptions.

**Which sprint is "current":** the **lowest-numbered sprint still listed in `tasks/active.md`** — a sprint stays current until the user explicitly closes it, regardless of what later sprints exist or what `.context/current.md` highlights. All session entries (including bug fixes, tooling, and out-of-scope work) go to the current sprint's file, unless the work is unambiguously part of a specific later sprint's task list.

**Format** (append under a `## Session Log` section at the bottom of the sprint file):

```markdown
### YYYY-MM-DD — <one-line summary>
- What changed: <bullet list of files/components modified>
- Why: <brief reason or test failure that prompted the work>
- Status: <what's now working / what's still open>
```

**When to do it:** immediately after the "verify" step, before marking any todo complete. The sprint file is the authoritative record of what was built and why — it must stay current so any future session can pick up exactly where this one left off without re-reading the whole conversation.

**Enforcement (automatic):** this rule is hook-enforced via `.claude/settings.json`. A PostToolUse hook (`scripts/sprint-log/record-edit.mjs`) tracks every edit to source code (e.g. `src/`, `frontend/`, `backend/`, `mobile/`) during the session; a Stop hook (`scripts/sprint-log/check-sprint-log.mjs`) blocks the session from ending until a file under `tasks/sprints/` has also been updated. If you are blocked at session end with "SPRINT LOG MISSING", append the Session Log entry to the relevant active sprint (per `tasks/active.md`) and finish. Session state lives in `.claude/sprint-sessions/` (gitignored, auto-cleaned).

## Folder Ownership
One source of truth per concern. Never duplicate. Never add a folder without updating this table.

| Concern | Location |
|---------|----------|
| Master file map (TOC) | `INDEX.md` |
| Current project focus | `.context/current.md` |
| Active sprint list | `tasks/active.md` |
| Sprint task files | `tasks/sprints/sprint-NN-name.md` |
| Completed sprints | `tasks/archive/` |
| Lessons (current) | `tasks/lessons.md` — `## Active` section |
| Lessons (internalized) | `tasks/lessons.md` — `## Internalized` section |
| Docs routing index | `docs/INDEX.md` — update when any doc is added or changed |
| Architecture reference | `docs/architecture.md` |
| Decision log | `docs/decisions.md` (append-only) |
| Env variable template | `.env.example` (no real values ever) |
| Build/utility scripts | `scripts/` |
| Application source | `src/` or `{frontend,backend,mobile}/` |

## Docs / Index Rule
When **any file** is created, moved, renamed, or changes scope — update **`INDEX.md`** (the master TOC) in the same task. If the change is doc-only, also update `docs/INDEX.md`.

## Code Rules
- **Immutable**: return new objects, never mutate existing ones
- **Feature-based**: `src/features/{domain}/` not flat type folders
- **No hardcoded values**: use constants or env vars
- **Explicit errors**: never swallow silently, handle at every layer
- **Validate at boundaries**: user input and external APIs only — trust internal code

## Scaling
- `src/` → split to `frontend/` + `backend/` when project becomes multi-tier
- New tech layer (mobile, infra) → new top-level folder
- Docs grow → add new files to `docs/`, update `docs/INDEX.md`

## Browser / System Testing Protocol (mandatory)

When running a browser test, E2E run, or any "test the app / system test" task, this is **find-and-report, never fix**. It is a single linear pass, not a debugging loop.

- **Never fix during testing.** Do not edit app code, tweak behavior, or "make it pass." Record the bug/issue and move on. Fixing is a separate task the user must explicitly request.
- **Checklist discipline — test once, then CLOSE.** Keep an explicit checklist of items to verify. The moment an item passes OR fails, it is closed. **Never re-test, re-run, or re-verify a closed item.** Do not re-run the whole suite to "confirm" things that already passed.
- **On any failure or unexpected behavior: STOP and report it as a finding.** Do not iterate, retry, adjust selectors/timeouts, restart servers, or re-run trying to chase a green result. One observation = one logged finding. If a test harness itself is flaky/blocked, log that as the finding too — do not loop trying to fix the harness mid-test.
- **No loops, ever.** If you find yourself running the same (or a similar) command a second time to get a different result, stop immediately and report instead. Repeated runs burn the user's tokens and context — that is a failure, not diligence.
- **Output = a bug/issue list.** A test session ends with a report of what passed, what failed (as findings), and what couldn't be verified — then stop and hand back to the user. The user decides what to fix.

## Read Aloud Report (mandatory — coding assistants only)

> Cross-tool development rule. Mirrored in `AGENTS.md` so any coding assistant (Claude Code, Codex, Cursor, etc.) honors it while working on this repository.

End **every** coding-assistant response that completes meaningful repository work — and every development session wrap-up — with a final section headed exactly `## 🔊 Read Aloud`. The user consumes this through a text-to-speech tool, so it must be written for the ear:

- **Plain spoken prose only.** No bullets, no markdown symbols, no code blocks, no backticks, no emoji inside the spoken text, no raw file paths.
- **Spell things out for speech**: say "the App dot tsx file" not `App.tsx`, "sprint seven" not `sprint-07`.
- **Cumulative and self-contained**: cover what was asked, what changed and why, what was verified, and what's still open — understandable without seeing the rest of the response.
- Place it last, after all other output. If a response did no real work (a pure question/answer), the section may be skipped.

## Before "Done"
- [ ] Behavior tested (not just type-checked or linted)
- [ ] No new lint errors introduced
- [ ] No duplicate folders or files created
- [ ] Relevant sprint file updated
- [ ] `.context/current.md` updated if sprint or stack changed
- [ ] `INDEX.md` updated if any file was added, moved, renamed, or changed scope (and `docs/INDEX.md` if doc-only)
