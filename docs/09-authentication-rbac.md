# 09. Authentication & RBAC

The system employs custom stateless JSON Web Tokens (JWT) for authentication, avoiding heavy dependencies on external identity providers while maintaining strict security control.

## Authentication Flow
1. User POSTs email/password to `/api/v1/auth/login`.
2. Backend queries user, hashes password via `bcrypt`, and compares.
3. If successful, backend signs a JWT (expiring in 12 hours) containing `userId` and `role`.
4. Client stores JWT and attaches it as `Authorization: Bearer <token>` on all subsequent requests.

## Role-Based Access Control (RBAC) Matrix

The backend enforces access via `authorize(['ROLE'])` middleware. The frontend conditionally renders UI elements via the `usePermission()` hook.

| Module | ADMIN | SALES | WAREHOUSE | ACCOUNTS |
|--------|-------|-------|-----------|----------|
| Login | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| View CRM | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Create/Edit Customers | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Log Follow-ups | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| View Products | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Create/Edit Products | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Adjust Stock Manually | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| View Challans | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Draft Challans | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| Confirm Challans | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| Cancel Challans | ✅ Yes | ✅ Yes | ❌ No | ❌ No |

> [!NOTE]  
> The system comes seeded with default users for each of the four roles for testing purposes. Dynamic user creation is currently unsupported in the UI to maintain assignment scope.
