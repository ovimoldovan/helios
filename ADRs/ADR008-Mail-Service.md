# ADR007 - Mail Service
___
## Status
TBD

___
## Context
We need a mail service in order to send users emails with updates regarding their reports.

___
## Decision


___
## Consequences


___
## Alternatives Considered
- **Resend:** Has an easy to use .NET SDK (https://github.com/resend/resend-dotnet) + a generous free tier (3,000 emails / mo, 100 emails / day).
- **Mailgun:** Generous free tier (100 emails / day, unlimited emails / mo) but doesn't have an SDK.

All mail services require a verified domain. Without a verified domain, we are stuck in a sandbox environment.

___
**Date:** 12.09.2026
