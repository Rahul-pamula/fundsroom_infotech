# 12. Frontend Application

The presentation tier is a React 18 Single Page Application compiled with Vite.

## Architecture Highlights
- **Routing**: Handled entirely via `react-router-dom`. Protected routes check the JWT context, redirecting unauthorized users back to `/login`.
- **State Management**: API interactions are heavily managed by `@tanstack/react-query`. Network requests cache responses and invalidate automatically (e.g., confirming a challan invalidates the `['products']` query key, updating inventory instantly across the app).
- **Styling**: Tailwind CSS is used exclusively for styling. Standardized UI components (Buttons, Modals, Badges) exist in `src/components/common`.
- **Forms & Validation**: Input is captured via `react-hook-form` and synchronously validated on the client side using `zod` schemas matching the backend validations exactly.
- **Service Layer**: An Axios instance (`src/services/api.ts`) automatically injects the `Authorization` bearer token into headers and catches 401 Unauthorized errors to trigger global logouts.
