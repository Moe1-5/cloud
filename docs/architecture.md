# Architecture

> Immutable reference. Describes what was chosen and why.
> Update only when the stack fundamentally changes - add, don't rewrite.

## Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 19 + Vite + TypeScript | Fast local development, typed UI, production static build |
| Backend | Node.js 20 + Express + TypeScript | Simple AWS-compatible API runtime with explicit route ownership |
| Database | Amazon DynamoDB via AWS SDK v3 | Meets AWS cloud database requirement with low operational setup |
| Auth | Placeholder JWT env keys | Ready for role-based auth without pretending auth exists |
| Testing | Vitest + Supertest | Lightweight backend behavior tests |
| CI/CD | GitHub Actions | Runs install, lint, typecheck, tests, and build |
| Deploy | Elastic Beanstalk Procfile or EC2 Docker image | Matches assignment-approved AWS compute targets |

## Folder Structure

Feature ownership stays inside each app. Shared contracts only move to `packages/shared` when both frontend and backend need them.

```
apps/
  backend/
    src/
      config/                 # Environment, logger, AWS clients
      features/projects/      # Project CRUD API and DynamoDB access
      shared/                 # Backend errors and cross-feature helpers
  frontend/
    src/
      api/                    # Browser API clients
      App.tsx                 # First project-management screen
packages/
  shared/
    src/                      # Cross-app TypeScript contracts
infra/
  dynamodb/                   # AWS table definition scripts/templates
```

## Key Patterns

- **State management:** Local React state until shared client state is necessary.
- **Data fetching:** Typed fetch wrapper in `apps/frontend/src/api/`.
- **Error handling:** Backend normalizes errors before JSON responses; frontend shows request failures.
- **Validation:** Zod validates API request params and bodies.
- **Auth:** JWT configuration is reserved in env; implementation is intentionally future work.

## External Services

| Service | Purpose | Docs URL |
|---------|---------|----------|
| Amazon DynamoDB | Cloud database for project records and CRUD demonstration | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ |
| AWS Elastic Beanstalk | Approved managed compute deployment option | https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html |
| Amazon EC2 | Approved virtual server deployment option, usually with Docker | https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ |
