# Musleh Task 2 Report Draft

## Individual scope

Mohamed Mohammed Musleh Mohammed was responsible for converting the affected-user emergency-request workflow into a serverless component. The work covers the API Gateway-compatible Lambda handler, reuse of the Task 1 DynamoDB data model, asynchronous SQS publishing, React integration, authentication and ownership controls, structured logging, X-Ray tracing, end-to-end verification, performance evidence, and the emergency-workflow report section.

## Implemented architecture

The Task 2 path uses Looth's existing `ddac-disaster-relief-api` HTTP API in `us-east-1`. Six emergency-request routes invoke `ddac-emergency-request-function`. The Lambda validates the existing Task 1 bearer token, executes the emergency-request domain rules, reads or writes the existing `ddac-projects` DynamoDB table, and sends an `emergency_request.submitted` event to `ddac-emergency-request-queue` after successful creation. `ddac-emergency-request-dlq` is configured as the queue's dead-letter destination. CloudWatch receives structured invocation logs, and active tracing sends trace data to X-Ray.

```text
React emergency workspace
        |
        v
Existing API Gateway: ddac-disaster-relief-api
        |
        v
Lambda: ddac-emergency-request-function
        |                         |
        v                         v
DynamoDB: ddac-projects   SQS: ddac-emergency-request-queue
                                  |
                                  v
                         ddac-emergency-request-dlq
```

The stack reuses the Academy-provided `LabRole`; it creates no IAM roles or policies. It also leaves Looth's shared API stage, CORS settings, CloudWatch dashboard, alarm, and SNS topic unchanged.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/emergency-requests` | List requests allowed for the authenticated role |
| POST | `/emergency-requests` | Create an affected user's request and publish its SQS event |
| GET | `/emergency-requests/{id}` | Retrieve one permitted request |
| PATCH | `/emergency-requests/{id}` | Edit request details as the owning affected user |
| PATCH | `/emergency-requests/{id}/cancel` | Cancel a request as its owner |
| PATCH | `/emergency-requests/{id}/coordinator` | Apply coordinator assignment, priority, notes, or status changes |

## Security and validation

The Lambda uses the same non-default JWT secret as the Task 1 Elastic Beanstalk backend, allowing existing login tokens to cross the new API boundary. Affected users are matched to profiles by authenticated email and may only create, inspect, edit, or cancel their own requests. Coordinator operations require a relief-coordinator or administrator role. Zod schemas validate route identifiers, query parameters, request creation, edits, cancellations, and coordinator transitions. The secret is held as a CloudFormation `NoEcho` parameter and Lambda environment value and is not committed to the repository.

## SQS integration

After DynamoDB successfully stores a new emergency request, the Lambda publishes a JSON message whose event type is `emergency_request.submitted`. The message identifies the emergency request and contains the data needed for later notification processing. Publishing is asynchronous from future consumers, allowing the request API and notification processing to scale or fail independently. The current assessed boundary includes the producer and queue infrastructure; a separate SQS consumer is an optional extension and must not be described as completed unless implemented and demonstrated.

## Monitoring

Each Lambda invocation records a request ID, method, route, status code, and duration. The response also returns the request ID in a header for correlation. Lambda X-Ray tracing is active. After final verification, Looth should change the shared dashboard's Lambda metric dimension from `MainMonitoringFunction` to `ddac-emergency-request-function` and capture Invocations, Errors, and Duration for the same performance-test window.

## Deployment status

On 18 September 2026, CloudFormation stack `ddac-task2-emergency` reached `CREATE_COMPLETE`. It created the Lambda, API integration, six routes, SQS queue, dead-letter queue, Lambda invoke permission, and thirty-day CloudWatch log group. The first API check returned HTTP 500 because the original SAM package omitted the Git-ignored compiled handler. The packaging configuration was corrected to generate a dedicated 1.6 MB esbuild bundle, the exact production-mode handler loaded successfully, and the corrected package was redeployed with the stack reaching `UPDATE_COMPLETE`. A fresh unauthenticated API request still returned API Gateway HTTP 500 instead of the expected structured HTTP 401.

## Diagnostic findings

| Finding | Evidence | Current conclusion |
| --- | --- | --- |
| Original package did not contain the Lambda handler | Inspection of the generated SAM artifact found the compiled handler missing | Confirmed packaging defect; corrected with a dedicated esbuild bundle and redeployed |
| Corrected ES-module bundle failed during Lambda startup | Lambda console reported `Dynamic require of "fs" is not supported` from the bundled `.mjs` handler | Confirmed compatibility defect; the Lambda is now bundled as CommonJS with a CommonJS package manifest, and the exact production-mode handler loads locally |
| API still fails before returning the application authentication response | A fresh unauthenticated request returned API Gateway's generic HTTP 500 response | A second integration or invocation problem remains |
| Live Lambda configuration, integration detail, and logs cannot currently be inspected | AWS CLI requests are denied by the Academy `voc-cancel-cred` policy after the lab session expires | Restart the Learner Lab and refresh all three temporary credential values before cloud diagnosis or deployment |
| The HTTP API Lambda proxy integration omitted an explicit invocation method | Template review found no `IntegrationMethod`; AWS's HTTP API Lambda integration example uses `POST` | Added `IntegrationMethod: POST` as a low-risk correction; deployment and a new one-pass API check are still required |

