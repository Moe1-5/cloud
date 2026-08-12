# Sprint 04 - Resource Distribution and Relief Activities

**Goal:** Record resource movements and give coordinators a clear operational view of ongoing relief activities.
**Owner:** Student 3
**Start:** 2026-08-13
**End:** [Date]

---

## In Progress

- [ ] Investigate why the mobile browser check did not find the newly scheduled distribution after the API returned HTTP 201

## Todo

- [x] Define distribution and relief-activity contracts
- [x] Record dispatched quantities, origin, destination, recipient, and timestamps
- [x] Track planned, in-transit, delivered, and cancelled distributions
- [x] Adjust available inventory through validated distribution operations
- [x] Create distribution history and filtering UI
- [x] Create ongoing relief-activity overview and status indicators
- [x] Add API behavior tests
- [ ] Complete responsive frontend browser verification

## Out of Scope

- Victim assistance history owned by Student 2
- Food-distribution location publishing owned by Student 1

## Session Log

### 2026-08-13 - Implement distribution and relief-activity operations

- What changed: Added shared distribution and relief-activity contracts, validated distribution and activity API routes, immutable inventory reservation and cancellation restoration, guarded status transitions, eight total backend tests, a typed frontend client, distribution scheduling and filtering UI, status actions, and an operational activity timeline.
- Why: Student 3 owns resource distribution tracking and monitoring of ongoing relief activities.
- Status: Typecheck, lint, eight automated tests, and the production build pass. Browser verification was not repeated because Sprint 3 has an unresolved mobile-overflow finding and repository policy requires a separate explicitly authorised fix session.

### 2026-08-13 - Verify the mobile distribution layout

- What changed: Confirmed that the distribution workspace, scheduling form, register, and navigation stay within a 390-pixel viewport after the shared responsive CSS fix.
- Why: Distribution controls must remain usable on a phone-sized browser even though the product is a website rather than a native mobile application.
- Status: The layout check passed. The test submitted a distribution and the API returned HTTP 201, but the expected new card was not found by the browser assertion, so the pass stopped before status-transition checks and the verification item remains open.

---

> When done: archive only after the user explicitly says "close sprint 4".
