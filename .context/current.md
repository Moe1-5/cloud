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
**Blocking:** All scoped mobile functional and responsive checks pass. The sole browser error is a missing `/favicon.ico` returning HTTP 404; authentication, DynamoDB, and teammate-data integration also remain open.

## Tech Stack

React 19 + Vite + Node.js 20 + Express + TypeScript + DynamoDB, deployed on AWS Elastic Beanstalk or EC2.

## Last Decision

2026-08-13 Release follow-up distribution actions immediately after authoritative API success

## Status Flags

- [x] Tests configured
- [x] CI/CD active
- [ ] Auth implemented
- [ ] First deploy done
- [x] Database migrations tracked
