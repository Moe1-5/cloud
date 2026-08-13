# Project Index

> Canonical map of every important file in the repo.
> Update this index whenever a file is added, moved, renamed, or changes scope.

---

## Quick "Where do I look for..." lookup

| If you need... | Go to |
|---|---|
| Project rules / workflow | `CLAUDE.md` |
| Cross-tool assistant rules / Read Aloud | `AGENTS.md` |
| Current project state | `.context/current.md` |
| Active sprint + goal | `tasks/active.md` then `tasks/sprints/sprint-01-init.md` |
| AI self-correction lessons | `tasks/lessons.md` |
| Tech stack / folder structure / patterns | `docs/architecture.md` |
| Architectural decision history | `docs/decisions.md` |
| AWS deployment steps | `docs/aws-deployment.md` |
| Frontend app | `apps/frontend/` |
| Backend API | `apps/backend/` |
| Shared TypeScript contracts | `packages/shared/` |
| DynamoDB table definition | `infra/dynamodb/projects-table.json` |
| Env variable template | `.env.example` |
| CI pipeline | `.github/workflows/ci.yml` |

---

## Root

| File | What's inside |
|---|---|
| `CLAUDE.md` | Session rules: session start, lookup rule, workflow, sprint logging, code rules, testing protocol, Read Aloud. |
| `AGENTS.md` | Cross-tool assistant instructions and Read Aloud rule. |
| `INDEX.md` | This master table of contents. |
| `.env.example` | Documented template for app, AWS, frontend, and auth env vars. No real values. |
| `.gitignore` | Version-control exclusions for common build outputs and local config. |
| `.gitattributes` | Line-ending normalization for GitHub-friendly diffs. |
| `package.json` | npm workspace root with dev, build, lint, test, typecheck, and format scripts. |
| `tsconfig.base.json` | Shared strict TypeScript settings. |
| `eslint.config.js` | Flat ESLint configuration for TypeScript workspaces. |
| `.prettierrc.json` | Shared formatting configuration. |
| `Procfile` | Elastic Beanstalk process declaration. |
| `Dockerfile` | Production container build for EC2 or compatible container hosts. |
| `docker-compose.yml` | Local or EC2 Docker runner. |
| `README.md` | Project overview, setup, scripts, API surface, and AWS deployment pointer. |

---

## `.context/` - project state

| File | What's inside |
|---|---|
| `current.md` | Project name, stage, active sprint, stack, latest decision, status flags. |

---

## `apps/` - application source

| File / Folder | What's inside |
|---|---|
| `apps/backend/` | Express TypeScript API with project, victim, and volunteer DynamoDB workflows. |
| `apps/frontend/` | Vite React TypeScript dashboard for Student 2 victim and volunteer management. |

---

## `packages/` - shared code

| File / Folder | What's inside |
|---|---|
| `packages/shared/` | Shared TypeScript API contracts and project status constants. |

---

## `infra/` - cloud infrastructure helpers

| File / Folder | What's inside |
|---|---|
| `infra/dynamodb/projects-table.json` | AWS CLI table definition for the DynamoDB project records table. |

---

## `docs/` - documentation

| File | What's inside |
|---|---|
| `INDEX.md` | Docs-only sub-index. |
| `architecture.md` | Stack table, folder structure, key patterns, external services. |
| `decisions.md` | Append-only Architecture Decision Record log. |
| `aws-deployment.md` | DynamoDB, Elastic Beanstalk, and EC2 deployment guide. |

---

## `tasks/` - sprint + lessons tracking

| File | What's inside |
|---|---|
| `active.md` | Routing table for active sprint files. |
| `lessons.md` | Active and internalized assistant lessons. |
| `sprints/sprint-01-init.md` | Initial scaffold sprint and session log. |
| `sprints/sprint-03-victim-management.md` | Student 2 victim registration, search, needs, and assistance-history sprint. |
| `sprints/sprint-04-volunteer-management.md` | Student 2 volunteer information, availability, and task-assignment sprint. |
| `archive/` | Closed sprint audit trail when sprints are explicitly closed. |

---

## `scripts/` - build & automation

| File | What's inside |
|---|---|
| `scripts/sprint-log/record-edit.mjs` | PostToolUse hook that records source edits. |
| `scripts/sprint-log/check-sprint-log.mjs` | Stop hook that checks sprint log updates after source edits. |

---

## `.claude/` - Claude Code config

| File | What's inside |
|---|---|
| `settings.json` | Permission allowlist and sprint-log hooks. |

---

## `.github/` - CI

| File | What's inside |
|---|---|
| `workflows/ci.yml` | Node 20 CI pipeline: install, lint, typecheck, test, build. |
