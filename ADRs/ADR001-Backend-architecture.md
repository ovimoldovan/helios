# ADR 0001: Adopt Clean Architecture for Visual Area Manager

## Team
Mihai, Mihnea

## Date
July 13, 2026

## Status
Pending

## Context
We are building a location-based visual area manager. The core domain logic (processing reports, validating coordinates, and managing areas) is complex. If we mix these critical business rules with HTTP routing or storage code, the system will become fragile, tightly coupled, and difficult to test. We need an architecture that isolates our core logic from external dependencies.

## Decision
We will adopt **Clean Architecture**.

We will enforce the **Dependency Rule**: all source code dependencies must point inward toward the core business logic. The solution will be split into four distinct layers:

1. **Domain Layer (Center):** Contains core business entities (`Report`, `Area`) and rules. **Rule:** Zero external dependencies.
2. **Application Layer (Use Cases):** Contains business workflows (e.g., `SubmitReport`). **Rule:** Depends only on the Domain layer.
3. **Infrastructure Layer (External):** Implements interfaces to handle data storage and external APIs. **Rule:** Depends on the Application layer.
4. **Presentation Layer (Edge):** Handles HTTP requests and API routing. **Rule:** Depends on the Application layer; contains no business logic.

## Consequences

### Positive
* **Framework Independent:** The core area-management logic remains untouched even if external delivery mechanisms change.
* **Highly Testable:** Business rules in the Domain and Application layers can be easily unit-tested without needing web servers or storage systems.
* **Separation of Concerns:** Clear boundaries prevent "spaghetti code."

### Negative
* **Increased Boilerplate:** Requires more files and data mapping (DTOs) to pass information.
* **Overhead for Simple Features:** For basic operations (like just reading a list of reports to display), Clean Architecture often feels like over engineering.You are forced to write and map code across four separate layers just to complete a trivial task.