# Payments

The Payments API lets you create, verify, and retrieve inbound payments. All endpoints are scoped to the application linked to the API key in use.

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Auth**: `Authorization: Bearer zyn_test_...` or `Bearer zyn_live_...`
- **Idempotency**: `X-Idempotency-Key: <UUID v4>` on `POST /payments/initialize`

## The Payment object

Full representation of a payment as returned by `GET /v1/payments/{id}`.

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Unique identifier of the transaction (UUID v7, cast via HasUuids).' },
  { name: 'type', type: 'string', required: true, description: 'Always `payment` on this endpoint (as opposed to `payout`).' },
  { name: 'status', type: 'string', required: true, description: 'Current state. See Statuses below.' },
  { name: 'amount', type: 'number', required: true, description: 'Amount charged to the merchant, in the declared currency (2-decimal precision).' },
  { name: 'amount_charged', type: 'number | null', required: false, description: 'Amount actually debited from the customer when the merchant has configured a fee_percent. `null` if no surcharge.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Currency of the transaction (XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR, …). The filter accepts any currency present in `operators.php` or in an active `ExchangeRate`.' },
  { name: 'operator', type: 'string | null', required: false, description: 'Operator code (e.g. `mtn_bj`, `orange_ci`, `wave_sn`, `card`, `crypto_global`). `null` until the customer has picked their method on the checkout.' },
  { name: 'country', type: 'string (ISO-2) | null', required: false, description: 'Country derived from the operator. `XX` for international operators (Stripe, global crypto).' },
  { name: 'description', type: 'string', required: false, description: 'Free-form text supplied by the merchant at creation.' },
  { name: 'checkout_url', type: 'string | null', required: false, description: 'Hosted URL to redirect the customer to. `null` for Mobile Money push-to-pay flows.' },
  { name: 'return_url', type: 'string', required: true, description: 'Return URL supplied by the merchant.' },
  { name: 'failure_reason', type: 'string | null', required: false, description: 'Humanized error message returned by the driver (sanitized, no PAN or headers).' },
  { name: 'metadata', type: 'object | null', required: false, description: 'Free-form key/value pairs supplied at creation. Persisted as JSON.' },
  { name: 'customer', type: 'object | null', required: false, description: 'Snapshot of the customer (id, email, first_name, last_name, phone) at creation.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` or `live`, derived from the API key prefix.' },
  { name: 'processed_at', type: 'string (ISO 8601) | null', required: false, description: 'Timestamp when the transaction reached a terminal status (success/failed/cancelled).' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Creation timestamp.' },
  { name: 'updated_at', type: 'string (ISO 8601)', required: true, description: 'Last modification.' },
]" />

### Statuses

See [Payment statuses](/en/paiements/statuts) for the full state machine. Summary:

| Status | Description |
|---|---|
| `initiated` | Transaction created on the Zayono side, not yet sent to the aggregator. |
| `pending` | Sent to the aggregator, awaiting confirmation (OTP, USSD, hosted redirect). |
| `success` | Payment confirmed by the aggregator. Terminal. |
| `failed` | Payment declined / timed out / errored. Terminal. |
| `cancelled` | Cancelled by the customer or expired on the Zayono side. Terminal. |
| `refunded` | Refunded after a `success`. Terminal. |

---

## Initialize a payment

<ApiEndpoint method="POST" path="/v1/payments/initialize" />

Creates a new payment transaction. If `operator` is supplied, the payment is processed immediately (Mobile Money push, hosted redirect). Otherwise, the payment stays in the `initiated` state until a checkout session associates it with an operator.

### Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |
| `Content-Type` | Yes | `application/json` |
| `X-Idempotency-Key` | No | UUID v4. A retry with the same key returns the existing transaction. |

### Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Amount between 1 and 10,000,000 in the declared currency. The real minimum depends on the operator (e.g. 100 XOF for MTN BJ).' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: '3-letter code. Must be one of the supported currencies (XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR, or any currency with an active FX rate).' },
  { name: 'description', type: 'string', required: true, description: 'Payment description (max 255 characters).' },
  { name: 'return_url', type: 'string (URL)', required: true, description: 'Absolute URL to redirect the customer to after payment (max 500 characters).' },
  { name: 'customer', type: 'object', required: true, description: 'Customer block.' },
  { name: 'customer.email', type: 'string (email)', required: true, description: 'Customer email.', nested: true },
  { name: 'customer.first_name', type: 'string', required: true, description: 'First name (max 100).', nested: true },
  { name: 'customer.last_name', type: 'string', required: true, description: 'Last name (max 100).', nested: true },
  { name: 'customer.phone', type: 'string', required: false, description: 'E.164, 8 to 15 digits with an optional `+`. Required for Mobile Money.', nested: true },
  { name: 'customer.country', type: 'string (ISO-2)', required: false, description: 'Alpha-2 country code.', nested: true },
  { name: 'operator', type: 'string', required: false, description: 'Operator code (e.g. `mtn_bj`, `orange_ci`, `wave_sn`, `card`). If supplied, the payment is processed immediately. Must be listed in `operators.php`.' },
  { name: 'methods', type: 'array<string>', required: false, description: 'List of operators allowed to appear on the checkout page (filter).' },
  { name: 'metadata', type: 'object', required: false, description: 'Free-form object persisted as JSON. Returned as-is in webhooks.' },
]" />

