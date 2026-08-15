# Sprint 03 - Administration & Access Management

**Goal:** Implement Student 1 System Administrator functionality including user accounts, roles and permissions, relief organisations, activity logs, reports and role-based access structure.

**Start:** 2026-08-15
**End:** 2026-08-15

---

## In Progress

- [ ] Connect Administration repositories to the team's DynamoDB table
- [ ] Integrate final team authentication system

---

## Todo

### User Account Management

- [x] Create User Account data model
- [x] Create Add User form
- [x] Create User list
- [x] Edit user information
- [x] Delete user account
- [x] Activate user account
- [x] Deactivate user account
- [x] Assign system role
- [x] Store organisation information
- [x] Store contact information

### User Backend

- [x] Create GET /api/users
- [x] Create POST /api/users
- [x] Create GET /api/users/:id
- [x] Create PATCH /api/users/:id
- [x] Create DELETE /api/users/:id
- [x] Add request validation
- [x] Add activity logging
- [ ] Connect repository to DynamoDB

### Roles & Permissions

- [x] Define System Administrator role
- [x] Define Relief Coordinator role
- [x] Define Affected User role
- [x] Create permission definitions
- [x] Map permissions to each role
- [x] Create Roles & Permissions page
- [x] Display permissions by role
- [x] Prepare role routing structure

### Relief Organisation Management

- [x] Create Relief Organisation data model
- [x] Create organisation list
- [x] Create Add Organisation form
- [x] Edit organisation information
- [x] Delete organisation
- [x] Activate organisation
- [x] Deactivate organisation
- [x] Store organisation type
- [x] Store address
- [x] Store contact number
- [x] Store email

### Organisation Backend

- [x] Create GET /api/organisations
- [x] Create POST /api/organisations
- [x] Create GET /api/organisations/:id
- [x] Create PATCH /api/organisations/:id
- [x] Create DELETE /api/organisations/:id
- [x] Add request validation
- [x] Add automatic activity logging
- [ ] Connect repository to DynamoDB

### System Activity Logs

- [x] Create ActivityLog data model
- [x] Create Activity Log repository
- [x] Create GET /api/activity-logs
- [x] Create Activity Logs frontend page
- [x] Display activity description
- [x] Display action type
- [x] Display target entity
- [x] Display user/actor
- [x] Display date and time
- [x] Automatically log Disaster actions
- [x] Automatically log Shelter actions
- [x] Automatically log Relief Service actions
- [x] Automatically log User actions
- [x] Automatically log Organisation actions
- [x] Record status changes separately
- [ ] Connect Activity Logs to DynamoDB

### Reports

- [x] Create Admin Reports page
- [x] Display total users
- [x] Display active users
- [x] Display total disasters
- [x] Display active disasters
- [x] Display total shelters
- [x] Display open shelters
- [x] Display total relief services
- [x] Display available relief services
- [x] Display total organisations
- [x] Display active organisations
- [x] Add report refresh functionality

### Admin Dashboard

- [x] Create Admin Dashboard
- [x] Display user count
- [x] Display active disaster count
- [x] Display shelter count
- [x] Display organisation count
- [x] Display activity count
- [x] Add Dashboard navigation
- [x] Add dashboard refresh functionality

### Administration Navigation

- [x] Create AdminLayout
- [x] Add Dashboard navigation
- [x] Add Users navigation
- [x] Add Roles navigation
- [x] Add Organisations navigation
- [x] Add Activity Logs navigation
- [x] Add Reports navigation
- [x] Separate Admin pages from Relief Coordinator pages

### Role-Based Access

- [x] Define three main user roles
- [x] Create role-to-home-page mapping
- [x] Create temporary development login
- [x] Route Admin to Admin layout
- [x] Route Relief Coordinator to Relief Coordinator layout
- [x] Create Affected User integration placeholder
- [x] Add logout functionality
- [ ] Replace development login with final authentication system
- [ ] Connect authenticated account to stored role
- [ ] Enforce permissions on backend routes

### Testing

- [x] TypeScript typecheck passes
- [x] Lint passes
- [x] Production build passes
- [x] User Account CRUD manually tested
- [x] User activation/deactivation tested
- [x] Role selection tested
- [x] Organisation CRUD manually tested
- [x] Organisation status change tested
- [x] Activity Logs tested
- [x] Admin Reports tested
- [x] Admin Dashboard tested
- [x] Admin navigation tested
- [x] Relief Coordinator navigation tested
- [x] Role-based layout switching tested

### AWS Integration

- [ ] Connect User repository to DynamoDB
- [ ] Connect Organisation repository to DynamoDB
- [ ] Connect Activity Log repository to DynamoDB
- [ ] Test DynamoDB user CRUD
- [ ] Test DynamoDB organisation CRUD
- [ ] Test DynamoDB activity-log storage
- [ ] Integrate with team DynamoDB configuration
- [ ] Test application using AWS Academy credentials

---

## Done

### Administration

- [x] User Account Management
- [x] Roles & Permissions
- [x] Relief Organisation Management
- [x] System Activity Logs
- [x] Admin Reports
- [x] Admin Dashboard

