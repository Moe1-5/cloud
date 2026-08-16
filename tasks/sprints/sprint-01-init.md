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

### 2026-08-16 - Move integrated backend repositories to dynamic storage
- What changed: Created `feature/dynamic-dynamodb-backend` from latest `main`, added a shared DynamoDB repository helper, converted backend feature repositories from hardcoded arrays to table-backed records, adjusted tests to create records through APIs, and silenced the backend TypeScript `baseUrl` deprecation warning with the project-supported setting.
- Why: The integrated system still used hardcoded sample records and memory-only arrays across most backend modules, so user-created data would disappear after restart and AWS configuration would not persist full-system data.
- Status: Backend typecheck, backend tests, and backend build pass; production runtime now requires DynamoDB table and AWS credentials or a configured local DynamoDB endpoint outside Vitest.

### 2026-08-16 - Align runtime configuration to a single root env file
- What changed: Updated backend env loading to read the repository-root `.env`, updated Vite to load root env values and derive its proxy target from `VITE_API_BASE_URL`, `APP_URL`, or `APP_PORT`, and clarified `.env.example` as the single root env template.
- Why: The project only maintains one root env template, but backend dotenv loading and frontend proxy configuration previously assumed app-local or hardcoded settings.
- Status: Root typecheck, backend tests, and production build pass; local DynamoDB could not be verified because port 8000 is currently a Uvicorn service returning 404 and Docker/AWS CLI are not installed on this machine.

### 2026-08-16 - Add real authentication and repository cleanup audit
- What changed: Added backend password hashing, signed auth tokens, bootstrap admin login, authenticated API middleware, frontend email/password login, stored session handling, authorization headers, user password management, auth tests, and index entries for the new auth files.
- Why: The integrated frontend still used role-button development login and protected data routes did not require a real session.
- Status: Root typecheck, backend tests, and production build pass; lint remains skipped by user direction. Cleanup audit found large ignored/generated folders under `tmp/`, `node_modules/`, and build `dist/` outputs, but no source folders were deleted during the auth change.

### 2026-08-16 - Clarify frontend login routing
- What changed: Added explicit frontend path replacement so unauthenticated users land on `/login`, logout returns to `/login`, and authenticated users are sent to a role-specific path after sign-in.
- Why: An old Student 3 dev server could render protected workspaces at `/login`, making it unclear which branch and route were active.
- Status: Root typecheck, backend tests, and production build pass; the auth-enabled app must be run from `tmp/main-merge-20260816` on `feature/dynamic-dynamodb-backend`.

---

> When done: move this file to `tasks/archive/sprint-01-init.md`, remove from `tasks/active.md`.
