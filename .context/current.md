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
**Blocking:** Capture final authenticated create/update and SNS-to-SQS/DLQ evidence for the Task 2 report and demo.

## Tech Stack

React 19 + Vite + Node.js 20 + Express + TypeScript + DynamoDB, with a Task 2 Lambda/API Gateway Victim-Volunteer microservice and SNS/SQS messaging.

## Last Decision
2026-09-18 Integrate Student 2 Lambda routes into the team-owned shared API Gateway and reuse the deployed Elastic Beanstalk JWT secret

## Status Flags

- [x] Tests configured
- [x] CI/CD active
- [x] Auth implemented
- [x] First deploy done
- [x] Database migrations tracked
