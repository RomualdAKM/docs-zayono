# Available methods

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/methods" />

Returns the payment methods available for the authenticated merchant, based on its configured routing rules.

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |

## Example

::: code-group
```bash [cURL]
curl https://backend.zayono.com/api/v1/methods \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/methods', {
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
})

const data = await response.json()
```
:::

## Response — 200 OK

```json
{
  "message": "Payment methods retrieved successfully.",
  "data": [
    {
      "code": "mtn_bj",
      "name": "MTN Mobile Money",
      "country": "BJ",
      "currency": "XOF"
    },
    {
      "code": "moov_bj",
      "name": "Moov Money",
      "country": "BJ",
      "currency": "XOF"
    },
    {
      "code": "orange_ci",
      "name": "Orange Money CI",
      "country": "CI",
      "currency": "XOF"
    }
  ],
  "errors": null
}
```

::: tip Note
The methods returned depend on the merchant's configured routing rules. If you see no methods, check that you have configured at least one [routing rule](/en/routage/introduction).
:::
