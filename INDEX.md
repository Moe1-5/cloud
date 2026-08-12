# Project Index

> Canonical map of every important file in the repo.
> Update this index whenever a file is added, moved, renamed, or changes scope.

---

## Quick "Where do I look for..." lookup

| If you need...                           | Go to                                          |
| ---------------------------------------- | ---------------------------------------------- |
| Project rules / workflow                 | `CLAUDE.md`                                    |
| Cross-tool assistant rules / Read Aloud  | `AGENTS.md`                                    |
| Current project state                    | `.context/current.md`                          |
| Active sprint + goal                     | `tasks/active.md` then the listed sprint files |
| AI self-correction lessons               | `tasks/lessons.md`                             |
| Tech stack / folder structure / patterns | `docs/architecture.md`                         |
| Architectural decision history           | `docs/decisions.md`                            |
| AWS deployment steps                     | `docs/aws-deployment.md`                       |
| Frontend app                             | `apps/frontend/`                               |
| Backend API                              | `apps/backend/`                                |
| Shared TypeScript contracts              | `packages/shared/`                             |
| DynamoDB table definition                | `infra/dynamodb/projects-table.json`           |
| Env variable template                    | `.env.example`                                 |
| CI pipeline                              | `.github/workflows/ci.yml`                     |

---

## Root

| File                 | What's inside                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`          | Session rules: session start, lookup rule, workflow, sprint logging, code rules, testing protocol, Read Aloud. |
| `AGENTS.md`          | Cross-tool assistant instructions and Read Aloud rule.                                                         |
| `INDEX.md`           | This master table of contents.                                                                                 |
| `.env.example`       | Documented template for app, AWS, frontend, and auth env vars. No real values.                                 |
| `.gitignore`         | Version-control exclusions for common build outputs and local config.                                          |
| `.gitattributes`     | Line-ending normalization for GitHub-friendly diffs.                                                           |
| `package.json`       | npm workspace root with dev, build, lint, test, typecheck, and format scripts.                                 |
| `tsconfig.base.json` | Shared strict TypeScript settings.                                                                             |
| `eslint.config.js`   | Flat ESLint configuration for TypeScript workspaces.                                                           |
| `.prettierrc.json`   | Shared formatting configuration.                                                                               |
| `Procfile`           | Elastic Beanstalk process declaration.                                                                         |
| `Dockerfile`         | Production container build for EC2 or compatible container hosts.                                              |
| `docker-compose.yml` | Local or EC2 Docker runner.                                                                                    |
| `README.md`          | Project overview, setup, scripts, API surface, and AWS deployment pointer.                                     |

---

## `.context/` - project state

| File         | What's inside                                                             |
| ------------ | ------------------------------------------------------------------------- |
| `current.md` | Project name, stage, active sprint, stack, latest decision, status flags. |

---

## `apps/` - application source

| File / Folder                                    | What's inside                                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `apps/backend/`                                  | Express TypeScript API with project, resource, distribution, and relief-activity routes. |
| `apps/backend/src/features/resources/`           | Student 3 relief-resource validation, routes, and local immutable repository.            |
| `apps/backend/src/features/distributions/`       | Student 3 distribution validation, guarded status workflow, and inventory reservation.   |
| `apps/backend/src/features/activities/`          | Derived operational activity feed and summary API.                                       |
| `apps/backend/src/features/profiles/`            | Affected-user registration, uniqueness checks, and profile updates.                      |
| `apps/backend/src/features/emergency-requests/`  | Request ownership, coordinator workflow, and immutable status history.                   |
| `apps/backend/src/features/reports/`             | Student 3 operational report aggregation and route.                                      |
| `apps/backend/tests/resources.test.ts`           | Resource CRUD, validation, and stock-state behavior coverage.                            |
| `apps/backend/tests/distributions.test.ts`       | Distribution reservation, transition, cancellation, and activity-summary coverage.       |
| `apps/backend/tests/emergencyRequests.test.ts`   | Profile, ownership, public request, and coordinator workflow coverage.                   |
| `apps/backend/tests/reports.test.ts`             | Student 3 operational-report aggregation coverage.                                       |
| `apps/frontend/`                                 | Vite React TypeScript frontend for Student 3 relief operations.                          |
| `apps/frontend/src/features/resources/`          | Responsive resource inventory workspace.                                                 |
| `apps/frontend/src/features/distributions/`      | Distribution scheduling, status tracking, filtering, and activity monitoring workspace.  |
| `apps/frontend/src/features/emergency-requests/` | Affected-user profile/request and coordinator case-management workspace.                 |
| `apps/frontend/src/features/reports/`            | Student 3 operational reporting workspace.                                               |
| `apps/frontend/src/api/`                         | Typed project, resource, distribution, profile, emergency, and shared JSON API clients.  |

---

## `packages/` - shared code

| File / Folder      | What's inside                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `packages/shared/` | Shared project, resource, distribution, activity, profile, and emergency TypeScript contracts. |

---

## `infra/` - cloud infrastructure helpers

| File / Folder                        | What's inside                                                    |
| ------------------------------------ | ---------------------------------------------------------------- |
| `infra/dynamodb/projects-table.json` | AWS CLI table definition for the DynamoDB project records table. |

---

## `docs/` - documentation

| File                  | What's inside                                                                      |
| --------------------- | ---------------------------------------------------------------------------------- |
| `INDEX.md`            | Docs-only sub-index.                                                               |
| `architecture.md`     | Stack table, folder structure, key patterns, external services.                    |
| `decisions.md`        | Append-only Architecture Decision Record log.                                      |
| `aws-deployment.md`   | DynamoDB, Elastic Beanstalk, and EC2 deployment guide.                             |
| `student3-handoff.md` | Student 3 scope, APIs, verification evidence, and controlled integration guidance. |

---

## `tasks/` - sprint + lessons tracking

| File                                           | What's inside                                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `active.md`                                    | Routing table for active sprint files.                                      |
| `lessons.md`                                   | Active and internalized assistant lessons.                                  |
| `sprints/sprint-01-init.md`                    | Initial scaffold sprint and session log.                                    |
| `sprints/sprint-03-student3-foundation.md`     | Student 3 resource inventory and frontend-foundation sprint.                |
| `sprints/sprint-04-distribution-activities.md` | Student 3 distribution and relief-activity sprint.                          |
| `sprints/sprint-05-emergency-requests.md`      | Student 3 public emergency-request and coordinator-case sprint.             |
| `sprints/sprint-06-integration-quality.md`     | Student 3 shared integration, reporting, quality, and documentation sprint. |
| `archive/`                                     | Closed sprint audit trail when sprints are explicitly closed.               |

---

## `scripts/` - build & automation

| File                                      | What's inside                                                |
| ----------------------------------------- | ------------------------------------------------------------ |
| `scripts/sprint-log/record-edit.mjs`      | PostToolUse hook that records source edits.                  |
| `scripts/sprint-log/check-sprint-log.mjs` | Stop hook that checks sprint log updates after source edits. |

---

## `.claude/` - Claude Code config

| File            | What's inside                              |
| --------------- | ------------------------------------------ |
| `settings.json` | Permission allowlist and sprint-log hooks. |

---

## `.github/` - CI

| File               | What's inside                                               |
| ------------------ | ----------------------------------------------------------- |
| `workflows/ci.yml` | Node 20 CI pipeline: install, lint, typecheck, test, build. |
