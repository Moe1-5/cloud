# Task 2 Victim and Volunteer Serverless Service

## Scope

Student 2 owns the Victim and Volunteer microservice. It preserves the Task 1 frontend contract while exposing the victim and volunteer APIs through an API Gateway HTTP API and Node.js 24 Lambda handlers, matching the emergency-request service runtime.

When the React frontend is served from Elastic Beanstalk, configure `TASK2_API_BASE_URL` with the shared API Gateway base URL. The frontend receives this runtime setting from `/runtime-config.js`, allowing both the victim/volunteer and emergency-request clients to use their Task 2 Lambda routes while the remaining Task 1 APIs continue to use Elastic Beanstalk.

## Deployment model

- Deploy `infra/serverless/victim-volunteer-service.yaml` through CloudFormation with the team-owned `SharedApiId`. The template must not create a second API Gateway or stage.
- Provide the existing AWS Academy `LabRole` ARN as `LabRoleArn`. The template creates no IAM role.
- Build and package the artifact with `npm run package:task2-serverless`, then archive `artifacts/task2-serverless` as a ZIP file and upload it to the S3 bucket referenced by `CodeS3Bucket` and `CodeS3Key`.
- Use the output `ApiBaseUrl` as the deployed Elastic Beanstalk `TASK2_API_BASE_URL` environment value.

### Deployed team integration

- Stack: `g28-victim-volunteer-serverless`
- Shared API: `ddac-disaster-relief-api` with ID `1v1tnqew79`
- Shared API URL: `https://1v1tnqew79.execute-api.us-east-1.amazonaws.com`
- Region: `us-east-1`
- Authentication: the Lambda uses the same JWT secret and seven-day expiry as the deployed Elastic Beanstalk login backend.

The earlier handover wrote the API ID as `1v1tngew79`; the live API ID is `1v1tnqew79`.

The LabRole must already permit Lambda logging, X-Ray tracing, DynamoDB access to the selected table, SNS publishing, and SQS consumption. If a lab policy blocks any operation, record the failed action as lab-environment evidence rather than attempting to create a role.

## API and security

The service maintains these existing contracts:

- `GET` and `POST` `/api/victims`
- `GET` and `PATCH` `/api/victims/{id}`
- `POST` `/api/victims/{id}/assistance`
- `GET` and `POST` `/api/volunteers`
- `PATCH` `/api/volunteers/{id}`

It verifies the existing signed bearer token and allows roles from `SERVERLESS_ALLOWED_ROLES`, defaulting to administrators and relief coordinators. It reuses the Task 1 Zod schemas and DynamoDB repository rather than duplicating validation or persistence logic.

## Messaging and resilience

When assistance is recorded, the Lambda publishes a `VictimAssistanceRecorded` message to SNS. SNS delivers it to SQS, and the event-processor Lambda handles the message. The queue moves a message to its dead-letter queue after three failed receives. Set `SIMULATE_EVENT_PROCESSING_FAILURE=true` temporarily in the processor Lambda only when collecting controlled retry/DLQ evidence, then reset it to false.

## Evidence checklist

1. Capture a successful authenticated victim or volunteer request in API Gateway and DynamoDB.
2. Capture invalid input, missing token, and forbidden-role responses.
3. Capture the SNS topic, SQS queue, and a successfully processed assistance event.
4. Capture a controlled retry and DLQ message, then restore the processor setting.
5. Capture CloudWatch request-ID logs, Lambda duration/error metrics, and X-Ray traces if LabRole permits tracing.

The shared `DDAC-Disaster-Relief-Dashboard` includes Invocation, Error, and Duration metrics for `victim-volunteer-service` and `victim-volunteer-event-processor`.
