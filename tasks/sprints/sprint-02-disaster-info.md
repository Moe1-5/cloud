# Sprint 02 - Disaster Information & Relief Locations

**Goal:** Build the Student 1 Relief Coordinator functionality for managing disaster information, evacuation centres, food distribution points, and medical services.

**Start:** 2026-08-12
**End:** 2026-08-15

---

## In Progress

- [ ] Connect Relief Coordinator modules to the team's final DynamoDB table

---

## Todo

### Disaster Information

- [x] Create disaster data model
- [x] Create disaster list page
- [x] Create Add Disaster form
- [x] Create Edit Disaster form
- [x] Create Disaster Details view
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

- [x] Create shelter data model
- [x] Create shelter list page
- [x] Create Add Shelter form
- [x] Create Edit Shelter form
- [x] Create Shelter Details view
- [x] Add Delete Shelter functionality
- [x] Track shelter location
- [x] Track maximum capacity
- [x] Track current occupancy
- [x] Calculate available spaces
- [x] Track shelter status
- [x] Store contact information
- [x] Store shelter notes

### Shelter Backend

- [x] Create GET /api/shelters
- [x] Create POST /api/shelters
- [x] Create GET /api/shelters/:id
- [x] Create PATCH /api/shelters/:id
- [x] Create DELETE /api/shelters/:id
- [x] Add request validation
- [x] Create temporary local repository

### Relief Services

- [x] Create relief-service data model
- [x] Support Food Distribution services
- [x] Support Medical Services
- [x] Create relief-service list page
- [x] Create Add Relief Service form
- [x] Add Edit Relief Service functionality
- [x] Add Delete Relief Service functionality
- [x] Track service location
- [x] Track contact information
- [x] Track operating hours
- [x] Track service status
- [x] Support Available status
- [x] Support Limited status
- [x] Support Closed status

### Relief Services Backend

- [x] Create GET /api/relief-services
- [x] Create POST /api/relief-services
- [x] Create GET /api/relief-services/:id
- [x] Create PATCH /api/relief-services/:id
- [x] Create DELETE /api/relief-services/:id
- [x] Add request validation
- [x] Create temporary local repository

### Application UI

- [x] Replace generic starter Projects interface
- [x] Create Disaster Management page
- [x] Create Shelter Management page
- [x] Create Relief Services Management page
- [x] Create Relief Coordinator layout
- [x] Add Disaster navigation
- [x] Add Shelter navigation
- [x] Add Relief Services navigation
- [x] Separate Relief Coordinator functionality from Admin functionality
- [x] Add role-based layout structure

### Activity Logging

- [x] Log disaster creation
- [x] Log disaster updates
- [x] Log disaster deletion
- [x] Log shelter creation
- [x] Log shelter updates
- [x] Log shelter status changes
- [x] Log shelter deletion
- [x] Log relief-service creation
- [x] Log relief-service updates
- [x] Log relief-service status changes
- [x] Log relief-service deletion

### Local Development

- [x] Allow development without active AWS Academy credentials
- [x] Use temporary in-memory Disaster repository
- [x] Use temporary in-memory Shelter repository
- [x] Use temporary in-memory Relief Service repository
- [ ] Replace temporary repositories with DynamoDB

### Testing

- [x] TypeScript typecheck passes
- [x] Lint passes
- [x] Production build passes
- [x] Test Disaster create
- [x] Test Disaster read
- [x] Test Disaster edit
- [x] Test Disaster status update
- [x] Test Disaster delete
- [x] Test Shelter create
- [x] Test Shelter read
- [x] Test Shelter edit
- [x] Test Shelter status update
- [x] Test Shelter delete
- [x] Test Relief Service create
- [x] Test Relief Service edit
- [x] Test Relief Service status update
- [x] Test Relief Service delete
- [x] Test Food Distribution service
- [x] Test Medical service
- [x] Test Relief Coordinator navigation

### AWS Integration

- [ ] Connect Disaster repository to DynamoDB
- [ ] Connect Shelter repository to DynamoDB
- [ ] Connect Relief Service repository to DynamoDB
- [ ] Test DynamoDB Create operations
- [ ] Test DynamoDB Read operations
- [ ] Test DynamoDB Update operations
- [ ] Test DynamoDB Delete operations
- [ ] Verify persistence after backend restart
- [ ] Integrate with team AWS infrastructure

