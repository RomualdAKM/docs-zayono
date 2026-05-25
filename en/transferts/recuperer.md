# Retrieve a payout

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payouts/{id}" />

Retrieves the full details of a payout, including recipient information and metadata.

## Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Transaction UUID |

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |

## Example

::: code-group
```bash [cURL]
curl https://backend.zayono.com/api/v1/payouts/b2c3d4e5-f6a7-8901-bcde-f23456789012 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/payouts/b2c3d4e5-f6a7-8901-bcde-f23456789012',
  {
    headers: {
      'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  }
)

const data = await response.json()
```
:::

## Response — 200 OK

```json
{
  "message": "Payout details retrieved.",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "type": "payout",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Salary - May 2025",
    "failure_reason": null,
    "metadata": {
      "employee_id": "EMP-042"
    },
    "recipient": {
      "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
      "email": "marie.koffi@example.com",
      "first_name": "Marie",
      "last_name": "Koffi",
      "phone": "+22990123456"
    },
    "environment": "sandbox",
    "processed_at": "2025-05-15T14:01:00+00:00",
    "created_at": "2025-05-15T14:00:00+00:00",
    "updated_at": "2025-05-15T14:01:00+00:00"
  },
  "errors": null
}
```

## Response fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID) |
| `type` | `string` | Transaction type (`payout`) |
| `status` | `string` | Current status |
| `amount` | `number` | Amount sent |
| `amount_charged` | `number \| null` | Amount actually charged |
| `currency` | `string` | Currency code |
| `operator` | `string` | Operator code used |
| `country` | `string` | Country code |
| `description` | `string \| null` | Payout description |
| `failure_reason` | `string \| null` | Failure reason (if `failed`) |
| `metadata` | `object \| null` | Custom data |
| `recipient` | `object \| null` | Recipient information |
| `environment` | `string` | `sandbox` or `live` |
| `processed_at` | `string \| null` | Processing date (ISO 8601) |
| `created_at` | `string` | Creation date |
| `updated_at` | `string` | Last update date |
