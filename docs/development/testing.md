<div class="page-header">
  <span class="category-badge">DEVELOPMENT</span>
  <h1>Testing & Reliability</h1>
  <p class="page-subtitle">Automated testing strategies to ensure transactional integrity and API reliability.</p>
  <hr class="header-divider" />
</div>

The backend implements automated testing utilizing **Vitest** and **Supertest**. 

## Test Suites

<div class="feature-grid">
  <div class="content-card">
    <h3>Unit Tests</h3>
    <p>Verifies JWT cryptographic signing, Zod request payload schema validations, and custom AppError formatters.</p>
  </div>
  <div class="content-card">
    <h3>Integration Tests</h3>
    <p>Tests HTTP route boundaries, ensuring endpoints return `403 Forbidden` when hit by tokens lacking the correct RBAC role.</p>
  </div>
</div>

## Concurrency Stress Testing

The most critical test in the suite is `concurrency.integration.test.ts`.

- **The Goal**: Prove that submitting multiple parallel confirmation requests for the same Challan does NOT result in double-deductions.
- **The Evaluation**: It hammers the API concurrently to evaluate PostgreSQL's `SELECT FOR NO KEY UPDATE` lock, ensuring parallel stock deductions process sequentially and safely fail with `422 InsufficientStockError` if they exceed available balances.

::: tip CLIENT VALIDATION
While frontend unit tests are omitted to maximize delivery speed, all user input is stringently validated by Zod schemas prior to network transmission, mirroring the backend validation rules.
:::
