# 8. Project Structure

The repository is divided into two primary workspaces: `client/` and `server/`.

## Repository Layout

```text
mini-erp-crm/
├── .github/                      # CI/CD Workflows
├── client/                       # React Frontend
│   ├── src/
│   │   ├── assets/               # CSS, global styles
│   │   ├── components/           # Generic UI widgets and layout shells
│   │   ├── config/               # Environment constants
│   │   ├── contexts/             # React Auth context providers
│   │   ├── features/             # Domain-specific components (auth, crm, challans)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── routes/               # React Router config and Role guards
│   │   ├── services/             # Axios API client setup
│   │   ├── types/                # Frontend TS interfaces
│   │   └── utils/                # Formatters, helpers
├── server/                       # Express Backend
│   ├── src/
│   │   ├── config/               # Database pool and env parsing
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── middleware/           # Error, Auth, RBAC, and Validation handlers
│   │   ├── models/               # Zod schemas and API types
│   │   ├── repositories/         # Database access objects (SQL)
│   │   ├── routes/               # Express router bindings
│   │   ├── services/             # Core business logic orchestrators
│   │   ├── utils/                # Cryptography, JWT, AppError classes
│   │   ├── app.ts                # Express application setup
│   │   └── server.ts             # Entrypoint & listener
│   ├── db/
│   │   ├── migrations/           # Raw SQL schema creation scripts
│   │   └── seeds/                # Initial data seed scripts
│   ├── tests/                    # Vitest Unit and Integration suites
├── docker-compose.yml            # Local development orchestration
└── package.json                  # Root workspace runner
```
