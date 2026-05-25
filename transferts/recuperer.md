# Recuperer un transfert

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payouts/{id}" />

Recupere les details complets d'un transfert, y compris les informations du beneficiaire et les metadonnees.

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
curl https://backend.zayono.com/api/v1/payouts/b2c3d4e5-f6a7-8901-bcde-f23456789012 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/payouts/b2c3d4e5-f6a7-8901-bcde-f23456789012',
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
  "message": "Payout details retrieved.",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "type": "payout",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Salaire - Mai 2025",
    "failure_reason": null,
    "metadata": {
      "employee_id": "EMP-042"
    },
    "recipient": {
      "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
      "email": "marie.koffi@example.com",
      "first_name": "Marie",
      "last_name": "Koffi",
      "phone": "+22990123456"
    },
    "environment": "sandbox",
    "processed_at": "2025-05-15T14:01:00+00:00",
    "created_at": "2025-05-15T14:00:00+00:00",
    "updated_at": "2025-05-15T14:01:00+00:00"
  },
  "errors": null
}
```

## Champs de la reponse

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `string` | Identifiant unique (UUID) |
| `type` | `string` | Type de transaction (`payout`) |
| `status` | `string` | Statut actuel |
| `amount` | `number` | Montant envoye |
| `amount_charged` | `number \| null` | Montant reellement debite |
| `currency` | `string` | Code devise |
| `operator` | `string` | Code operateur utilise |
| `country` | `string` | Code pays |
| `description` | `string \| null` | Description du transfert |
| `failure_reason` | `string \| null` | Raison de l'echec (si `failed`) |
| `metadata` | `object \| null` | Donnees personnalisees |
| `recipient` | `object \| null` | Informations du beneficiaire |
| `environment` | `string` | `sandbox` ou `live` |
| `processed_at` | `string \| null` | Date de traitement (ISO 8601) |
| `created_at` | `string` | Date de creation |
| `updated_at` | `string` | Date de derniere modification |
