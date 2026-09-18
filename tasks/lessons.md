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

### 2026-09-18 - Do not treat an empty AWS lookup under stale credentials as proof of absence

**Problem:** An Elastic Beanstalk lookup made with a cancelled AWS Academy CLI session appeared empty, leading to the incorrect conclusion that no existing healthy environment was present.
**Rule:** Before declaring an AWS resource absent, confirm the temporary session permits the relevant describe operation, refresh expired Academy credentials, and repeat the exact resource lookup in the agreed region.
**Why:** Reusing a healthy shared environment is safer and faster than creating duplicate infrastructure, and stale sessions can provide misleading or incomplete results.

### 2026-09-18 - Use the AWS Academy LabRole

**Problem:** The initial Task 2 implementation plan referred generally to IAM roles even though this lab provides a fixed LabRole.
**Rule:** For this project, infrastructure must reference the supplied LabRole and must not create or modify IAM roles unless the user explicitly authorizes it.
**Why:** AWS Academy lab permissions are controlled by the course environment, and an unnecessary custom role can make deployment fail.
### 2026-09-18 - Bundle Lambda dependencies in CommonJS when they use dynamic Node loading

**Problem:** The emergency Lambda's ES-module bundle failed at startup because a bundled dependency dynamically required Node's `fs` module, which esbuild's ESM compatibility shim does not support.
**Rule:** Build this Node.js Lambda entry point as a CommonJS `.js` bundle and test the exact artifact with Node before uploading it to Lambda.
**Why:** Lambda must load the handler before any API route can run; a valid TypeScript build does not prove an ESM bundle is compatible with all runtime dependencies.

### 2026-09-18 - Declare the Lambda proxy invocation method explicitly

**Problem:** The HTTP API Lambda proxy integration omitted `IntegrationMethod`, leaving the deployed API returning a generic HTTP 500 even after the missing handler package was corrected.
**Rule:** Set `IntegrationMethod: POST` explicitly on API Gateway version 2 Lambda proxy integrations and inspect the deployed integration before behavioral testing.
**Why:** A valid Lambda artifact still cannot serve requests when API Gateway's invocation configuration is incomplete or ambiguous.

### 2026-09-18 - Package Lambda handlers from source, not ignored build output

**Problem:** The first SAM package used a handler under `apps/backend/dist`, but SAM's npm packaging omitted the Git-ignored `dist` directory and deployed a function with no handler module.
**Rule:** Bundle TypeScript Lambda entry points directly with SAM esbuild metadata and verify the exact built handler exists before deployment.
**Why:** A successful SAM build and CloudFormation deployment do not prove the runtime handler was included; a missing handler causes every API request to fail before application code runs.

### 2026-09-18 - Verify handed-over AWS identifiers against the live account

**Problem:** Looth's handover listed HTTP API ID `1v1tngew79`, but the live AWS account contains `ddac-disaster-relief-api` under ID `1v1tnqew79`.
**Rule:** Confirm every handed-over AWS identifier with a read-only CLI lookup before embedding it in infrastructure or frontend configuration.
**Why:** A one-character resource-ID error causes deployment references and frontend requests to target a nonexistent API.

### 2026-09-17 - Integrate with handed-over shared AWS resources

**Problem:** The first Task 2 SAM design implicitly created a second HTTP API before Looth's handover identified the team's existing API, stage, CORS configuration, region, and monitoring foundation.
**Rule:** Before deploying a teammate-owned microservice, reconcile its infrastructure template with the latest handover and reference shared resource identifiers instead of creating duplicates.
**Why:** Duplicate APIs split routes, monitoring evidence, and frontend configuration and can break the architecture the team agreed to demonstrate.

### 2026-09-17 - Do not create IAM resources in the AWS Academy account

**Problem:** The initial Task 2 SAM template generated a Lambda execution role and policies even though the team's restricted AWS Academy student account does not provide IAM administration.
**Rule:** For this course deployment, reference the existing Academy `LabRole` and avoid CloudFormation resources or SAM policy shortcuts that create or modify IAM roles and policies.
**Why:** IAM creation will be denied in the student lab and would prevent the otherwise supported Lambda, API Gateway, DynamoDB, SQS, CloudWatch, and X-Ray resources from deploying.

### 2026-09-14 - Verify new Lambda imports with repository lint

**Problem:** The first lint pass found two unused imports in the new emergency-request Lambda handler.
**Rule:** Run repository lint after adding a new source boundary and remove imports that are not used before considering the implementation verified.
**Why:** Unused imports obscure the ownership of a new serverless entry point and fail the project’s CI quality gate.

### 2026-09-14 - Leave Lambda reserved environment variables to AWS

**Problem:** The first SAM template review attempted to set `AWS_REGION` as a function environment variable even though Lambda provides it automatically.
**Rule:** Keep AWS-managed Lambda environment variables out of custom SAM environment blocks and let the runtime expose them.
**Why:** CloudFormation can reject reserved variables and block deployment before the application is tested.

### 2026-09-14 - Keep serverless handlers independent from Express routes

**Problem:** The Lambda handler imported an Express route module only to reuse generic error normalization.
**Rule:** Keep serverless entry points dependent on shared domain code and serverless-safe utilities, not on monolith route modules.
**Why:** This keeps the Lambda bundle smaller and makes the microservice boundary explicit and independently deployable.

### 2026-09-14 - Validate Lambda runtimes against current AWS rules

**Problem:** SAM lint identified Node.js 20 as deprecated for Lambda and a redundant log-group dependency in the first Task 2 template.
**Rule:** Run current SAM lint before deployment, use an AWS-supported Lambda runtime, and remove dependencies already implied by intrinsic references.
**Why:** Runtime lifecycle changes and redundant dependencies can block deployment or create avoidable maintenance warnings even when application tests pass.

### 2026-08-16 - Restore lint as soon as the user asks for it

**Problem:** Linting had previously been skipped by user direction, leaving unused imports and unused destructuring variables in the integrated code.
**Rule:** When the user later asks to fix linting, run the full repository lint gate immediately and resolve every reported issue before handing back.
**Why:** A skipped validation gate can hide small integration cleanup issues that block CI or a clean merge later.

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
