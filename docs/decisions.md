# Decision Log

> Append-only. Each entry is an Architecture Decision Record (ADR).
> Never edit past entries — add new ones when decisions change.

## Format

```
### [YYYY-MM-DD] Decision title
**Context:** Why this choice was needed
**Decision:** What was chosen
**Alternatives:** What was ruled out and why
**Consequences:** What this enables or constrains
```

---

### [Project Start] Feature-based folder structure

**Context:** Type-based folders (components/, hooks/, utils/) become unnavigable past ~20 files  
**Decision:** Organize by domain: `src/features/{domain}/`, shared code in `src/shared/`  
**Alternatives:** Type-based flat folders — ruled out because they scatter one feature across many folders  
**Consequences:** Each feature is self-contained; new developers find everything for a domain in one place

### [2026-08-11] Full-stack TypeScript monorepo for AWS deployment

**Context:** The assignment requires a responsive frontend, backend logic, AWS cloud database operations, and deployment through Elastic Beanstalk or EC2.
**Decision:** Use npm workspaces with React/Vite frontend, Express TypeScript backend, shared TypeScript contracts, and DynamoDB as the AWS database.
**Alternatives:** A single Express-rendered app was ruled out because it would weaken frontend/backend separation; RDS was ruled out for the base because it requires more setup before teams know their data model.
**Consequences:** The project starts with clear ownership, typed contracts, a demonstrable CRUD workflow, and deployment paths for both approved AWS compute options.

### [2026-08-13] Reserve resource stock when a distribution is scheduled

**Context:** Student 3 distribution records must never promise more relief stock than the inventory currently holds, and cancellations must not permanently consume supplies.
**Decision:** Creating a distribution atomically validates and reserves its quantity in the resource repository. Planned distributions may advance to in transit or cancel, in-transit distributions may deliver or cancel, cancellation restores stock, and delivered or cancelled records are terminal.
**Alternatives:** Deducting stock only at delivery was ruled out because multiple planned dispatches could over-allocate the same inventory; unrestricted status changes were ruled out because they could restore or consume stock more than once.
**Consequences:** Available quantities remain trustworthy during planning, invalid transitions return explicit conflict errors, and the same invariant can later be implemented as a DynamoDB transaction.

### [2026-08-13] Keep an immutable emergency-case status timeline

**Context:** Affected users must understand request progress while coordinators need accountable review, assignment, and response records.
**Decision:** Emergency cases move forward through submitted, under review, assigned, in progress, and resolved states. Each status change appends an actor, timestamp, and optional note to immutable history; resolved and cancelled cases are terminal. Requester identity is checked on affected-user edits and cancellation.
**Alternatives:** Storing only the current status was ruled out because it cannot explain how or when a case progressed; unrestricted transitions were ruled out because they weaken accountability and can create contradictory public status.
**Consequences:** The frontend can show an audit-friendly timeline, invalid transitions return explicit conflict errors, and the history can later be persisted as DynamoDB list data or separate event records.

### [2026-08-13] Aggregate Student 3 metrics behind a report endpoint

**Context:** Student 3 shares reporting responsibility, but resource, distribution, profile, and emergency data have separate feature ownership and will later move from local repositories to DynamoDB.
**Decision:** A dedicated Student 3 operational report repository reads each feature through its public repository functions and returns one typed aggregate containing inventory, distribution, affected-user, and emergency-case metrics.
**Alternatives:** Calculating metrics only in the browser was ruled out because it would duplicate business rules and require downloading every record; coupling the report directly to in-memory arrays was ruled out because it would prevent a clean storage migration.
**Consequences:** The frontend consumes a stable reporting contract, repository storage can change independently, and the final shared dashboard can compose this report with Student 1 and Student 2 metrics.
