# Current State

> Keep this under 40 lines. Claude reads this first - be precise, not comprehensive.
> Update whenever: sprint changes, major decision is made, stack is finalized.

## Project

**Name:** Disaster Relief Coordination System
**Description:** AWS full-stack platform for disaster information, resources, people, and emergency requests.
**Stage:** [ ] Scaffolding [x] MVP [ ] Feature-complete [ ] Production

## Active Sprint

**Sprint:** Sprint 6 (Student 3 delivery track; earlier sprints remain open until explicitly closed)
**Goal:** Prepare Student 3 reporting, quality evidence, and a controlled team-integration handoff.
**Blocking:** Mobile overflow and distribution creation confirmation are fixed. The latest linear browser pass stopped when the second status action did not visibly advance the new distribution from in transit to delivered; later workflows remain unverified.

## Tech Stack

React 19 + Vite + Node.js 20 + Express + TypeScript + DynamoDB, deployed on AWS Elastic Beanstalk or EC2.

## Last Decision

2026-08-13 Confirm successful distribution mutations immediately without blanking the register during supporting-data refresh

## Status Flags

- [x] Tests configured
- [x] CI/CD active
- [ ] Auth implemented
- [ ] First deploy done
- [x] Database migrations tracked
