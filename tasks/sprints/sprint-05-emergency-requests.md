# Sprint 05 - Public Emergency Requests and Case Management

**Goal:** Let affected users manage emergency requests and let relief coordinators review, assign, prioritise, and update those cases.
**Owner:** Student 3
**Start:** 2026-08-13
**End:** [Date]

---

## In Progress

- [ ] Consume Student 1 disaster and relief-information records after the team explicitly merges that integration
- [ ] Complete responsive browser verification after the earlier distribution delivery-transition finding is handled in a separate fix session

## Todo

- [x] Define public profile and emergency-request contracts
- [x] Build affected-user registration/profile screens within the shared auth boundary
- [ ] Provide a public disaster-and-relief information view that can consume Student 1 data
- [x] Submit, update, and cancel appropriate emergency requests
- [x] View request status and history
- [x] Review and prioritise incoming requests
- [x] Assign responsible relief personnel
- [x] Update emergency-case status with an audit-friendly timeline
- [x] Add API behavior tests
- [ ] Complete responsive frontend browser verification - not reached after the distribution delivery check stopped the linear pass

## Integration Notes

- Final login/authentication is shared across all three students and remains a Sprint 6 integration item.
- Disaster and relief-information publishing remains owned by Student 1; this sprint consumes those records without duplicating ownership.

## Session Log

### 2026-08-13 - Implement affected-user and coordinator emergency workflows

- What changed: Added shared affected-user profile and emergency-request contracts, validated profile and request APIs, ownership and edit-status enforcement, coordinator transition rules, immutable status history, fourteen total backend tests, typed frontend clients, profile registration and management, request submission and updates, public status timelines, and coordinator review, priority, assignment, response, and resolution views.
- Why: Student 3 owns public-user functions, emergency requests, and emergency-case assignment and status.
- Status: Typecheck, lint, fourteen automated tests, and the production build pass. Student 1 public information remains an explicit integration boundary and browser verification remains deferred by the unresolved Sprint 3 mobile finding.

---

> When done: archive only after the user explicitly says "close sprint 5".
