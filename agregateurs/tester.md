# Tester la connexion

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="POST" path="/v1/aggregator-configs/{aggregator}/test" />

Teste la validite de vos credentials en effectuant un appel de verification aupres de l'API de l'agregateur.

## Parametres de chemin

| Parametre | Type | Description |
|-----------|------|-------------|
| `aggregator` | `string` | Code de l'agregateur (ex: `pawapay`, `fedapay`) |

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |

## Exemple

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

## Reponse — 200 OK (Connexion reussie)

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

## Reponse — 422 (Echec de connexion)

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

::: tip Conseil
Testez toujours vos credentials apres les avoir configurees pour vous assurer qu'elles sont valides avant de traiter des transactions.
:::
