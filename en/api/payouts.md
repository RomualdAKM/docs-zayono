# Payouts

The Payouts API lets you send money to a Mobile Money wallet, a card, or a bank account. Unlike inbound payments, **the operator is required** at creation — there is no hosted checkout for payouts.

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Auth**: `Authorization: Bearer zyn_test_...` or `Bearer zyn_live_...`
- **Idempotency**: `X-Idempotency-Key: <UUID v4>` on `POST /payouts/initialize`

## The Payout object

Full representation of a payout as returned by `GET /v1/payouts/{id}`.

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Unique identifier of the payout.' },
  { name: 'type', type: 'string', required: true, description: 'Always `payout`.' },
  { name: 'status', type: 'string', required: true, description: 'Current state. Same values as for payments, except `refunded` which does not exist for payouts.' },
  { name: 'amount', type: 'number', required: true, description: 'Amount to send to the recipient (2-decimal precision).' },
  { name: 'amount_charged', type: 'number | null', required: false, description: 'Amount debited from the merchant wallet when the aggregator charges fees. `null` if not applicable.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Currency of the payout.' },
  { name: 'operator', type: 'string', required: true, description: 'Destination operator code (e.g. `mtn_bj`, `orange_sn`, `wave_ci`).' },
  { name: 'country', type: 'string (ISO-2)', required: true, description: 'Country derived from the operator.' },
  { name: 'description', type: 'string | null', required: false, description: 'Description supplied by the merchant.' },
  { name: 'failure_reason', type: 'string | null', required: false, description: 'Humanized error message returned by the driver.' },
  { name: 'metadata', type: 'object | null', required: false, description: 'Free-form key/value pairs.' },
  { name: 'recipient', type: 'object | null', required: false, description: 'Recipient (id, email, first_name, last_name, phone). Mapped to the same `customers` table as a payment.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` or `live`.' },
  { name: 'processed_at', type: 'string (ISO 8601) | null', required: false, description: 'Timestamp of the transition to a terminal status.' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Creation timestamp.' },
  { name: 'updated_at', type: 'string (ISO 8601)', required: true, description: 'Last modification.' },
]" />

### Statuses

| Status | Description |
|---|---|
| `initiated` | Payout created, not yet processed. |
| `pending` | Sent to the aggregator, currently being processed. |
| `success` | Funds received by the recipient. Terminal. |
| `failed` | Declined, insufficient balance on the aggregator side, invalid number, etc. Terminal. |
| `cancelled` | Cancelled. Terminal. |

---

## Initialize a payout

<ApiEndpoint method="POST" path="/v1/payouts/initialize" />

Creates a new payout and pushes it immediately to the aggregator. A driver-side failure returns 202 plus an expected retry (fallback or webhook), not 5xx.

### Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |
| `Content-Type` | Yes | `application/json` |
| `X-Idempotency-Key` | No | UUID v4. Strongly recommended for payouts. |

### Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Amount between 1 and 10,000,000. The real minimum depends on the operator.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: '3-letter code. Must belong to the operator currencies or have an active FX rate.' },
  { name: 'operator', type: 'string', required: true, description: 'Destination operator code. List: `GET /v1/operators`.' },
  { name: 'description', type: 'string', required: false, description: 'Free-form note (max 255 characters).' },
  { name: 'recipient', type: 'object', required: true, description: 'Recipient block.' },
  { name: 'recipient.phone', type: 'string', required: true, description: 'E.164, 8 to 15 digits with an optional `+`. Destination Mobile Money number.', nested: true },
  { name: 'recipient.first_name', type: 'string', required: true, description: 'First name (max 100).', nested: true },
  { name: 'recipient.last_name', type: 'string', required: true, description: 'Last name (max 100).', nested: true },
  { name: 'recipient.email', type: 'string (email)', required: false, description: 'Recipient email (optional).', nested: true },
  { name: 'metadata', type: 'object', required: false, description: 'Free-form object persisted as JSON.' },
]" />

### Example

::: code-group

```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payouts/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440001" \
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "description": "Commission affilié - Mai 2026",
    "recipient": {
      "phone": "+22996123456",
      "first_name": "Adèle",
      "last_name": "Akpovi",
      "email": "adele@example.com"
    },
    "metadata": { "affiliate_id": "AFF-42" }
  }'
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/payouts/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '550e8400-e29b-41d4-a716-446655440001',
  },
  body: JSON.stringify({
    amount: 25000,
    currency: 'XOF',
    operator: 'mtn_bj',
    description: 'Commission affilié - Mai 2026',
    recipient: {
      phone: '+22996123456',
      first_name: 'Adèle',
      last_name: 'Akpovi',
    },
    metadata: { affiliate_id: 'AFF-42' },
  }),
})
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '550e8400-e29b-41d4-a716-446655440001'])
    ->post('https://backend.zayono.com/api/v1/payouts/initialize', [
        'amount' => 25000,
        'currency' => 'XOF',
        'operator' => 'mtn_bj',
        'description' => 'Commission affilié - Mai 2026',
        'recipient' => [
            'phone' => '+22996123456',
            'first_name' => 'Adèle',
            'last_name' => 'Akpovi',
        ],
        'metadata' => ['affiliate_id' => 'AFF-42'],
    ]);
```

```python [Python]
import requests

response = requests.post(
    "https://backend.zayono.com/api/v1/payouts/initialize",
    headers={
        "Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "X-Idempotency-Key": "550e8400-e29b-41d4-a716-446655440001",
    },
    json={
        "amount": 25000,
        "currency": "XOF",
        "operator": "mtn_bj",
        "recipient": {
            "phone": "+22996123456",
            "first_name": "Adèle",
            "last_name": "Akpovi",
        },
    },
)
```

:::

### Responses

#### 201 — Payout initialized

```json
{
  "message": "Payout initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "pending",
    "amount": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

#### 202 — Initialized but processing failed

```json
{
  "message": "Payout initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": { "id": "9e5f...", "status": "failed", "amount": 25000, "currency": "XOF", "operator": "mtn_bj", "country": "BJ", "created_at": "..." },
    "aggregator_error": "Insufficient balance on aggregator wallet"
  },
  "errors": null
}
```

#### 422 — Validation

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "operator": ["The operator field is required."],
    "recipient.phone": ["Recipient phone number is required."]
  }
}
```

---

## Retrieve a payout

<ApiEndpoint method="GET" path="/v1/payouts/{id}" />

### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | Payout UUID. |

### Example

```bash
curl https://backend.zayono.com/api/v1/payouts/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Response — 200 OK

```json
{
  "message": "Payout details retrieved.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payout",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25050,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Commission affilié - Mai 2026",
    "failure_reason": null,
    "metadata": { "affiliate_id": "AFF-42" },
    "recipient": {
      "id": "4ad...",
      "email": "adele@example.com",
      "first_name": "Adèle",
      "last_name": "Akpovi",
      "phone": "+22996123456"
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
{ "message": "Payout not found.", "data": null, "errors": null }
```

---

## Verify a payout

<ApiEndpoint method="GET" path="/v1/payouts/{id}/verify" />

Forces a re-sync from the aggregator and returns the new state.

### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | Payout UUID. |

### Response — 200 OK

```json
{
  "message": "Payout status verified.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25050,
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

The `aggregator_status` field is the raw code returned by the payout PSP (e.g. `COMPLETED`, `IN_PROGRESS`, `FAILED`).
