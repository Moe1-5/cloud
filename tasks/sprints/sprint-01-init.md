# Sprint 01 - Init

**Goal:** Initialize project and scaffold core structure  
**Start:** 2026-08-11
**End:** [Date]

---

## In Progress

- [x] Scaffold full-stack TypeScript application base

## Todo

- [ ] Implement authentication and role-based access when project roles are finalized
- [ ] Replace starter project records with the team's actual business domain

## Done

- [x] Initialize project from starter template
- [x] Add React/Vite frontend workspace
- [x] Add Express/TypeScript backend workspace
- [x] Add shared TypeScript contracts package
- [x] Add DynamoDB CRUD repository and routes
- [x] Add AWS deployment base for Elastic Beanstalk and EC2
- [x] Add CI validation pipeline

---

## Session Log

> Append one dated entry per implementation session (hook-enforced - see `CLAUDE.md`).
> Newest entries at the bottom. Format:
>
> ```markdown
> ### YYYY-MM-DD - <one-line summary>
>
> - What changed: <files/components modified>
> - Why: <reason or test failure that prompted the work>
> - Status: <what's now working / what's still open>
> ```

### 2026-08-11 - Scaffold AWS full-stack base

- What changed: Added npm workspace packages for frontend, backend, shared contracts, DynamoDB infrastructure, deployment files, CI, env template, and AWS documentation.
- Why: The Task 1 assignment requires a responsive web app, backend logic, AWS cloud database CRUD operations, and deployment on Elastic Beanstalk or EC2.
- Status: Lint, typecheck, backend test, and production build pass; authentication and final business domain remain future work.

### 2026-08-11 - Prepare repository for GitHub push

- What changed: Added line-ending normalization, cleaned trailing whitespace, refreshed the project index, and prepared the working tree for a local commit.
- Why: The repository should be clean and predictable before pushing to GitHub.
- Status: Git whitespace checks pass; the next step is pushing the prepared commit to the intended GitHub remote.

### 2026-08-14 - Start Student 2 assignment modules

- What changed: Created victim and volunteer sprints and connected their frontend, backend, shared contracts, and DynamoDB workflows to the scaffold.
- Why: Sprint 1 remains the lowest-numbered active sprint, while the workload matrix defines Student 2's role as victim and volunteer management.
- Status: Both Student 2 modules are implemented; local verification and deployed AWS integration remain open.

### 2026-08-14 - Prepare Student 2 sprints for completion

- What changed: Corrected victim and volunteer update persistence so optional API fields cannot overwrite required record fields with undefined values.
- Why: The first quality-gate pass identified strict TypeScript failures in both update repositories.
- Status: The known compile defect is corrected; the full verification gate is pending before sprint closure.

### 2026-08-14 - Resolve Student 2 strict update typing

- What changed: Replaced dynamically filtered update spreads with explicit field fallbacks in both Student 2 repositories.
- Why: TypeScript could not prove that the filtered mapped objects excluded undefined values from required record fields.
- Status: Required record fields are now preserved explicitly; fresh verification is pending.

### 2026-08-16 - Attempt branch merge-readiness validation

- What changed: Ran the first CI-equivalent validation gate on `feature/student-3-resource-emergency`; no application source or branch history was changed.
- Why: The branch needs a clean validation result before it is merged with teammate work.
- Status: Validation stopped before ESLint started because PowerShell blocked `npm.ps1` under the current execution policy. Typecheck, automated tests, production build, and merge-conflict assessment were not run in accordance with the repository's single-pass testing protocol.

### 2026-08-16 - Move integrated backend repositories to dynamic storage

- What changed: Created `feature/dynamic-dynamodb-backend` from latest `main`, added a shared DynamoDB repository helper, converted backend feature repositories from hardcoded arrays to table-backed records, adjusted tests to create records through APIs, and silenced the backend TypeScript `baseUrl` deprecation warning with the project-supported setting.
- Why: The integrated system still used hardcoded sample records and memory-only arrays across most backend modules, so user-created data would disappear after restart and AWS configuration would not persist full-system data.
- Status: Backend typecheck, backend tests, and backend build pass; production runtime now requires DynamoDB table and AWS credentials or a configured local DynamoDB endpoint outside Vitest.

### 2026-08-16 - Align runtime configuration to a single root env file

