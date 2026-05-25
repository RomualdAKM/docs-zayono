# Recuperer un paiement

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payments/{id}" />

Recupere les details complets d'un paiement, y compris les informations du client et les metadonnees.

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
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8',
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
    ->get('https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8');
```
:::

## Reponse — 200 OK

```json
{
  "message": "Payment details retrieved.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "fee_percent": 2,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Abonnement Premium - Mars 2025",
    "checkout_url": null,
    "return_url": "https://votre-site.com/paiement/retour",
    "failure_reason": null,
    "metadata": {
      "order_id": "ORD-2025-001",
      "plan": "premium"
    },
    "customer": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "jean.dupont@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "environment": "sandbox",
    "processed_at": "2025-05-15T10:31:00+00:00",
    "created_at": "2025-05-15T10:30:00+00:00",
    "updated_at": "2025-05-15T10:31:00+00:00"
  },
  "errors": null
}
```

## Champs de la reponse

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `string` | Identifiant unique (UUID) |
| `type` | `string` | Type de transaction (`payment`) |
| `status` | `string` | Statut actuel |
| `amount` | `number` | Montant demande (net que le marchand recoit) |
| `amount_charged` | `number \| null` | Montant reellement debite du client, frais inclus. Egal a `amount` si la methode n'a pas de `fee_percent`. |
| `fee_percent` | `number \| null` | Pourcentage de frais applique a cette transaction (snapshot du `fee_percent` de la regle de routage au moment du paiement) |
| `currency` | `string` | Code devise |
| `operator` | `string \| null` | Code operateur utilise |
| `country` | `string \| null` | Code pays |
| `description` | `string \| null` | Description du paiement |
| `checkout_url` | `string \| null` | URL de checkout (si mode checkout) |
| `return_url` | `string \| null` | URL de redirection |
| `failure_reason` | `string \| null` | Raison de l'echec (si `failed`) |
| `metadata` | `object \| null` | Donnees personnalisees |
| `customer` | `object \| null` | Informations du client |
| `environment` | `string` | `sandbox` ou `live` |
| `processed_at` | `string \| null` | Date de traitement (ISO 8601) |
| `created_at` | `string` | Date de creation (ISO 8601) |
| `updated_at` | `string` | Date de derniere modification (ISO 8601) |
