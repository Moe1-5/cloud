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
