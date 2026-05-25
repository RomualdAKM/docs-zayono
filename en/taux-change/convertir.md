# Convert an amount

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

<ApiEndpoint method="POST" path="/v1/exchange-rates/convert" />

Converts an amount from one currency to another using the configured exchange rates.

## Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Amount to convert (minimum: 0.01)' },
  { name: 'from', type: 'string', required: true, description: 'Source currency code (ISO 4217, 3 letters)' },
  { name: 'to', type: 'string', required: true, description: 'Target currency code (ISO 4217, must differ from from)' },
]" />

## Example

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/exchange-rates/convert \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "from": "XOF",
    "to": "GHS"
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/exchange-rates/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 10000,
    from: 'XOF',
    to: 'GHS',
  }),
})
```
:::

## Response — 200 OK

```json
{
  "message": "Conversion successful.",
  "data": {
    "amount": 10000,
    "from": "XOF",
    "to": "GHS",
    "rate": 0.0250,
    "converted_amount": 250.00
  },
  "errors": null
}
```
