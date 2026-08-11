# 7. Architecture

The system communicates unidirectionally via HTTP and TCP protocols.

## High-Level Architecture Flow

```mermaid
flowchart TD
    U[User Browser]
    F[React Frontend - client]
    B[Express Backend - server]
    P[PostgreSQL Driver - pg]
    S[Supabase PostgreSQL]

    U -->|Interacts| F
    F -->|HTTPS REST JSON + JWT| B
    B -->|TCP Port 6543| P
    P -->|SQL Queries & Locks| S
```

## Backend Layered Architecture (Clean Architecture)

The Node.js Express backend strictly isolates responsibilities passing from the HTTP layer down to the database level:

```mermaid
flowchart TD
    Req[Incoming HTTP Request]
    MW[Middleware Stack: Auth -> RBAC -> Zod Validations]
    CTRL[Controllers: Extract Payload & Format Response]
    SVC[Services: Business Logic & Transaction Boundaries]
    REPO[Repositories: Parameterized SQL & DB Mapping]
    DB[(PostgreSQL)]

    Req --> MW
    MW --> CTRL
    CTRL --> SVC
    SVC --> REPO
    REPO --> DB
```