- What changed: Updated backend env loading to read the repository-root `.env`, updated Vite to load root env values and derive its proxy target from `VITE_API_BASE_URL`, `APP_URL`, or `APP_PORT`, and clarified `.env.example` as the single root env template.
- Why: The project only maintains one root env template, but backend dotenv loading and frontend proxy configuration previously assumed app-local or hardcoded settings.
- Status: Root typecheck, backend tests, and production build pass; local DynamoDB could not be verified because port 8000 is currently a Uvicorn service returning 404 and Docker/AWS CLI are not installed on this machine.

### 2026-08-16 - Add real authentication and repository cleanup audit

- What changed: Added backend password hashing, signed auth tokens, bootstrap admin login, authenticated API middleware, frontend email/password login, stored session handling, authorization headers, user password management, auth tests, and index entries for the new auth files.
- Why: The integrated frontend still used role-button development login and protected data routes did not require a real session.
- Status: Root typecheck, backend tests, and production build pass; lint remains skipped by user direction. Cleanup audit found large ignored/generated folders under `tmp/`, `node_modules/`, and build `dist/` outputs, but no source folders were deleted during the auth change.

### 2026-08-16 - Clarify frontend login routing

- What changed: Added explicit frontend path replacement so unauthenticated users land on `/login`, logout returns to `/login`, and authenticated users are sent to a role-specific path after sign-in.
- Why: An old Student 3 dev server could render protected workspaces at `/login`, making it unclear which branch and route were active.
- Status: Root typecheck, backend tests, and production build pass; the auth-enabled app must be run from `tmp/main-merge-20260816` on `feature/dynamic-dynamodb-backend`.

### 2026-08-16 - Fix repository lint failures

- What changed: Removed unused backend error imports, removed an unused volunteer lookup helper, made object-rest omission variables explicitly consumed, and used the frontend request helper's `skipAuth` option directly.
- Why: The user requested linting to be fixed after the earlier lint skip, and ESLint reported 11 unused-variable errors across backend repositories and the shared request helper.
- Status: Lint passes. Typecheck passes. All 19 backend tests pass. The production build passes when run outside the sandbox to avoid the known Vite config read restriction.

### 2026-09-18 - Add Task 2 serverless people-service foundation

- What changed: Added the Victim/Volunteer Lambda HTTP adapter, SQS event processor, SNS publisher, API Gateway and LabRole CloudFormation template, deployment evidence guide, environment configuration, and handler tests.
- Why: Student 2 needs the approved Task 2 serverless microservice while preserving the existing Task 1 frontend routes, validation, and DynamoDB repository.
- Status: Typecheck, lint, and all 21 backend tests pass with a test-only valid JWT secret. AWS Academy deployment and CloudWatch/DynamoDB evidence remain pending.

### 2026-09-18 - Prepare Task 2 AWS deployment

- What changed: Verified the AWS Academy default profile, LabRole, us-east-1 DynamoDB table, and an available S3 bucket. Added a repeatable Lambda packaging script and ignored generated deployment artifacts.
- Why: The Task 2 Lambda artifact must contain compiled backend code and production dependencies before it can be uploaded and deployed with LabRole.
- Status: Backend compilation completed. Production dependency installation into the generated artifact was blocked by the Codex service usage limit before any AWS resource was created.

### 2026-09-18 - Diagnose first Task 2 CloudFormation deployment

- What changed: Uploaded the packaged Lambda artifact to the AWS Academy S3 deployment bucket and inspected the failed stack event history.
- Why: CloudFormation rolled back because Lambda reserves `AWS_REGION`; Lambda provides that value automatically, so the template must not configure it.
- Status: The failed stack is rolling back. The template now removes the unsupported setting; clean recreation and deployed-service verification remain pending.

### 2026-09-18 - Deploy Task 2 Victim/Volunteer serverless service

- What changed: Uploaded the Lambda ZIP to the AWS Academy S3 bucket and deployed `g28-victim-volunteer-serverless` in us-east-1 with API Gateway, two LabRole Lambda functions, DynamoDB configuration, SNS, SQS, a three-receive DLQ policy, CloudWatch, and X-Ray.
- Why: Student 2's Task 2 work requires a deployed serverless Victim/Volunteer microservice with messaging, resilience, and observability evidence.
- Status: Stack creation completed. A deployed unauthenticated API call returned the expected 401 response and logged its request ID, duration, and X-Ray trace. SNS-to-SQS subscription and DLQ configuration are verified. Authenticated data and assistance-event tests remain pending shared JWT alignment and a valid coordinator token.

### 2026-09-18 - Prepare approved shared API Gateway migration

