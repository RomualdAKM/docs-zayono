# Convertir un montant

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

<ApiEndpoint method="POST" path="/v1/exchange-rates/convert" />

Convertit un montant d'une devise vers une autre en utilisant les taux de change configures.

## Parametres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant a convertir (minimum : 0.01)' },
  { name: 'from', type: 'string', required: true, description: 'Code devise source (ISO 4217, 3 lettres)' },
  { name: 'to', type: 'string', required: true, description: 'Code devise cible (ISO 4217, doit differer de from)' },
]" />

## Exemple

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

## Reponse — 200 OK

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
