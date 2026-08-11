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
