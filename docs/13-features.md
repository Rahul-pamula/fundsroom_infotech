# 13. Feature Implemented Audit

This document aligns strictly with the features actually coded into the platform.

### Core Implemented Features
- **Landing Page**: Public facing UI layout.
- **Auth System**: Login page, JWT parsing, and client/server validation.
- **RBAC Engine**: Dynamic UI hiding (frontend) and strict API blocking (backend).
- **Dashboard**: Live metrics, active customer count, low-stock notifications.
- **Customer CRM**: 
  - List filtering and search.
  - Profile creation modal.
  - Follow-up timeline visualization.
  - Follow-up logging modal.
  - API endpoint for profile updates (Backend only, UI modal unsupported).
- **Product Catalog**:
  - Grid view with dynamic category filtering and search.
  - Admin product creation flow.
- **Inventory Engine**:
  - Stock Adjustment modal (IN/OUT).
  - Transaction ledger view (`/stock-movements`).
  - Pessimistic DB locking preventing negative stock conditions.
- **Sales Challans**:
  - Multi-item line-item drafting wizard.
  - Snapshot capturing of historical pricing.
  - Transactional confirmations and cancellations.

> [!WARNING]  
> User creation is restricted. Standard flows utilize the initial database seeds. A public signup route exists conceptually but was deprioritized against core operations.
