# Error handling

The Zayono API uses standard HTTP status codes to signal request success or failure.

## Error format

All errors follow the standard format:

```json
{
  "message": "Description of the error",
  "data": null,
  "errors": { ... }
}
```

The `errors` field contains specific details on a validation error (422). For other error codes, `errors` is `null`.

## Error reference

### 400 — Bad request

The request is malformed or contains invalid data.

```json
{
  "message": "X-Idempotency-Key must be a valid UUID.",
  "data": null,
  "errors": null
}
```

### 401 — Not authenticated

The API key is missing, invalid or expired.

```json
{
  "message": "Invalid or missing API key.",
  "data": null,
  "errors": null
}
```

### 403 — Forbidden

The merchant account is suspended or the operation is not allowed.

```json
{
  "message": "Merchant account is suspended.",
  "data": null,
  "errors": null
}
```

### 404 — Not found

The requested resource does not exist.

```json
{
  "message": "Payment not found.",
  "data": null,
  "errors": null
}
```

### 409 — Conflict

The resource is in a conflicting state (e.g. checkout already completed).

```json
{
  "message": "This checkout session has already been completed.",
  "data": { "status": "completed", "return_url": "https://..." },
  "errors": null
}
```

### 410 — Expired

The resource has expired (e.g. checkout session).

```json
{
  "message": "This checkout session has expired.",
  "data": { "status": "expired", "return_url": "https://..." },
  "errors": null
}
```

### 422 — Validation error

The submitted data does not meet validation rules.

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "currency": ["The currency must be 3 characters."],
    "customer.email": ["The customer.email field is required."]
  }
}
```

### 429 — Too many requests

You have exceeded the rate limit. See [Rate limits](/en/introduction/erreurs).

### 500 — Server error

An internal error occurred. Contact support if the problem persists.

### 502 — Aggregator error

The payment aggregator could not process the request.

```json
{
  "message": "Payment initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": { "id": "...", "status": "initiated", ... },
    "aggregator_error": "Timeout connecting to aggregator API"
  },
  "errors": null
}
```

## Best practices

1. **Always check the HTTP status code** before parsing the response body
2. **Handle 422** by displaying validation errors to the user
3. **Replay with idempotency** on timeouts or 5xx errors
4. **Implement exponential backoff** for 429 errors
5. **Log 502 errors** to diagnose aggregator issues