- What changed: Replaced the dedicated API Gateway and broad `ANY` routes in the Task 2 CloudFormation template with explicit HTTP routes targeting the team-owned shared API Gateway through a `SharedApiId` parameter.
- Why: The Cloud Platform handover confirms `ddac-disaster-relief-api` is the sole shared HTTP API; Student 2 must integrate routes there rather than retain a duplicate gateway.
- Status: Looth approved the migration. AWS Academy currently returns an explicit `voc-cancel-cred` deny for API Gateway operations, so the live stack update is pending refreshed service credentials.

### 2026-09-18 - Validate shared-route compatibility

- What changed: Updated the Lambda handler to decode frontend URL-encoded IDs before route dispatch and added a regression test for encoded victim update paths. Excluded generated Lambda package artifacts from ESLint.
- Why: Existing frontend requests encode `victim#` IDs as `victim%23`; API Gateway forwards the raw path, which requires decoding before existing validation can be reused.
- Status: Typecheck, three Task 2 serverless handler tests, lint, and whitespace checks pass. Live shared-API deployment remains blocked until refreshed AWS Academy service credentials remove the `voc-cancel-cred` deny.

### 2026-09-18 - Migrate Task 2 routes to the team shared API

- What changed: Updated the Task 2 stack to use the live `ddac-disaster-relief-api` ID, attached all eight explicit victim/volunteer routes to its Lambda integration, reused the Elastic Beanstalk JWT secret, and removed the duplicate dedicated API Gateway. Added both Task 2 Lambda functions to the shared CloudWatch dashboard.
- Why: Looth approved the integration and the team handover requires one shared API Gateway, shared authentication, and final Lambda monitoring.
- Status: CloudFormation update completed. An authenticated shared API `GET /api/victims` request returned 200 and DynamoDB records. Dashboard validation passed. SNS-to-SQS/DLQ success and controlled-failure evidence remain for final testing.

### 2026-09-18 - Refresh deployed Task 2 Lambda code

- What changed: Updated both deployed Task 2 Lambda functions from the current S3 deployment ZIP after detecting that CloudFormation had retained an earlier package because the S3 object key did not change.
- Why: The deployed function hash did not match the latest package hash, which meant the shared-route compatibility update was not yet live.
- Status: `victim-volunteer-service` and `victim-volunteer-event-processor` are Active, report successful updates, and both match the current deployment ZIP hash.
### 2026-08-17 - Create Student 2 and Student 3 presentation scripts
- What changed: Added a Word document containing recording scripts, browser routes, source-code locations, and AWS Console demonstration paths for Student 2 and Student 3.
- Why: The team needs a clear, shareable guide for the required role-based video presentation.
- Status: The DOCX archive structure and required Student 2 and Student 3 sections were validated. Visual rendering could not run because LibreOffice is not installed on this machine.

### 2026-09-14 - Implement Mohamed Musleh’s Task 2 emergency serverless workflow

- What changed: Added an API Gateway-compatible emergency-request Lambda, signed-token ownership and role checks, SQS notification publishing with a dead-letter queue, request ID and latency logging, React API Gateway configuration, AWS SAM infrastructure, focused Lambda tests, and deployment/evidence documentation.
- Why: Task 2 assigns Mohamed Musleh the emergency or resource serverless workflow, frontend integration, AWS supporting-service integration, monitoring, testing, and performance evidence.
- Status: Typecheck, lint, all 22 backend tests, and the production build pass. Real AWS deployment, CloudWatch/X-Ray evidence, equivalent Task 1 versus Task 2 performance measurements, diagrams, report, video, and submission packaging remain manual team work.

### 2026-09-14 - Prepare the Task 2 workflow for AWS Academy handoff

- What changed: Ignored generated SAM build artifacts, documented the Learner Lab temporary-credential process, recorded the cross-account DynamoDB and JWT limitation, and updated the current architecture state.
- Why: The available AWS account is a separate AWS Academy student lab, while Task 1 resources were created in a teammate's account, and the standard AWS CLI browser login returned a bad request.
- Status: Local SAM validation and build are complete. Deployment is waiting for locally configured Learner Lab temporary credentials and confirmation that the active account contains, or will recreate, the Task 1 table and authentication data.

### 2026-09-17 - Adapt Task 2 deployment to restricted Academy IAM access

- What changed: Removed SAM-generated IAM policies and role creation, configured the emergency Lambda to reuse the existing Academy `LabRole`, and corrected the deployment guide.
- Why: The team's AWS Academy student account does not provide IAM administration, so generated execution roles would fail during CloudFormation deployment.
- Status: The stack creates no IAM resources. SAM validation and build are pending after this template correction.

