# 14. Testing & Reliability

The backend implements automated testing utilizing **Vitest** and **Supertest**. 

## Test Suites
1. **Unit Tests**: Verifies JWT cryptographic signing, Zod request payload schema validations, and custom AppError formatters.
2. **Integration Tests**: Tests HTTP route boundaries, ensuring endpoints return `403 Forbidden` when hit by tokens lacking the correct RBAC role.
3. **Concurrency Tests** (`concurrency.integration.test.ts`): 
   - A critical test proving that submitting multiple parallel confirmation requests for the same Challan does NOT result in double-deductions.
   - Evaluates PostgreSQL's `SELECT FOR NO KEY UPDATE` lock, ensuring parallel stock deductions process sequentially and safely fail with `422 InsufficientStockError` if they exceed available balances.

## Client Validation
While frontend unit tests are omitted to maximize delivery speed, all user input is stringently validated by Zod schemas prior to network transmission, mirroring the backend validation rules.
