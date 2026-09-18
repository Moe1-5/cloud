# Architecture

> Immutable reference. Describes what was chosen and why.
> Update only when the stack fundamentally changes - add, don't rewrite.

## Stack

| Layer    | Technology                                     | Reason                                                          |
| -------- | ---------------------------------------------- | --------------------------------------------------------------- |
| Frontend | React 19 + Vite + TypeScript                   | Fast local development, typed UI, production static build       |
| Backend  | Node.js 20 + Express + TypeScript              | Simple AWS-compatible API runtime with explicit route ownership |
| Database | Amazon DynamoDB via AWS SDK v3                 | Meets AWS cloud database requirement with low operational setup |
| Auth     | Signed bearer tokens with role claims          | Protects API access and supports service-level authorization    |
| Serverless | Lambda + API Gateway + SNS/SQS                | Task 2 Victim/Volunteer service with asynchronous notifications |
| Testing  | Vitest + Supertest                             | Lightweight backend behavior tests                              |
| CI/CD    | GitHub Actions                                 | Runs install, lint, typecheck, tests, and build                 |
| Deploy   | Elastic Beanstalk Procfile or EC2 Docker image | Matches assignment-approved AWS compute targets                 |

## Folder Structure

Feature ownership stays inside each app. Shared contracts only move to `packages/shared` when both frontend and backend need them.

```
apps/
  backend/
    src/
      config/                 # Environment, logger, AWS clients
      features/projects/      # Project CRUD API and DynamoDB access
      features/disasters/     # Disaster information management
      features/shelters/      # Shelter and evacuation-centre management
      features/reliefServices/# Relief-service management
      features/users/         # Administrator user and role management
      features/victims/       # Victim records, search, needs, and assistance history
      features/volunteers/    # Volunteer availability and task assignment
      features/people-serverless/ # Task 2 Lambda HTTP handler and SQS event processor
      features/resources/     # Student 3 relief-resource inventory API
      features/distributions/ # Student 3 supply movement and status API
      features/activities/    # Derived relief-activity operational feed
      features/profiles/      # Affected-user profile registration and updates
      features/emergency-requests/ # Public requests and coordinator case workflow
      features/reports/        # Student 3 operational reporting aggregate
      shared/                 # Backend errors and cross-feature helpers
  frontend/
    src/
      api/                    # Browser API clients
      layouts/                # Administrator and coordinator navigation shells
      features/people/        # Victim and volunteer coordination workspace
      features/resources/     # Resource inventory workspace
      features/distributions/ # Distribution and relief-activity workspace
      features/emergency-requests/ # Affected-user and coordinator emergency workspace
      features/reports/       # Student 3 reporting workspace
      App.tsx                 # Role-aware integrated application shell
packages/
  shared/
    src/                      # Cross-app TypeScript contracts
infra/
  dynamodb/                   # AWS table definition scripts/templates
  serverless/                  # CloudFormation for the Task 2 serverless microservice
```

## Key Patterns

- **State management:** Local React state until shared client state is necessary.
- **Data fetching:** Typed fetch wrapper in `apps/frontend/src/api/`.
- **Error handling:** Backend normalizes errors before JSON responses; frontend shows request failures.
- **Validation:** Zod validates API request params and bodies.
- **Auth:** The backend signs bearer tokens containing a user role. The Task 2 Lambda verifies those tokens and only permits configured coordinator roles.
- **Persistence:** Backend production repositories use the shared DynamoDB table; Vitest uses an isolated in-memory store.
- **Serverless people service:** API Gateway invokes the Victim/Volunteer Lambda, which reuses the existing validation and repository functions. Recording assistance publishes an SNS event to an SQS queue with a retry and dead-letter path.
- **Distribution ledger:** Recording a distribution reserves inventory immediately; cancelling an active distribution restores it, and terminal statuses cannot transition again.
- **Emergency cases:** Affected users may edit or cancel only submitted or under-review requests. Coordinators advance cases through review, assignment, response, and resolution while appending an immutable status timeline.
- **Role boundary:** Profile and request ownership are validated now; authentication credentials and trusted role identity remain a shared Sprint 6 integration concern.
- **Reporting boundary:** Student 3 operational metrics are aggregated from feature repositories behind a dedicated report endpoint so the team dashboard can consume them without coupling to repository internals.

## External Services

| Service               | Purpose                                                        | Docs URL                                                                         |
| --------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Amazon DynamoDB       | Cloud database for project records and CRUD demonstration      | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/                |
| AWS Lambda            | Serverless victim and volunteer API plus event processor       | https://docs.aws.amazon.com/lambda/latest/dg/                                    |
| Amazon API Gateway    | HTTP endpoint for the Task 2 Lambda service                    | https://docs.aws.amazon.com/apigateway/latest/developerguide/                    |
| Amazon SNS and SQS    | Assistance event delivery, retry, and dead-letter evidence     | https://docs.aws.amazon.com/sns/latest/dg/ and https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/ |
| AWS Elastic Beanstalk | Approved managed compute deployment option                     | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html |
| Amazon EC2            | Approved virtual server deployment option, usually with Docker | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/                             |
