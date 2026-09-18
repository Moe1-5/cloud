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
**Blocking:** The configured AWS Academy CLI session is denied by `voc-cancel-cred`, preventing Elastic Beanstalk application creation and source upload; refresh the current lab's temporary credentials before the integrated web deployment and remaining Task 2 evidence can continue.

## Tech Stack

React 19 + Vite + Express + TypeScript + DynamoDB, with the Task 1 API on Elastic Beanstalk or EC2 and Node.js 24 Lambda microservices behind the shared API Gateway using SNS, SQS, CloudWatch, and X-Ray.

## Last Decision
2026-09-18 Integrate the victim/volunteer and emergency-request Lambdas through Looth's shared API Gateway, standardizing both Lambda runtimes on Node.js 24

## Status Flags

- [x] Tests configured
- [x] CI/CD active
- [x] Auth implemented
- [x] First deploy done
- [x] Database migrations tracked
