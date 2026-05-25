# Methodes disponibles

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/methods" />

Retourne les methodes de paiement disponibles pour le marchand authentifie, basees sur ses regles de routage configurees.

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |

## Exemple

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

## Reponse — 200 OK

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
Les methodes retournees dependent des regles de routage configurees par le marchand. Si vous ne voyez aucune methode, verifiez que vous avez configure au moins une [regle de routage](/routage/introduction).
:::
