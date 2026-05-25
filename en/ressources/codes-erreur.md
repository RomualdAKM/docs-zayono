# Error codes

Full reference of every HTTP error code returned by the Zayono API.

## Client errors (4xx)

### 400 — Bad Request

The request is malformed.

| Message | Cause |
|---------|-------|
| `X-Idempotency-Key must be a valid UUID.` | Invalid idempotency header |
| `Invalid request format.` | Non-JSON request body |

### 401 — Unauthorized

Authentication failed.

| Message | Cause |
|---------|-------|
| `Invalid or missing API key.` | API key missing, invalid or expired |
| `API key format is invalid.` | Key does not match the `zyn_(live\|test)_*` format |
| `API key has expired.` | The key has passed its expiry date |
| `Unauthenticated.` | Invalid Sanctum token (dashboard) |

### 403 — Forbidden

Operation not allowed.

| Message | Cause |
|---------|-------|
| `Merchant account is suspended.` | Merchant account suspended by admin |

### 404 — Not Found

Resource not found.

| Message | Cause |
|---------|-------|
| `Payment not found.` | Unknown payment transaction |
| `Payout not found.` | Unknown payout transaction |
| `Checkout session not found.` | Unknown checkout session |
| `Customer not found.` | Unknown customer |

### 409 — Conflict

State conflict.

| Message | Cause |
|---------|-------|
| `This checkout session has already been completed.` | Session already processed |
| `Payment is already being processed.` | Payment already in flight |
| `Routing rule already exists.` | Duplicate routing rule |

### 410 — Gone

Resource expired.

| Message | Cause |
|---------|-------|
| `This checkout session has expired.` | Checkout session past 30 min |

### 422 — Unprocessable Entity

Validation error. The `errors` field carries the details:

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

**Common messages:**

| Field | Message | Cause |
|-------|---------|-------|
| `amount` | `The amount field is required.` | Missing amount |
| `amount` | `The amount must be at least 1.` | Amount too small |
| `currency` | `The currency must be 3 characters.` | Invalid currency format |
| `customer.email` | `The customer.email field is required.` | Missing customer email |
| `operator` | `The operator field is required.` | Missing operator (payouts) |
| `return_url` | `The return url must be a valid URL.` | Invalid URL |
| `events` | `The events field is required.` | No webhook event |

### 429 — Too Many Requests

Rate limit hit. Wait before retrying.

## Server errors (5xx)

### 500 — Internal Server Error

Internal error. Contact support if the problem persists.

### 502 — Bad Gateway

The payment aggregator could not process the request.

| Message | Cause |
|---------|-------|
| `Payment processing failed. Please try again.` | Aggregator failure during checkout |
| `Payment initialized but processing failed.` | Failure after direct initialization |
