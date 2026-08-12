# Docs Index

> Docs-only sub-index. The master file map for the whole repo is the root `INDEX.md`;
> this file routes within `docs/` only.
> Claude reads this to route to the right file without scanning all docs.
> Update this table whenever a doc is added, removed, or changes scope.

| Topic                                  | File                  | What's inside                                                                           |
| -------------------------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| Tech stack, folder structure, patterns | `architecture.md`     | Framework choices, feature layout, resource, distribution, and emergency-case patterns  |
| Decision log (ADR)                     | `decisions.md`        | Append-only record of architectural, inventory-ledger, and emergency-workflow decisions |
| AWS deployment                         | `aws-deployment.md`   | DynamoDB, Elastic Beanstalk, and EC2 deployment steps                                   |
| Student 3 integration handoff          | `student3-handoff.md` | Implemented scope, API surface, verification, dependencies, and merge guidance          |

---

> To add a new doc:
>
> 1. Create the file in `docs/`
> 2. Add a row to this table with topic, filename, and one-line description
> 3. This keeps Claude from having to guess which file covers what
