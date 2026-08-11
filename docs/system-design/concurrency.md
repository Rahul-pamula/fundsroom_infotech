<div class="page-header">
  <span class="category-badge">SYSTEM DESIGN</span>
  <h1>Concurrency & Data Flow</h1>
  <p class="page-subtitle">Pessimistic locking and ACID transactions to guarantee inventory accuracy.</p>
  <hr class="header-divider" />
</div>

The Fundsroom Mini ERP + CRM relies heavily on real-time inventory adjustments and sales dispatching. A critical design constraint is ensuring that stock is never oversold when multiple sales executives attempt to draft and confirm challans simultaneously.

## The Concurrency Problem

If `User A` and `User B` both attempt to sell the last 10 units of a product at the exact same millisecond:
1. Both read `current_stock = 10`.
2. Both evaluate `10 >= 10` (True).
3. Both subtract 10 and write `current_stock = 0`.
4. Result: 20 units were sold, but only 10 existed. **(Negative Stock)**

## Pessimistic Locking Solution

To prevent this, the monolithic backend employs **Pessimistic Row-Level Locking** using PostgreSQL's `SELECT ... FOR UPDATE` clause within ACID transactions.

### The Transaction Flow

<div class="architecture-container">
  <img src="/assets/architecture/challan-concurrency-flow.svg" alt="Challan Concurrency Flow" />
</div>

<p class="screenshot-caption">Figure 8 — Challan Concurrency Flow (Optimistic Validation & Pessimistic Locks)</p>

### Why `FOR NO KEY UPDATE`?
We use `FOR NO KEY UPDATE` instead of `FOR UPDATE` because we are only modifying the `current_stock` column of the product, not its primary key. This allows concurrent `INSERT` operations into related tables (like `stock_movements` or `challan_items`) without blocking them unnecessarily, maximizing throughput while maintaining integrity.

## Rollback Behavior

Because the entire confirmation process occurs within a single PostgreSQL transaction block, any failure—whether a database constraint violation, a network error midway, or an application-level throw—will trigger an automatic `ROLLBACK`.

This guarantees that:
- Stock is never deducted if the stock movement log fails to write.
- A challan is never marked as `CONFIRMED` if the stock deduction fails.
- The system remains in a perfectly consistent state regardless of intermittent errors.
