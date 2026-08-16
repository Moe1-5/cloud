# Sprint 01 - Init

**Goal:** Initialize project and scaffold core structure  
**Start:** 2026-08-11
**End:** [Date]

---

## In Progress
- [x] Scaffold full-stack TypeScript application base

## Todo
- [ ] Implement authentication and role-based access when project roles are finalized
- [ ] Replace starter project records with the team's actual business domain

## Done
- [x] Initialize project from starter template
- [x] Add React/Vite frontend workspace
- [x] Add Express/TypeScript backend workspace
- [x] Add shared TypeScript contracts package
- [x] Add DynamoDB CRUD repository and routes
- [x] Add AWS deployment base for Elastic Beanstalk and EC2
- [x] Add CI validation pipeline

---

## Session Log

> Append one dated entry per implementation session (hook-enforced - see `CLAUDE.md`).
> Newest entries at the bottom. Format:
>
> ```markdown
> ### YYYY-MM-DD - <one-line summary>
> - What changed: <files/components modified>
> - Why: <reason or test failure that prompted the work>
> - Status: <what's now working / what's still open>
> ```

### 2026-08-11 - Scaffold AWS full-stack base
- What changed: Added npm workspace packages for frontend, backend, shared contracts, DynamoDB infrastructure, deployment files, CI, env template, and AWS documentation.
- Why: The Task 1 assignment requires a responsive web app, backend logic, AWS cloud database CRUD operations, and deployment on Elastic Beanstalk or EC2.
- Status: Lint, typecheck, backend test, and production build pass; authentication and final business domain remain future work.

### 2026-08-11 - Prepare repository for GitHub push
- What changed: Added line-ending normalization, cleaned trailing whitespace, refreshed the project index, and prepared the working tree for a local commit.
- Why: The repository should be clean and predictable before pushing to GitHub.
- Status: Git whitespace checks pass; the next step is pushing the prepared commit to the intended GitHub remote.

### 2026-08-14 - Start Student 2 assignment modules
- What changed: Created victim and volunteer sprints and connected their frontend, backend, shared contracts, and DynamoDB workflows to the scaffold.
- Why: Sprint 1 remains the lowest-numbered active sprint, while the workload matrix defines Student 2's role as victim and volunteer management.
- Status: Both Student 2 modules are implemented; local verification and deployed AWS integration remain open.

### 2026-08-14 - Prepare Student 2 sprints for completion
- What changed: Corrected victim and volunteer update persistence so optional API fields cannot overwrite required record fields with undefined values.
- Why: The first quality-gate pass identified strict TypeScript failures in both update repositories.
- Status: The known compile defect is corrected; the full verification gate is pending before sprint closure.

### 2026-08-14 - Resolve Student 2 strict update typing
- What changed: Replaced dynamically filtered update spreads with explicit field fallbacks in both Student 2 repositories.
- Why: TypeScript could not prove that the filtered mapped objects excluded undefined values from required record fields.
- Status: Required record fields are now preserved explicitly; fresh verification is pending.

### 2026-08-16 - Attempt branch merge-readiness validation
- What changed: Ran the first CI-equivalent validation gate on `feature/student-3-resource-emergency`; no application source or branch history was changed.
- Why: The branch needs a clean validation result before it is merged with teammate work.
- Status: Validation stopped before ESLint started because PowerShell blocked `npm.ps1` under the current execution policy. Typecheck, automated tests, production build, and merge-conflict assessment were not run in accordance with the repository's single-pass testing protocol.

---

> When done: move this file to `tasks/archive/sprint-01-init.md`, remove from `tasks/active.md`.
