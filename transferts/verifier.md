# Verifier un transfert

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payouts/{id}/verify" />

Verifie le statut d'un transfert aupres de l'agregateur et met a jour la transaction.

## Parametres de chemin

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | `string` | UUID de la transaction |

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |

## Exemple

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

## Reponse — 200 OK

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

::: tip Conseil
Privilegiez les [webhooks](/webhooks/introduction) pour etre notifie automatiquement des changements de statut.
:::
