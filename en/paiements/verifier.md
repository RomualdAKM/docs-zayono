# Verify a payment

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payments/{id}/verify" />

Verifies a payment's status with the aggregator and updates the transaction. Use this endpoint to get the latest status.

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
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify',
  {
    headers: {
      'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  }
)

const data = await response.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->get('https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify');
```
:::

## Response — 200 OK

```json
{
  "message": "Payment status verified.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_status": "COMPLETED",
    "failure_reason": null,
    "processed_at": "2025-05-15T10:31:00+00:00",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

## Possible statuses

| Status | Description |
|--------|-------------|
| `initiated` | Transaction created, not yet processed |
| `pending` | Being processed |
| `success` | Payment succeeded |
| `failed` | Payment failed |
| `cancelled` | Payment cancelled |

::: tip
Prefer [webhooks](/en/webhooks/introduction) to be notified of status changes rather than polling this endpoint.
:::
