# Docs Index

> Docs-only sub-index. The master file map for the whole repo is the root `INDEX.md`;
> this file routes within `docs/` only.
> Claude reads this to route to the right file without scanning all docs.
> Update this table whenever a doc is added, removed, or changes scope.

| Topic | File | What's inside |
|-------|------|---------------|
| Tech stack, folder structure, patterns | `architecture.md` | Framework choices, src/ layout, key patterns |
| Decision log (ADR) | `decisions.md` | Append-only record of architectural decisions and their rationale |

---

> To add a new doc:
> 1. Create the file in `docs/`
> 2. Add a row to this table with topic, filename, and one-line description
> 3. This keeps Claude from having to guess which file covers what
