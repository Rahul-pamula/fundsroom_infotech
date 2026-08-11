# 18. Limitations & Future Scope

While the application supports the core operational loops, several areas offer clear expansion opportunities.

## Known UI Limitations
- **Multi-Item UI**: The backend fully supports drafting challans with an array of multiple items, however, the current React implementation limits adding only a single product item via the wizard at a time.
- **Editing Entities**: The backend API contains `PUT` endpoints for editing Customer details and Product catalog parameters, but UI Modals for these operations are not yet mapped to the DOM.
- **Dynamic User Setup**: The `/users` endpoint for Admins to create new staff accounts is conceptually defined but unimplemented; current users rely on database seeds.

## Future Architectural Scope
- **Multi-Warehouse Support**: Moving from a simple `location` string field on the `products` table to a many-to-many `warehouse_inventory` junction table.
- **Billing Integration**: Confirmed Challans can easily serve as origin documents for a future `invoices` table to track accounts receivable.
- **Background Jobs**: Implementing Redis + BullMQ for asynchronous PDF generation (Challan printing) and low-stock email dispatching.
