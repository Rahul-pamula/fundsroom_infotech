# 11. Backend REST API

The Express application uses RESTful conventions, returning standardized JSON payloads.

## Standardized Response Payload
All successful API calls return HTTP 200/201 with the following structure:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-03-30T10:15:30.123Z"
}
```

## Standardized Error Payload
Errors return HTTP 4xx/5xx status codes with a standardized object:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Query validation failed",
    "details": [ ... ]
  },
  "timestamp": "2026-03-30T10:15:30.123Z"
}
```

## Core Endpoint Map

| Endpoint | Method | Role Req | Purpose |
|----------|--------|----------|---------|
| `/api/v1/auth/login` | POST | Public | Retrieve JWT token. |
| `/api/v1/dashboard/summary` | GET | All | Top-level KPIs and alerts. |
| `/api/v1/customers` | GET/POST | All/Sales | Search, list, or create customers. |
| `/api/v1/customers/:id/followups` | POST | Sales | Log CRM interactions. |
| `/api/v1/products` | GET/POST | All/Admin | View or create catalog items. |
| `/api/v1/products/:id/adjust-stock` | POST | Admin/WH | Execute manual IN/OUT stock adjustments. |
| `/api/v1/stock-movements` | GET | All | View complete stock ledger. |
| `/api/v1/challans` | GET/POST | All/Sales | List or draft new sales challans. |
| `/api/v1/challans/:id/confirm` | POST | Sales/WH | Lock items and atomically deduct stock. |
| `/api/v1/challans/:id/cancel` | POST | Sales | Void drafts or restock confirmed shipments. |
