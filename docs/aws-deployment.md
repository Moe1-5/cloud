# AWS Deployment Guide

This project is prepared for either assignment-approved compute option: Elastic Beanstalk or EC2. Both options use DynamoDB as the AWS cloud database.

## DynamoDB Table

Create a table with a string partition key named `id`.

```bash
aws dynamodb create-table --cli-input-json file://infra/dynamodb/projects-table.json
```

Required environment variables:

```bash
AWS_REGION=ap-southeast-1
DYNAMODB_TABLE_NAME=ddac-projects
```

The application uses AWS SDK default credentials in production. On Elastic Beanstalk or EC2, attach an IAM role that can perform `dynamodb:Scan`, `dynamodb:GetItem`, `dynamodb:PutItem`, `dynamodb:UpdateItem`, and `dynamodb:DeleteItem` on the selected table.

## Elastic Beanstalk

1. Create a Node.js 20 Elastic Beanstalk application.
2. Configure environment variables in the Elastic Beanstalk console.
3. Build locally or let the environment run the npm scripts.
4. Deploy the project ZIP containing this repository.

The included `Procfile` runs `npm start`. The `.ebextensions/node.config` file enables static frontend serving through the backend by setting:

```bash
SERVE_STATIC_FRONTEND=true
FRONTEND_DIST_PATH=apps/frontend/dist
```

## EC2 With Docker

Install Docker on the EC2 instance, copy the project, configure `.env`, and run:

```bash
docker compose up -d --build
```

Open inbound traffic for the selected port, normally port `3000`, in the instance security group.

## Production Build

```bash
npm install
npm run build
npm start
```

The backend serves API routes and, when `SERVE_STATIC_FRONTEND=true`, the built React app from `apps/frontend/dist`.
