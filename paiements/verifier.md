# Verifier un paiement

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payments/{id}/verify" />

Verifie le statut d'un paiement aupres de l'agregateur et met a jour la transaction. Utilisez cet endpoint pour obtenir le statut le plus recent.

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

## Reponse — 200 OK

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

## Statuts possibles

| Statut | Description |
|--------|-------------|
| `initiated` | Transaction creee, pas encore traitee |
| `pending` | En cours de traitement |
| `success` | Paiement reussi |
| `failed` | Paiement echoue |
| `cancelled` | Paiement annule |

::: tip Conseil
Privilegiez les [webhooks](/introduction/webhooks) pour etre notifie des changements de statut plutot que de faire du polling sur cet endpoint.
:::