The integration-method correction is based on template inspection and AWS's documented Lambda proxy example. The CommonJS packaging correction is confirmed locally but must still be deployed. Neither correction should be described as fully resolved until the updated stack returns the expected application response.

On 18 September 2026, the corrected CommonJS code package was uploaded directly to `ddac-emergency-request-function`. Lambda reported `State: Active` and `LastUpdateStatus: Successful`. The first direct CLI invocation was not a valid behavior result because the AWS CLI rejected the malformed test JSON before it reached Lambda. A single Lambda Console invocation using the documented unauthenticated event is required to record the first post-upload application response.

Do not change this status to fully complete until the integration correction is redeployed and the evidence below is captured.

## Required verification evidence

| Evidence | Required result | Status |
| --- | --- | --- |
| CloudFormation stack | `CREATE_COMPLETE` | Captured through CLI; console screenshot still required |
| Lambda configuration | Node.js 24, `LabRole`, 512 MB, active tracing | Verified before package correction; screenshot required |
| Unauthenticated API request | Structured HTTP 401 | Pending integration-method redeployment |
| Affected-user request creation | HTTP 201 and new DynamoDB item | Pending |
| SQS publication | `emergency_request.submitted` message visible | Pending |
| Ownership rejection | Affected user cannot access another user's request | Pending |
| Coordinator transition | Valid assignment/status update succeeds | Pending |
| CloudWatch logs | Request ID, route, status and duration | Pending; Academy CLI log reading is restricted |
| X-Ray | Trace or service map for the Lambda invocation | Pending |
| React browser flow | Frontend calls the shared API successfully | Pending |

## Performance comparison

Run an identical, small request set against the Task 1 Express endpoint and Task 2 API Gateway endpoint. Use the same AWS region, data shape, request count, and test window. Replace every `TBD` with measured evidence; do not estimate values.

| Measurement | Task 1 Express | Task 2 API Gateway and Lambda |
| --- | ---: | ---: |
| Test date and time | TBD | TBD |
| Request count | TBD | TBD |
| Successful responses | TBD | TBD |
| Error responses | TBD | TBD |
| Average client latency | TBD | TBD |
| Fastest client latency | TBD | TBD |
| Slowest client latency | TBD | TBD |
| Lambda average duration | Not applicable | TBD |
| Lambda errors | Not applicable | TBD |
| Lambda throttles | Not applicable | TBD |

### Performance discussion template

The measured Task 1 average latency was **TBD**, while the measured Task 2 average latency was **TBD**. The difference was **TBD**. The Task 2 result should be interpreted alongside Lambda duration, error, throttle, and X-Ray evidence. Even if the serverless request has additional gateway or cold-start overhead, it provides independent scaling, per-invocation visibility, and asynchronous SQS integration. The final conclusion must state whether those operational benefits justify the measured latency difference for this emergency workflow.

## Individual reflection draft

My main responsibility was separating the emergency-request workflow from the Express application and deploying it through the team's shared API Gateway. The work showed that serverless conversion involves more than moving a route into a Lambda function. Authentication, ownership, validation, status transitions, DynamoDB compatibility, deployment roles, CORS, packaging, logging, tracing, and frontend configuration all had to remain consistent across the new boundary.

The most important implementation lesson was to verify the packaged artifact and API integration rather than relying only on a successful infrastructure deployment. The first stack reached `CREATE_COMPLETE`, but the API failed because the generated handler directory had been excluded from the original package. A dedicated esbuild bundle made the deployment artifact smaller and ensured the handler was present. After that package was redeployed, the continuing HTTP 500 response led to a second template review and an explicit `POST` invocation method for the Lambda proxy integration. The AWS Academy environment also required reuse of `LabRole` and careful integration with Looth's existing API instead of creating duplicate shared infrastructure.

After final testing, add a short paragraph here explaining the observed latency, the SQS message evidence, one CloudWatch or X-Ray finding, and what would be improved next. Suitable improvements include an SQS consumer for notification delivery, stricter production CORS, automated deployment validation, and alarms tied directly to the emergency Lambda.

## Final submission checklist for this section

- Replace every `TBD` with measured data.
- Replace the deployment-status warning with the final verified outcome.
- Insert labelled screenshots and refer to each figure in the prose.
- Add the final Task 1 and Task 2 architecture-diagram figure numbers supplied by Looth.
- Confirm that the workload matrix matches the demonstrated contribution.
- Include the required AI-use declaration under the team's agreed Yellow-category wording.
- Remove credentials, `.env`, dependencies, generated build folders, and temporary test data from the submission ZIP.
