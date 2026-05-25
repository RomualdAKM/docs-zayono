# Idempotency

Idempotency lets you **safely replay a request** without risking duplicate creation. This is especially important for financial operations.

## Principle

If a request fails because of a network issue, you can resend it with the same idempotency key. Zayono will detect the duplicate and return the original transaction instead of creating a new one.

## Usage

Add the `X-Idempotency-Key` header with a unique UUID v4:

```bash
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{ ... }'
```

## Rules

| Rule | Detail |
|-------|--------|
| **Format** | Valid UUID v4 only |
| **Scope** | Per merchant + per environment + per transaction type |
| **Uniqueness** | One distinct key per distinct operation |
| **Replay** | Same key = returns the existing transaction |

## Replay example

First request (creates the transaction):

```json
// POST /v1/payments/initialize
// X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
// → 201 Created

{
  "message": "Payment initialized successfully.",
  "data": { "id": "abc-123", "status": "initiated", ... }
}
```

Same request replayed (returns the existing transaction):

```json
// POST /v1/payments/initialize
// X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
// → 200 OK

{
  "message": "Payment already initialized.",
  "data": { "id": "abc-123", "status": "initiated", ... }
}
```

## Format error

If the key is not a valid UUID:

```json
{
  "message": "X-Idempotency-Key must be a valid UUID.",
  "data": null,
  "errors": null
}
```

**HTTP status:** `400 Bad Request`

::: tip
Generate a fresh UUID for each distinct operation. Reuse the same UUID only to replay a failed request.
:::