### Role Structure

- [x] System Administrator role
- [x] Relief Coordinator role
- [x] Affected User role
- [x] Shared permission definitions
- [x] Role-based frontend structure
- [x] AdminLayout
- [x] ReliefCoordinatorLayout
- [x] Development login
- [x] Logout

### Local Quality Checks

- [x] Typecheck passed
- [x] Lint passed
- [x] Production build passed
- [x] Browser workflow testing passed

---

## API Endpoints

### Users

GET /api/users

POST /api/users

GET /api/users/:id

PATCH /api/users/:id

DELETE /api/users/:id

### Organisations

GET /api/organisations

POST /api/organisations

GET /api/organisations/:id

PATCH /api/organisations/:id

DELETE /api/organisations/:id

### Activity Logs

GET /api/activity-logs

---

## User Roles

### System Administrator

Permissions:

- Manage User Accounts
- Manage Roles and Permissions
- Manage Relief Organisations
- View Activity Logs
- View System Reports

### Relief Coordinator

Permissions:

- Manage Disaster Information
- Manage Shelters
- Manage Relief Services
- Manage Victims
- Manage Volunteers
- Manage Resources
- Manage Emergency Requests
- View System Reports

Some Relief Coordinator features will be provided by other group members during team integration.

### Affected User

Permissions:

- View Disaster Information
- Submit Emergency Requests
- Manage Own Profile

Affected User functionality will be integrated with the responsible team member's implementation.

---

## Frontend Structure

apps/frontend/src/

layouts/
- AdminLayout.tsx
- ReliefCoordinatorLayout.tsx

pages/

admin/
- AdminDashboard.tsx
- UserManagement.tsx
- RoleManagement.tsx
- OrganisationManagement.tsx
- ActivityLogs.tsx
- AdminReports.tsx

relief/
- DisasterManagement.tsx
- ShelterManagement.tsx
- ReliefServicesManagement.tsx

LoginPage.tsx

auth/
- roleRoutes.ts

---

## Backend Structure

apps/backend/src/features/

users/
- userRepository.ts
- userRoutes.ts
- userSchemas.ts

organisations/
- organisationRepository.ts
- organisationRoutes.ts
- organisationSchemas.ts

activityLogs/
- activityLogRepository.ts
- activityLogRoutes.ts

---

## Session Log

### 2026-08-15 - Start Administration Sprint

- Defined the Administration implementation plan.
- Selected User Account Management as the first Admin feature.

### 2026-08-15 - User Account Management

- Added UserAccountRecord shared model.
- Added user roles and statuses.
- Added User CRUD API.
- Added User Management frontend.
- Added activate/deactivate functionality.

### 2026-08-15 - Roles & Permissions

- Corrected system roles to Administrator, Relief Coordinator and Affected User.
- Added shared permission definitions.
- Added default role-permission mappings.
- Created Roles & Permissions page.
- Added role home-page configuration.

### 2026-08-15 - Relief Organisation Management

- Added ReliefOrganisationRecord.
- Added Organisation CRUD backend.
- Added Organisation Management frontend.
- Added organisation status management.

### 2026-08-15 - System Activity Logs

- Added ActivityLogRecord.
- Added Activity Log repository and API.
- Added Activity Logs frontend.
- Connected logging to Disaster, Shelter, Relief Service, User and Organisation actions.
- Added specific status-change log entries.

### 2026-08-15 - Admin Reports

- Created Admin Reports page.
- Added summary information for users, disasters, shelters, relief services and organisations.

### 2026-08-15 - Admin Dashboard

- Created Admin Dashboard.
- Added system summary cards.
- Added Administration navigation.

### 2026-08-15 - Role-Based Layout Refactor

- Separated Admin and Relief Coordinator pages.
- Created AdminLayout.
- Created ReliefCoordinatorLayout.
- Prepared Affected User area for teammate integration.
- Added temporary development login and logout flow.

### 2026-08-15 - Local Testing Complete

- npm run typecheck passed.
- npm run lint passed.
- npm run build passed.
- Admin workflows tested successfully.
- Relief Coordinator workflows tested successfully.
- Role-based navigation tested successfully.

---

## Remaining Work

The Administration functionality is complete locally.

Remaining integration tasks:

1. Receive the team's final DynamoDB configuration.
2. Replace temporary User repository with DynamoDB.
3. Replace temporary Organisation repository with DynamoDB.
4. Replace temporary Activity Log repository with DynamoDB.
5. Replace temporary development login with the team's final authentication system.
6. Use the authenticated user's stored role for routing.
7. Add backend permission checks where required.
8. Merge teammates' Relief Coordinator and Affected User functionality.
9. Test the integrated application.
10. Deploy using the team's selected AWS compute service.

---

## Sprint Status

**Local Administration Implementation:** Complete

**Local Role-Based Structure:** Complete

**Automated Activity Logging:** Complete

**Testing:** Passed

**DynamoDB Integration:** Pending team AWS infrastructure

**Authentication Integration:** Pending shared team authentication

**Team Merge:** Pending