### 2026-09-17 - Align Musleh's stack with Looth's AWS handover

- What changed: Pointed the Task 2 stack at the existing us-east-1 HTTP API, added six explicit emergency routes and their Lambda integration, standardized the Lambda and SQS names, retained the Academy LabRole, and updated the environment and deployment documentation.
- Why: Looth already created the shared API, default auto-deploy stage, CORS configuration, dashboard, alarm, and SNS topic; Musleh's stack must extend that foundation without duplicating it.
- Status: Local configuration is aligned with the handover, SAM lint validation passes, and the deployment package builds successfully. AWS inspection and deployment remain blocked until fresh Learner Lab CLI credentials are configured.

### 2026-09-18 - Verify Looth's live AWS resources

- What changed: Corrected the shared HTTP API ID from the handover's `1v1tngew79` to the live account's `1v1tnqew79` in the SAM template, environment example, and deployment guide.
- Why: Read-only AWS checks confirmed the Academy credentials, active `ddac-projects` table, and dashboard, but found a one-character API ID mismatch in the handover.
- Status: The correct Looth account and us-east-1 resources are now identified. Stage, CORS, routes, table entity types, and the corrected build still require verification before deployment.

### 2026-09-18 - Deploy Musleh's AWS stack and run the first system check

- What changed: Renamed the local AWS credential file correctly, verified Looth's live account and shared resources, reused the deployed Task 1 JWT secret without exposing it, and deployed the `ddac-task2-emergency` CloudFormation stack with Musleh's Lambda, SQS queue, dead-letter queue, log group, API integration, and six routes.
- Why: Musleh's remaining AWS work required extending Looth's shared us-east-1 API and DynamoDB foundation without duplicating the API, IAM role, stage, CORS, dashboard, alarm, or SNS topic.
- Status: CloudFormation is `CREATE_COMPLETE`; Lambda uses Node.js 24, `LabRole`, and active X-Ray tracing; all six routes and both queues exist. The first behavioral check failed because unauthenticated `GET /emergency-requests` returned HTTP 500 instead of the expected structured HTTP 401, so the system-test pass stopped before authenticated DynamoDB/SQS, frontend, metrics, and evidence checks.

### 2026-09-18 - Correct Lambda packaging and draft Musleh's report

- What changed: Diagnosed the deployed 500 as a missing packaged handler, added a dedicated esbuild Lambda bundle and generated-output lint exclusions, prepared the live-API frontend build, and added Musleh's report, performance table, evidence register, and reflection draft.
- Why: SAM's original npm package omitted the Git-ignored backend `dist` directory even though infrastructure deployment succeeded, and the requested submission documentation needed to distinguish verified evidence from pending measurements.
- Status: The exact 1.6 MB production handler bundle loads successfully; typecheck and lint pass; all 22 backend tests pass; and the frontend production build passes with the live API URL. Corrected AWS redeployment, end-to-end verification, frontend Elastic Beanstalk deployment, final evidence, and measured report values are waiting for the Learner Lab to be restarted and its temporary credentials refreshed.

### 2026-09-18 - Redeploy the corrected handler and stop on the remaining API failure

- What changed: Refreshed the Academy session, updated only the Lambda package and API integration in the existing stack, and ran the first post-fix behavioral check.
- Why: The original deployed package lacked the handler; the corrected 1.6 MB production bundle needed cloud verification before authenticated or frontend testing.
- Status: CloudFormation reached `UPDATE_COMPLETE`, but unauthenticated `GET /emergency-requests` still returned API Gateway HTTP 500 instead of the expected structured HTTP 401. In accordance with the one-pass system-testing protocol, authenticated DynamoDB/SQS checks, frontend deployment, final evidence, and commit/push remain stopped pending a separate diagnostic/fix request.

### 2026-09-18 - Generate Musleh's Word report and diagnose the remaining API integration failure

- What changed: Generated and validated `docs/Musleh_Task_2_Report.docx`, expanded the Markdown source with an evidence-based diagnostic section, set the HTTP API Lambda proxy `IntegrationMethod` explicitly to `POST`, rebuilt the SAM artifact, and updated the project state and lesson register.
- Why: The user requested the submission-ready Word contribution before a separate diagnostic of the post-package HTTP 500 response; AWS's Lambda proxy integration example uses `POST`, while the project template had omitted the method.
- Status: The DOCX is a valid OpenXML file and the corrected SAM template validates and builds. The integration-method diagnosis remains an inference until the Academy Learner Lab is restarted, credentials are refreshed, the stack is redeployed, and a new one-pass API check returns the expected structured HTTP 401.

