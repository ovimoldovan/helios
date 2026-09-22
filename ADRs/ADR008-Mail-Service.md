# ADR007 - Mail Service
___
## Status
Decided

___
## Context
We need a mail service in order to send users emails with updates regarding their reports.

___
## Decision
Go with Resend and split the mail sending logic into a separate microservice. Mail sending requests will be fed to a queue hosted on CloudAMPQ

___
## Consequences
Pros: Faster development since Resend is already setup, and we already have the logic

Cons: Technical overhead caused by the need to split it into a new microservice that's fed by a queue. 

___
## Alternatives Considered
- **CloudAMPQ**: Free tier is really generous and far more than we need (20 connections, 28 days of idle time, 150 queues, 1.000.000 messages, 10.000 max. queue length, 1GB max size)
- **Render**: We can fit our needs on a free tier machine but it seems really hard to keep it running (SeeagleAssistant is down at the moment of writing this :D)
___
**Date:** 17.09.2026
