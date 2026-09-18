# Current State

> Keep this under 40 lines. Claude reads this first - be precise, not comprehensive.
> Update whenever: sprint changes, major decision is made, stack is finalized.

## Project
**Name:** Disaster Relief Coordination System
**Description:** Cloud-based platform for disaster information, relief coordination, resources, volunteers, victims, and emergency assistance.
**Stage:** [ ] Scaffolding  [x] MVP  [ ] Feature-complete  [ ] Production

## Active Sprint
**Sprint:** Team integration
**Goal:** Validate the combined Student 1, Student 2, and Student 3 application.
**Blocking:** Musleh's explicit API Gateway Lambda integration-method correction needs a fresh Academy session for redeployment and one-pass cloud verification.

## Tech Stack

React 19 + Vite + Express + TypeScript + DynamoDB, with the Task 1 API on Elastic Beanstalk or EC2 and a Node.js 24 Task 2 Lambda behind API Gateway with SQS, CloudWatch, and X-Ray.

## Last Decision
2026-09-18 Set the shared HTTP API Lambda proxy integration method explicitly to POST before the next Academy redeployment

## Status Flags

- [x] Tests configured
- [x] CI/CD active
- [x] Auth implemented
- [x] First deploy done
- [x] Database migrations tracked
