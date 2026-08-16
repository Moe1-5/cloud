# Lessons

> Append-only. Never delete entries.
> After any correction from the user — add to `## Active` immediately.
> When a lesson hasn't been violated in 2+ sprints, move it to `## Internalized`.

## Format

```
### [YYYY-MM-DD] Short title
**Problem:** What went wrong
**Rule:** The rule to prevent it
**Why:** The reason this matters
```

---

## Active

> Lessons that still need active enforcement. Claude reads these with full attention.

<!-- Add new lessons here -->

### 2026-08-13 - Keep temporary browser artifacts outside lint scope

**Problem:** A local Chrome profile under the ignored `tmp/` directory caused ESLint to analyze generated browser-extension files instead of only repository source and tooling files.
**Rule:** Keep generated test-artifact exclusions aligned between `.gitignore` and the ESLint global ignore list before running repository-wide lint.
**Why:** Browser profiles contain third-party generated JavaScript that is not owned by the project and can obscure the actual lint result.

### 2026-08-16 - Validate integrated screens against the local runtime

**Problem:** Branch integration combined pages that depended on a shared styling vocabulary without including all of its layout rules, and one feature still required unavailable AWS credentials during local live testing.
**Rule:** After integrating a feature branch, validate each role's first-load experience against the local development runtime and make repository choices explicit: use a local repository for local workflows or configure the required external service.
**Why:** A type-safe merged build can still render an unstructured interface or fail at runtime when assumptions about styling and infrastructure are incomplete.

### 2026-08-16 - Do not overlap dashboard content with decorative heroes

**Problem:** A shared hero treatment combined with negative content margins caused the dashboard metrics to render underneath the hero instead of in a clear reading order.
**Rule:** Keep page heroes compact and let the primary content begin below them with an explicit positive gap unless an overlapping layout has been visually checked at the target viewport.
**Why:** A page can have valid spacing rules in isolation but still look broken when a large hero obscures the most important dashboard information.

### 2026-08-16 - Keep role navigation below the page hero

**Problem:** The role heading and navigation were rendered by the shared layout before the selected page, placing them above every page hero.
**Rule:** When pages use a hero as their visual entry point, render the role-specific navigation immediately after the selected page so the hero remains the first page section.
**Why:** The navigation should support the active workspace without competing with the page title or breaking the intended top-to-bottom hierarchy.

### 2026-08-16 - Remove legacy offsets when changing shared page structure

**Problem:** Moving role navigation below page heroes left older workspace-specific negative margins in place, causing report and operational content to overlap the new navigation band.
**Rule:** When changing a shared page hierarchy, audit every descendant workspace for negative margins, transforms, absolute positioning, and inline offsets before declaring the layout complete.
**Why:** A correct component order can still render incorrectly when legacy positioning rules pull later sections back over newly inserted content.

---

## Internalized

> Lessons that are no longer being violated. Kept for reference, not daily enforcement.

<!-- Lessons migrate here from Active when they've been consistently followed -->