### 2026-09-18 - Fix Lambda ES-module startup incompatibility

- What changed: Changed the emergency Lambda esbuild output from ES module to CommonJS, generated a deployable CommonJS package manifest, made environment loading safe for the Lambda runtime, and updated the diagnostic evidence.
- Why: Lambda console testing reported `Dynamic require of "fs" is not supported` from the bundled `.mjs` artifact, preventing the handler from initializing.
- Status: The exact CommonJS production handler loads successfully with Node.js and SAM builds the deployment artifact successfully. The cloud package still needs deployment before API Gateway, DynamoDB, SQS, and monitoring tests can continue.

### 2026-09-18 - Upload the corrected emergency Lambda package

- What changed: Built a clean CommonJS Lambda zip from the SAM artifact and uploaded it directly to the existing `ddac-emergency-request-function`.
- Why: The deployed ES-module handler failed during initialization with an unsupported dynamic `fs` require, so its runtime code needed replacement without changing the shared API Gateway or other team infrastructure.
- Status: AWS confirmed the function is `Active` and its update status is `Successful`. The initial direct CLI test was rejected before Lambda invocation because the request payload was malformed by shell quoting; per the single-pass testing protocol, the next verification must be one Lambda Console test using the valid unauthenticated event, followed by API Gateway testing only if it returns HTTP 401.

### 2026-09-18 - Align Mehrab's deployed Task 2 Lambda configuration

- What changed: Updated `victim-volunteer-service` and `victim-volunteer-event-processor` from Node.js 20 to Node.js 24, and removed the unused unintegrated `ANY /api/victims` route from the shared HTTP API.
- Why: The integrated submission configuration standardizes both Task 2 services on Node.js 24, and frontend source inspection confirmed that all victim requests use the eight explicit integrated routes rather than the legacy catch-all route.
- Status: Both functions are Active with successful updates and X-Ray tracing enabled. All eight explicit victim/volunteer routes target the shared Lambda integration, and the SQS event-source mapping remains enabled with partial-batch failure reporting. Functional authentication, SNS-to-SQS, DLQ, monitoring, and performance evidence are still pending.

### 2026-09-18 - Deploy Mehrab's integrated Lambda code package

- What changed: Built a recursive Linux-compatible deployment archive from the integrated source, verified it contains `features/people-serverless/handler.js` and `features/people-serverless/worker.js`, and uploaded it to both deployed victim/volunteer Lambda functions.
- Why: The previous deployment archive used Windows path separators and did not expose the nested handler files correctly in Lambda, leaving the console without the expected source structure.
- Status: Both functions are Active, report successful code updates, and share the new deployed code hash. The packaged API handler was verified locally in production mode to return HTTP 401 for a request without a token. The remaining AWS end-to-end authentication, SNS-to-SQS, DLQ, and monitoring evidence must be collected separately.

### 2026-09-18 - Connect the deployed web application to both Task 2 workflows

- What changed: Added a backend-generated runtime configuration endpoint and updated the frontend's emergency-request and victim/volunteer API clients to use the shared API Gateway when `TASK2_API_BASE_URL` is configured. Updated the deployment documentation and sample environment configuration accordingly.
- Why: A browser build-time URL cannot be changed by Elastic Beanstalk after deployment. The runtime configuration lets the same deployed frontend retain the Task 1 backend for login, profiles, reports, and other monolith features, while routing both Task 2 ownership areas to their live Lambda integrations through the one shared API Gateway.
- Status: The complete production build passes and retains the runtime configuration script in the generated frontend. The next step is creating an Elastic Beanstalk environment in the current Learner Lab account, then setting the shared API Gateway URL and matching JWT configuration as environment values.

### 2026-09-18 - Correct Elastic Beanstalk Node.js 24 configuration

- What changed: Removed the obsolete Elastic Beanstalk `NodeVersion: 20` option, added the production build command to the application deployment configuration, and revised the deployment guide for the Node.js 24 Amazon Linux 2023 platform.
- Why: The newly created Node.js 24 environment rejected the old Node 20 setting with `Unknown or duplicate parameter: NodeVersion`. Without a deployment build command, the TypeScript backend and React frontend would also not be present when `npm start` begins.
- Status: The corrected source is ready to upload. The previous environment launch did not complete and should be terminated or recreated only after the AWS Academy credentials permit Elastic Beanstalk configuration access.

---

> When done: move this file to `tasks/archive/sprint-01-init.md`, remove from `tasks/active.md`.
