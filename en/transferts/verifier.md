# Verify a payout

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payouts/{id}/verify" />

Verifies a payout's status with the aggregator and updates the transaction.

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
curl https://backend.zayono.com/api/v1/payouts/b2c3d4e5-f6a7-8901-bcde-f23456789012/verify \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/payouts/b2c3d4e5-f6a7-8901-bcde-f23456789012/verify',
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
  "message": "Payout status verified.",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_status": "COMPLETED",
    "failure_reason": null,
    "processed_at": "2025-05-15T14:01:00+00:00",
    "created_at": "2025-05-15T14:00:00+00:00"
  },
  "errors": null
}
```

::: tip
Prefer [webhooks](/en/introduction/webhooks) to be notified automatically of status changes.
:::