### Example

::: code-group

```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "Abonnement Premium",
    "return_url": "https://example.com/retour",
    "customer": {
      "email": "jean@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "operator": "mtn_bj",
    "metadata": { "order_id": "ORD-2025-001" }
  }'
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '550e8400-e29b-41d4-a716-446655440000',
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'XOF',
    description: 'Abonnement Premium',
    return_url: 'https://example.com/retour',
    customer: {
      email: 'jean@example.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+22990123456',
    },
    operator: 'mtn_bj',
    metadata: { order_id: 'ORD-2025-001' },
  }),
})
const data = await res.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '550e8400-e29b-41d4-a716-446655440000'])
    ->post('https://backend.zayono.com/api/v1/payments/initialize', [
        'amount' => 5000,
        'currency' => 'XOF',
        'description' => 'Abonnement Premium',
        'return_url' => 'https://example.com/retour',
        'customer' => [
            'email' => 'jean@example.com',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '+22990123456',
        ],
        'operator' => 'mtn_bj',
        'metadata' => ['order_id' => 'ORD-2025-001'],
    ]);
```

```python [Python]
import requests

response = requests.post(
    "https://backend.zayono.com/api/v1/payments/initialize",
    headers={
        "Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "X-Idempotency-Key": "550e8400-e29b-41d4-a716-446655440000",
    },
    json={
        "amount": 5000,
        "currency": "XOF",
        "description": "Abonnement Premium",
        "return_url": "https://example.com/retour",
        "customer": {
            "email": "jean@example.com",
            "first_name": "Jean",
            "last_name": "Dupont",
            "phone": "+22990123456",
        },
        "operator": "mtn_bj",
        "metadata": {"order_id": "ORD-2025-001"},
    },
)
```

:::

### Responses

#### 201 — Payment initialized

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 5000,
    "currency": "XOF",
    "checkout_url": null,
    "return_url": "https://example.com/retour",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

#### 202 — Initialized but processing failed (retry expected)

The aggregator declined the first attempt; a fallback or webhook will retry the rest.

```json
{
  "message": "Payment initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": { "id": "9e5f...", "status": "failed", "amount": 5000, "currency": "XOF", "checkout_url": null, "return_url": "...", "created_at": "..." },
    "aggregator_error": "Timeout connecting to aggregator API"
  },
  "errors": null
}
```

#### 400 — Invalid idempotency key

```json
{ "message": "X-Idempotency-Key must be a valid UUID.", "data": null, "errors": null }
```

#### 403 — Application or merchant suspended

```json
{ "message": "Application is inactive.", "data": null, "errors": null }
```

#### 422 — Validation

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "customer.email": ["The customer.email field is required."]
  }
}
```

---

## Retrieve a payment

<ApiEndpoint method="GET" path="/v1/payments/{id}" />

Returns the full state of a payment, including `customer`, `metadata`, `failure_reason`, and timestamps.

### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | Transaction UUID. |

### Example

```bash
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Response — 200 OK

```json
{
  "message": "Payment details retrieved.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Abonnement Premium",
    "checkout_url": null,
    "return_url": "https://example.com/retour",
    "failure_reason": null,
    "metadata": { "order_id": "ORD-2025-001" },
    "customer": {
      "id": "4ad...",
      "email": "jean@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "environment": "sandbox",
    "processed_at": "2026-05-25T10:31:14+00:00",
    "created_at": "2026-05-25T10:30:00+00:00",
    "updated_at": "2026-05-25T10:31:14+00:00"
  },
  "errors": null
}
```

### Response — 404

```json
{ "message": "Payment not found.", "data": null, "errors": null }
```

---

## Verify a payment

<ApiEndpoint method="GET" path="/v1/payments/{id}/verify" />

Forces a re-sync of the status from the aggregator (a `verifyTransaction` call) and returns the new state. Useful when your webhook missed an event or to confirm a status backend-side before fulfillment.

::: tip Prefer webhooks
This endpoint performs a network round-trip to the PSP. For real-time status notifications, prefer [webhooks](/en/webhooks/introduction).
:::

### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | Transaction UUID. |

### Example

```bash
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Response — 200 OK

```json
{
  "message": "Payment status verified.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_status": "COMPLETED",
    "failure_reason": null,
    "processed_at": "2026-05-25T10:31:14+00:00",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

The `aggregator_status` field is the raw code returned by the PSP (e.g. `COMPLETED`, `SUCCESS`, `FAILED`, `PROCESSING`). The `status` field is its Zayono-normalized version.

---

## Retries & idempotency

- **Race condition**: two concurrent requests with the same `X-Idempotency-Key` result in a single transaction. The second one receives the same response.
- **MySQL 1062 conflict**: caught internally and translated back into an idempotent success.
- **Without an idempotency key**: no protection; two fast clicks on the frontend can create two separate transactions.

See [Idempotency](/en/guide/idempotence) for the details.
