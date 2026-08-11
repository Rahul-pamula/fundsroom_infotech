# API Reference

The backend exposes a RESTful API. All endpoints are prefixed with `/api` and require a JSON Web Token (JWT) provided in the `Authorization: Bearer <token>` header, unless otherwise noted.

## Authentication

### `POST /api/auth/login`
Authenticates a user and returns a JWT.
- **Role Requirement:** None (Public)
- **Request Body:**
  ```json
  {
    "email": "user@fundsroom.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "user": { "id": 1, "role": "ADMIN", "name": "Admin User" },
      "token": "eyJhbG..."
    }
  }
  ```

## Customers (CRM)

### `GET /api/customers`
Retrieves a paginated list of customers.
- **Role Requirement:** ADMIN, SALES, ACCOUNTS
- **Response:** Array of customer objects.

### `POST /api/customers`
Creates a new customer profile.
- **Role Requirement:** ADMIN, SALES
- **Request Body:** `{ "name": "...", "company_name": "..." }`

## Inventory

### `POST /api/inventory/adjust`
Adjusts physical stock levels.
- **Role Requirement:** ADMIN, WAREHOUSE
- **Request Body:**
  ```json
  {
    "productId": 12,
    "quantity": 50,
    "type": "ADJUSTMENT_IN",
    "notes": "Restock from supplier"
  }
  ```
- **Response:** Returns the created `stock_movement` record.

## Challans

### `POST /api/challans`
Creates a draft challan.
- **Role Requirement:** ADMIN, SALES
- **Request Body:**
  ```json
  {
    "customerId": 5,
    "items": [
      { "productId": 10, "quantity": 2 }
    ]
  }
  ```

### `POST /api/challans/:id/confirm`
Confirms a challan, locking rows, deducting stock, and recording movements.
- **Role Requirement:** ADMIN, SALES
- **Response:** `200 OK` on success, `400 Bad Request` if insufficient stock.

## Error Handling
The API uses standardized error responses:
```json
{
  "status": "error",
  "message": "Insufficient stock for product 10",
  "errors": []
}
```
