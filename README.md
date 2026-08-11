# AWS Cloud Full-Stack Base

Base project for Task 1: a responsive React frontend, Node.js TypeScript backend, and AWS DynamoDB integration ready for Elastic Beanstalk or EC2 deployment.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | Amazon DynamoDB through AWS SDK v3 |
| Validation | Zod at API boundaries |
| Testing | Vitest and Supertest |
| Deployment | Elastic Beanstalk Procfile or EC2 Docker image |

## Local Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000`

The backend expects an AWS DynamoDB table with a string partition key named `id`. For local development, you may set `DYNAMODB_ENDPOINT` to a local DynamoDB endpoint.

## Main Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run typecheck
```

## API Surface

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Runtime and database configuration status |
| `GET` | `/api/projects` | List project records |
| `POST` | `/api/projects` | Create a project record |
| `GET` | `/api/projects/:id` | Read one project record |
| `PATCH` | `/api/projects/:id` | Update a project record |
| `DELETE` | `/api/projects/:id` | Delete a project record |

## AWS Deployment

See `docs/aws-deployment.md` for DynamoDB, Elastic Beanstalk, and EC2 deployment steps. The shortest production path is:

```bash
npm install
npm run build
npm start
```

Set `SERVE_STATIC_FRONTEND=true` and `FRONTEND_DIST_PATH=apps/frontend/dist` when the backend should serve the built React site.