---

## Done

- [x] Disaster Information Management
- [x] Shelter / Evacuation Centre Management
- [x] Food Distribution Management
- [x] Medical Service Management
- [x] Relief Coordinator frontend layout
- [x] Relief Coordinator REST APIs
- [x] Local CRUD functionality
- [x] Automatic activity logging
- [x] Local validation
- [x] Typecheck
- [x] Lint
- [x] Production build
- [x] Manual browser testing

---

## API Endpoints

### Disasters

GET /api/disasters

POST /api/disasters

GET /api/disasters/:id

PATCH /api/disasters/:id

DELETE /api/disasters/:id

### Shelters

GET /api/shelters

POST /api/shelters

GET /api/shelters/:id

PATCH /api/shelters/:id

DELETE /api/shelters/:id

### Relief Services

GET /api/relief-services

POST /api/relief-services

GET /api/relief-services/:id

PATCH /api/relief-services/:id

DELETE /api/relief-services/:id

---

## Frontend Structure

apps/frontend/src/

pages/
- relief/
  - DisasterManagement.tsx
  - ShelterManagement.tsx
  - ReliefServicesManagement.tsx

layouts/
- ReliefCoordinatorLayout.tsx

api/
- disastersApi.ts
- sheltersApi.ts
- reliefServicesApi.ts

---

## Backend Structure

apps/backend/src/features/

disasters/
- disasterRepository.ts
- disasterRoutes.ts
- disasterSchemas.ts

shelters/
- shelterRepository.ts
- shelterRoutes.ts
- shelterSchemas.ts

reliefServices/
- reliefServiceRepository.ts
- reliefServiceRoutes.ts
- reliefServiceSchemas.ts

---

## Session Log

### 2026-08-12 - Sprint 02 Started

- Created the Sprint 02 implementation plan.
- Selected Disaster Information Management as the first Student 1 feature.

### 2026-08-12 - Disaster Backend

- Created shared Disaster models.
- Added disaster severity and status types.
- Added validation schemas.
- Added REST CRUD endpoints.
- Added local repository implementation.

### 2026-08-12 - Disaster Frontend

- Replaced the generic Project Workspace.
- Created Disaster Information Management interface.
- Added create, list, status update and delete functionality.

### 2026-08-15 - Complete Disaster CRUD

- Added full disaster editing.
- Added Disaster Details view.
- Added automatic activity logging.
- Moved the interface into DisasterManagement.tsx.

### 2026-08-15 - Shelter Management

- Added Shelter shared models and validation.
- Added Shelter CRUD backend.
- Added Shelter Management frontend.
- Added capacity and occupancy management.
- Added available-space calculation.
- Added automatic activity logging.

### 2026-08-15 - Relief Services

- Added Food Distribution and Medical Service types.
- Added Relief Service backend CRUD.
- Added Relief Services frontend.
- Added service availability management.
- Added automatic activity logging.

### 2026-08-15 - Role-Based Structure

- Created ReliefCoordinatorLayout.
- Separated Relief Coordinator functionality from Administration functionality.
- Prepared the layout for team integration.

### 2026-08-15 - Local Testing Complete

- npm run typecheck passed.
- npm run lint passed.
- npm run build passed.
- Disaster CRUD manually tested.
- Shelter CRUD manually tested.
- Relief Service CRUD manually tested.
- Relief Coordinator navigation tested successfully.

---

## Remaining Work

Sprint 02 functionality is complete locally.

The remaining work is AWS integration:

1. Obtain the team's final DynamoDB configuration.
2. Replace temporary local repositories with DynamoDB operations.
3. Test storage, retrieval, update and deletion.
4. Confirm records survive application restarts.
5. Perform final integrated testing after team branches are merged.

---

## Sprint Status

**Local Development:** Complete

**AWS DynamoDB Integration:** Pending team infrastructure

**Team Integration:** Pending

> Keep Sprint 02 available until DynamoDB integration has been completed.