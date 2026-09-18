# Task 2 Emergency-Request Workflow

This is Mohamed Mohammed Musleh Mohammed’s Task 2 implementation boundary. The selected workflow is affected-user emergency requests. The existing Express and DynamoDB implementation remains the Task 1 baseline; the new Lambda path reuses the validated emergency-request domain logic and connects to the shared API Gateway prepared by Looth.

## What changed

- `apps/backend/src/serverless/emergencyRequestLambda.ts` is an API Gateway HTTP API-compatible Lambda handler for listing, creating, editing, cancelling, and coordinating emergency requests.
- `apps/backend/src/features/emergency-requests/emergencyRequestNotifications.ts` publishes submitted requests to SQS when a queue URL is configured. The queue uses a dead-letter queue and three delivery attempts in the SAM template.
- The Lambda verifies the existing signed bearer token, enforces affected-user ownership, restricts coordinator actions to coordinator and admin roles, validates input with the existing Zod schemas, and uses the existing DynamoDB repository.
- Every Lambda invocation logs a request ID, route, HTTP method, status code, and duration. Lambda tracing is enabled in the SAM template for AWS X-Ray.
- The React emergency-request API uses the shared Task 2 API Gateway URL when configured. Profile management continues to use the Task 1 API because the selected serverless boundary is the emergency-request workflow.

For the deployed Elastic Beanstalk frontend, both Task 2 clients read `TASK2_API_BASE_URL` from the backend's `/runtime-config.js` response. Set this value to the shared API Gateway base URL. This keeps login, profiles, reporting, and other Task 1 routes on Elastic Beanstalk while routing emergency requests and victim/volunteer operations to their independent Lambda services.

## Shared AWS handover values

- Region: `us-east-1`
- Existing HTTP API: `ddac-disaster-relief-api`
- Existing HTTP API ID: `1v1tnqew79`
- Existing stage: `$default` with automatic deployment
- Existing execution role: `LabRole`
- Musleh Lambda name: `ddac-emergency-request-function`
- Musleh SQS queue: `ddac-emergency-request-queue`
- Musleh dead-letter queue: `ddac-emergency-request-dlq`

The SAM stack adds Musleh's Lambda integration and six emergency-request routes to the existing API. It does not create or replace the shared API, stage, CORS configuration, dashboard, alarm, SNS topic, IAM role, or IAM policy.

Local verification completed on 17 September 2026: SAM lint validation passed and the Node.js 24 deployment package built successfully. This confirms the local template and package only; it is not evidence of a successful AWS deployment.

## Deploy after Task 1 is available

### AWS Academy authentication

AWS Academy Learner Lab does not use the normal `aws login` browser flow. In Canvas, open the Learner Lab, choose **Start Lab**, wait for the status indicator to become ready, open **AWS Details**, and choose **Show** beside **AWS CLI**. Copy the complete generated profile into the Windows credentials file at `%USERPROFILE%\.aws\credentials`. Keep all three generated values together: the access key ID, secret access key, and session token. Do not paste them into chat, commit them, or place them in `.env`.

These credentials are temporary. Repeat the copy step after the lab session expires or is restarted. Verify the active account before deployment:

```bash
aws sts get-caller-identity
```

The Canvas password is only for Canvas. It must not be passed to AWS CLI, SAM, source code, or project configuration.

### Account boundary

AWS resources belong to the AWS account that created them. If Task 1 DynamoDB and RDS resources were created with a teammate's Learner Lab account, this separate Learner Lab account cannot normally see or reuse them. Before deployment, compare the account returned by `aws sts get-caller-identity` with the account that hosts Task 1.

- Preferred: deploy Task 2 using temporary credentials for the same lab account and region as Task 1, with the same DynamoDB table and JWT secret.
- Alternative: recreate the required DynamoDB data and matching authentication configuration in this lab account, then treat it as a separate demonstration environment. An empty table alone is insufficient because the Lambda ownership checks need the affected-user profiles created by the Task 1 registration flow.

Do not deploy the Lambda to one account while pointing the frontend and login API at another unless the required profile data and JWT secret are deliberately synchronized.

From the repository root:

```bash
npm install
npm run build
sam build --template-file infra/serverless/task2-emergency-workflow.yaml
sam deploy --guided --template-file .aws-sam/build/template.yaml
```

During guided deployment, use region `us-east-1`, keep `ExistingHttpApiId` as `1v1tnqew79`, and provide the actual DynamoDB table name. Supply the same strong `JwtSecret` used to issue Task 1 login tokens and set `CorsOrigin` to the deployed frontend origin.

The template deliberately creates no IAM roles or policies. It attaches the existing AWS Academy `LabRole` to the Lambda by constructing its ARN from the current account ID. The lab must allow CloudFormation to pass that role, and the existing role must already permit Lambda logging, X-Ray, DynamoDB access, and SQS `SendMessage`. Do not open IAM or attempt to create or edit a role in the restricted student account.

For a local frontend build, put the shared API Gateway base URL in the root `.env` file:

```bash
VITE_TASK2_API_BASE_URL=https://1v1tnqew79.execute-api.us-east-1.amazonaws.com
```

For Elastic Beanstalk, set `TASK2_API_BASE_URL` instead; the backend supplies it at runtime, so the frontend does not need rebuilding. Do not commit `.env`, JWT secrets, AWS keys, or generated `dist` and dependency folders.

## Simple demonstration order

1. Sign in as an affected user and show the React emergency workspace.
2. Submit a request and show the request returned through the API Gateway URL.
3. In the AWS console, show the Lambda function, API Gateway routes, DynamoDB table, SQS queue, and dead-letter queue.
4. Open the SQS queue and show the `emergency_request.submitted` message. If the queue is empty because it was consumed, use CloudWatch logs as evidence of the queued status.
5. Sign in as a relief coordinator, move the request through review, assignment, progress, and resolution, and show that an affected user cannot perform coordinator updates.
6. Show the Lambda CloudWatch log entries containing request ID and duration, then show the X-Ray service map or trace summary.

Give Looth the Lambda name `ddac-emergency-request-function` after deployment so the shared dashboard's placeholder Lambda metrics can be replaced with Musleh's real function.

## Performance evidence to collect

Run the same small, repeatable request set against the Task 1 API and the Task 2 API Gateway URL. Record the endpoint, request count, average latency, slowest latency, successful responses, error responses, and time of the run. Export or screenshot the API Gateway and Lambda metrics for the same window, including `Count`, `4XXError`, `5XXError`, `Latency`, `IntegrationLatency`, and Lambda `Duration`, `Errors`, and `Throttles`.

Do not invent values. The report should state the actual test date, region, request count, and AWS metrics, then explain whether the extra serverless boundary is justified for independent scaling, asynchronous notification, and operational visibility.

## Still required outside source code

The team must still create the final Task 1 and Task 2 architecture diagrams, perform the real AWS deployment using the existing Academy role, collect CloudWatch and X-Ray screenshots or exports, run the equivalent performance comparison, write the report and individual reflection, record the fifteen-minute demonstration, remove credentials and dependency folders, and submit the final ZIP, video, and Word report using the assignment filenames. The code branch alone is not proof that those AWS activities happened.
