# Sprint 02 - Disaster Information & Relief Locations

**Goal:** Build the core Student 1 disaster-information features and replace the generic starter project functionality with the actual Disaster Relief Coordination System domain.

**Start:** 2026-08-12
**End:** [Date]

---

## In Progress

- [ ] Create full Edit Disaster form
- [ ] Continue Disaster Information Management improvements

---

## Todo

### Disaster Information
- [x] Create disaster data model
- [x] Create disaster list page
- [x] Create Add Disaster form
- [ ] Create full Edit Disaster form
- [ ] Create Disaster Details view
- [x] Add Delete Disaster functionality
- [x] Add disaster severity
- [x] Add disaster status

### Disaster Backend
- [x] Create GET /api/disasters
- [x] Create POST /api/disasters
- [x] Create GET /api/disasters/:id
- [x] Create PATCH /api/disasters/:id
- [x] Create DELETE /api/disasters/:id
- [x] Add request validation

### Shelters / Evacuation Centres
- [ ] Create shelter data model
- [ ] Create shelter list page
- [ ] Create Add Shelter form
- [ ] Create Edit Shelter form
- [ ] Add Delete Shelter functionality
- [ ] Track shelter location
- [ ] Track shelter capacity
- [ ] Track shelter availability/status

### Relief Services
- [ ] Create relief-service data model
- [ ] Support Food Distribution services
- [ ] Support Medical Services
- [ ] Create relief-service list page
- [ ] Add relief-service information
- [ ] Edit relief-service information
- [ ] Delete relief-service information

### Application UI
- [x] Replace starter Projects UI with Disaster Information interface
- [x] Create initial Disaster Relief frontend screen
- [ ] Create full application navigation
- [ ] Add Dashboard
- [ ] Add Disasters navigation
- [ ] Add Shelters navigation
- [ ] Add Relief Services navigation
- [ ] Make all pages responsive

### Local Development
- [x] Add temporary in-memory disaster repository
- [x] Allow disaster CRUD development without active AWS credentials
- [ ] Restore DynamoDB repository for final cloud integration

### Testing
- [x] Run typecheck after shared disaster model
- [x] Run typecheck after disaster schemas
- [x] Run typecheck after disaster repository
- [x] Run typecheck after disaster routes
- [x] Run typecheck after frontend API integration
- [ ] Complete disaster CRUD testing
- [ ] Run lint
- [ ] Run backend tests
- [ ] Run production build

---

## Out of Scope for Sprint 02

- User account administration
- Roles and permissions
- Relief organisation management
- System activity logs
- Reports
- Final authentication implementation
- AWS deployment

These will be implemented in later sprints.

---

## Done

- [x] Created shared disaster types
- [x] Added disaster severity and status constants
- [x] Added CreateDisasterInput and UpdateDisasterInput
- [x] Added Zod disaster request validation
- [x] Added Disaster REST API routes
- [x] Registered /api/disasters in Express
- [x] Added frontend disaster API client
- [x] Replaced generic Project Workspace with Disaster Information Management
- [x] Added disaster creation workflow
- [x] Added disaster list/read workflow
- [x] Added disaster status update workflow
- [x] Added disaster deletion workflow
- [x] Added temporary in-memory storage for local development
- [x] Verified TypeScript typecheck passes

---

## Session Log

### 2026-08-12 - Start Disaster Information sprint
- What changed: Created Sprint 02 plan for Disaster Information, Shelters, and Relief Services.
- Why: These functions form the first implementation phase of the Disaster Relief Coordination System and correspond to Student 1's assigned workload.
- Status: Sprint started; Disaster Information Management selected as the first implementation target.

### 2026-08-12 - Implement Disaster Information CRUD foundation
- What changed: Added shared DisasterRecord types, disaster severity/status values, create/update input types, Zod validation schemas, disaster repository functions, and disaster API routes.
- Why: Student 1 is responsible for publishing and updating disaster information, so a complete backend CRUD foundation is required.
- Status: Disaster API routes compile successfully and are registered under /api/disasters.

### 2026-08-12 - Build Disaster Information frontend
- What changed: Added disastersApi.ts and replaced the generic Project Workspace frontend with a Disaster Information Management interface containing an Add Disaster form, disaster summary counters, disaster record list, status updates, and delete functionality.
- Why: Sprint 02 requires the starter project interface to be replaced with real disaster-relief functionality assigned to Student 1.
- Status: Frontend-to-backend disaster workflows are working locally. Create, list, status update, and delete are implemented.

### 2026-08-12 - Add temporary local development storage
- What changed: Replaced the active disaster repository implementation with temporary in-memory storage for local development.
- Why: AWS Academy temporary credentials had expired and DynamoDB access was unavailable during development.
- Status: Disaster CRUD can be developed and tested without AWS. Data is temporary and resets when the backend restarts. Final DynamoDB integration remains required before submission.

---

> When Sprint 02 is complete: move this file to `tasks/archive/sprint-02-disaster-info.md`, remove its row from `tasks/active.md`, and update `.context/current.md`.