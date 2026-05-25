# API conventions

Conventions shared by all `/api/v1/*` endpoints. Read this page once, then you can jump straight to any endpoint.

## Authentication

Every request requires an `Authorization: Bearer <key>` header:

```http
Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

See [Authentication](/en/guide/authentification) to generate a key.

## Response format

All responses follow the envelope:

```json
{
  "message": "Payment created.",
  "data": { /* ... resource or list ... */ },
  "errors": null
}
```

On error:

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount must be at least 100."]
  }
}
```

See [Response format](/en/guide/format-reponses) and [Error handling](/en/guide/gestion-erreurs).

## HTTP status codes

| Code | Meaning |
|---|---|
| 200 | OK — resource retrieved |
| 201 | Created — resource created |
| 204 | No Content — action performed, no body |
| 400 | Bad Request — invalid body |
| 401 | Unauthorized — missing or invalid key |
| 403 | Forbidden — access denied |
| 404 | Not Found — unknown resource |
| 409 | Conflict — idempotency key reused with a different body |
| 422 | Unprocessable Entity — validation failed (`errors` carries details) |
| 429 | Too Many Requests — rate limit exceeded (`Retry-After` in headers) |
| 5xx | Server Error — retry with backoff recommended |

## Idempotency

All mutating requests accept `Idempotency-Key` (UUID or ULID recommended):

```http
POST /api/v1/payments
Idempotency-Key: 019e5eaf-cb99-7351-a6d5-c219e28534db
```

See [Idempotency](/en/guide/idempotence).

## Pagination

List endpoints return:

```json
{
  "data": [/* ... */],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 142,
    "last_page": 10
  }
}
```

Query params: `?page=2&per_page=25` (max 100 per page).

## Rate limits

- **API key**: 100 req/min on average, burst 200
- **Dashboard auth**: 60 req/min per session

The `X-RateLimit-Remaining` header is included on every response. See [Rate limits](/en/guide/limites-debit).

## Environments

- **Sandbox**: `zyn_test_*` keys. No real money is charged.
- **Live**: `zyn_live_*` keys. Real money.

The environment is derived from the key. No extra header is required.

## Webhooks

Every status change (payment, payout, refund) triggers an HMAC-SHA256-signed webhook. See [Webhooks](/en/webhooks/introduction).
