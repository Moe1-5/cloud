# CLAUDE.md

## Session Start
1. Read `.context/current.md` — project state at a glance
2. Read `tasks/active.md` — which sprints are currently running
3. Read each sprint file listed in `tasks/active.md`
4. Read `tasks/lessons.md` — focus on `## Active` section first

## Workflow
- **Any task**: plan → implement → verify → update the relevant sprint file
- **Non-trivial (3+ steps)**: enter plan mode, confirm before coding
- **After any correction**: add entry to `tasks/lessons.md` under `## Active` immediately
- **Sprint ends**: move sprint file to `tasks/archive/`, remove it from `tasks/active.md`, update `.context/current.md` — **only when the user explicitly says "close sprint N"**; never archive based on checkboxes alone
- **Lesson internalized** (not violated in 2+ sprints): move it from `## Active` to `## Internalized`

## Folder Ownership
One source of truth per concern. Never duplicate. Never add a folder without updating this table.

| Concern | Location |
|---------|----------|
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

## Docs Rule
Whenever a file is added to `docs/` or an existing doc changes scope — update `docs/INDEX.md` before closing the task.

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

## Before "Done"
- [ ] Behavior tested (not just type-checked or linted)
- [ ] No new lint errors introduced
- [ ] No duplicate folders or files created
- [ ] Relevant sprint file updated
- [ ] `.context/current.md` updated if sprint or stack changed
- [ ] `docs/INDEX.md` updated if a doc was added or changed
