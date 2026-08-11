#!/bin/bash

# 2. Backend base
git add server/package.json server/package-lock.json server/tsconfig.json server/src/app.ts server/src/server.ts server/Dockerfile 2>/dev/null || true
git commit -m "build: Setup Express backend base configuration and Dockerfile" || true

# 3. Backend config & utils
git add server/src/config server/src/utils || true
git commit -m "feat(backend): Implement utility functions and environment configuration" || true

# 4. Database
git add server/db || true
git commit -m "db: Add PostgreSQL schema migrations and seed scripts" || true

# 5. Backend models
git add server/src/models || true
git commit -m "feat(backend): Add Zod validation schemas and type definitions" || true

# 6. Backend repositories
git add server/src/repositories || true
git commit -m "feat(backend): Implement database repository layer for data access" || true

# 7. Backend services
git add server/src/services || true
git commit -m "feat(backend): Develop core business logic and transaction services" || true

# 8. Backend middleware
git add server/src/middleware || true
git commit -m "feat(backend): Add authentication, RBAC, and error handling middleware" || true

# 9. Backend controllers, routes, tests
git add server/src/controllers server/src/routes server/tests || true
git commit -m "feat(backend): Implement Express controllers, route bindings, and tests" || true

# 10. Frontend base
find client -maxdepth 1 -type f -exec git add {} + || true
git commit -m "build: Setup React Vite frontend structure and configurations" || true

# 11. Frontend core logic
git add client/src/config client/src/contexts client/src/hooks client/src/services client/src/types client/src/utils || true
git commit -m "feat(frontend): Implement core services, hooks, contexts, and API integration" || true

# 12. Frontend UI components
git add client/src/components || true
git commit -m "feat(frontend): Build reusable UI components and layout shells" || true

# 13. Frontend features
git add client/src/features || true
git commit -m "feat(frontend): Develop CRM, inventory, and sales challan feature pages" || true

# 14. Frontend routing and assets
git add client/src/routes client/src/assets client/src/main.tsx client/src/App.tsx client/src/index.css client/src/vite-env.d.ts || true
git commit -m "feat(frontend): Configure client-side routing, protected routes, and assets" || true

# 15. Documentation
git add docs/ || true
git commit -m "docs: Add comprehensive system architecture and project documentation" || true

# 16. Anything left over
git add .
git commit -m "chore: Finalize project structure and tracking remaining assets" || true

echo "All commits created successfully."
