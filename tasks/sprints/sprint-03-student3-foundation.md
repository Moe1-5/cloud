# Sprint 03 - Student 3 Foundation and Resource Inventory

**Goal:** Replace the generic starter workspace with a consistent Disaster Relief interface and deliver the Student 3 relief-resource inventory workflow.
**Owner:** Student 3
**Start:** 2026-08-13
**End:** [Date]

---

## In Progress

- [ ] Resolve the mobile horizontal-overflow finding in a separate fix session
- [ ] Complete the remaining one-pass browser interaction checklist after that fix

## Todo

### Resource Inventory

- [x] Define shared resource contracts, categories, and stock states
- [x] Create validated resource API routes
- [x] List relief resources
- [x] Add resource records
- [x] Update quantities and locations
- [x] Delete incorrect resource records
- [x] Surface low-stock and out-of-stock states

### Frontend Foundation

- [x] Replace the generic project workspace
- [x] Match the established navy, teal, mint, and white visual language
- [x] Add Student 3 navigation and responsive layouts
- [x] Add accessible loading, empty, error, and confirmation states

### Verification

- [x] Add resource API behavior tests
- [x] Run lint, typecheck, tests, and production build
- [ ] Perform one browser/system-test pass after implementation - stopped on mobile overflow finding

## Out of Scope

- Student 1 disaster, shelter, service, and administration ownership
- Student 2 victim and volunteer ownership
- Merging or copying teammate branch commits
- Final authentication and DynamoDB integration, which are scheduled for Sprint 6

## Done

- [x] Confirmed Student 3 workload from the Q4/Q5 assignment PDF
- [x] Inspected all available remote branches without merging them
- [x] Created an isolated Student 3 branch from the latest remote main branch

## Session Log

### 2026-08-13 - Define Student 3 delivery track

- What changed: Added Sprints 03 through 06, updated active sprint routing and current project context, and documented the isolated Student 3 scope.
- Why: The workload table assigns resources, distributions, relief activities, public-user functions, and emergency-case workflows to Student 3.
- Status: Planning is complete and Sprint 03 implementation is in progress; teammate code was inspected but not merged.

### 2026-08-13 - Implement resource inventory vertical slice

- What changed: Added shared resource contracts, validated resource CRUD routes with local seeded storage, API behavior tests, a shared frontend request helper, the Resource Workspace, and a responsive navy-and-teal application shell.
- Why: Student 3 owns relief-resource records, quantities, locations, and the frontend design for the Student 3 workflows.
- Status: Lint, typecheck, four automated tests, and the production build pass. Desktop rendering and initial inventory loading passed visual inspection. The system-test pass stopped when the 390-pixel mobile view showed horizontal overflow; browser interactions were not attempted after that finding.

---

> When done: archive only after the user explicitly says "close sprint 3".
