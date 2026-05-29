# Architecture

> Immutable reference. Describes what was chosen and why.
> Update only when the stack fundamentally changes — add, don't rewrite.

## Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | | |
| Backend | | |
| Database | | |
| Auth | | |
| Testing | | |
| CI/CD | | |
| Deploy | | |

## Folder Structure

> Describe `src/` layout here once decided.
> Default: feature-based — `src/features/{domain}/` with `src/shared/` for cross-cutting concerns.

```
src/
├── features/
│   └── {domain}/         # One folder per business domain
├── shared/               # Utilities, types, hooks used across features
└── ...
```

## Key Patterns

- **State management:**
- **Data fetching:**
- **Error handling:**
- **Validation:**
- **Auth:**

## External Services

| Service | Purpose | Docs URL |
|---------|---------|----------|
| | | |
