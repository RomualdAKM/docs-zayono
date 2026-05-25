# Webhook events

Zayono emits webhooks for the following events. You can choose which events to listen for when you create your endpoint.

## Event list

| Event | Description |
|-----------|-------------|
| `payment.initialized` | A payment has been created and is waiting for processing |
| `payment.successful` | A payment has completed successfully |
| `payment.failed` | A payment has failed |
| `payout.initialized` | A payout has been created and is waiting for processing |
| `payout.successful` | A payout has completed successfully |
| `payout.failed` | A payout has failed |

## Payload format

All webhooks are sent as `POST` with a wrapped JSON body:

- `event`: event name (e.g. `payment.successful`)
- `data`: object containing the full transaction
- `sent_at`: webhook send date (ISO 8601)

### Example: `payment.successful`

```json
{
  "event": "payment.successful",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "fee_percent": 2,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_code": "fedapay",
    "environment": "live",
    "customer": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "jean.dupont@example.com",
      "phone": "+22990123456"
    },
    "metadata": {
      "order_id": "ORD-2025-001"
    },
    "failure_reason": null,
    "processed_at": "2025-05-15T10:31:00+00:00",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "sent_at": "2025-05-15T10:31:02+00:00"
}
```

### Example: `payout.failed`

```json
{
  "event": "payout.failed",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "type": "payout",
    "status": "failed",
    "amount": 25000,
    "amount_charged": 25000,
    "fee_percent": null,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_code": "pawapay",
    "environment": "live",
    "customer": {
      "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
      "email": "marie.koffi@example.com",
      "phone": "+22990123456"
    },
    "metadata": {
      "employee_id": "EMP-042"
    },
    "failure_reason": "Insufficient funds on aggregator wallet",
    "processed_at": "2025-05-15T14:02:00+00:00",
    "created_at": "2025-05-15T14:00:00+00:00"
  },
  "sent_at": "2025-05-15T14:02:01+00:00"
}
```

## Payload fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | `string` | Event name |
| `data.id` | `string` | Transaction UUID |
| `data.type` | `string` | `payment` or `payout` |
| `data.status` | `string` | Final status (`success`, `failed`, `cancelled`...) |
| `data.amount` | `number` | Net amount (what the merchant receives) |
| `data.amount_charged` | `number` | Amount charged to the customer (= `amount` + fees if `fee_percent > 0`) |
| `data.fee_percent` | `number \| null` | Fee percentage applied (if configured on the method) |
| `data.currency` | `string` | ISO 4217 currency code |
| `data.operator` | `string \| null` | Operator code (e.g. `mtn_bj`) |
| `data.country` | `string \| null` | ISO-2 country code (e.g. `BJ`) |
| `data.aggregator_code` | `string \| null` | Aggregator that processed the transaction |
| `data.environment` | `string` | `sandbox` or `live` |
| `data.customer` | `object \| null` | Customer/recipient information |
| `data.metadata` | `object \| null` | Custom data supplied at init time |
| `data.failure_reason` | `string \| null` | Error message (if `failed`) |
| `data.processed_at` | `string \| null` | Processing date by the aggregator (ISO 8601) |
| `data.created_at` | `string` | Transaction creation date (ISO 8601) |
| `sent_at` | `string` | Webhook send date (ISO 8601) |
