# Test the connection

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="POST" path="/v1/aggregator-configs/{aggregator}/test" />

Tests the validity of your credentials by performing a verification call against the aggregator's API.

## Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `aggregator` | `string` | Aggregator code (e.g. `pawapay`, `fedapay`) |

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |

## Example

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs/pawapay/test \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/aggregator-configs/pawapay/test',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  }
)

const data = await response.json()
```
:::

## Response — 200 OK (Connection successful)

```json
{
  "message": "Connection to pawapay successful.",
  "data": {
    "aggregator": "pawapay",
    "status": "connected"
  },
  "errors": null
}
```

## Response — 422 (Connection failed)

```json
{
  "message": "Connection to pawapay failed.",
  "data": {
    "aggregator": "pawapay",
    "status": "failed",
    "error": "Invalid API key"
  },
  "errors": null
}
```

::: tip
Always test your credentials after configuring them, to make sure they are valid before processing transactions.
:::
