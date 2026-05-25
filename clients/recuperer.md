# Recuperer un client

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/customers/{id}" />

Recupere les details d'un client specifique.

## Parametres de chemin

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | `string` | UUID du client |

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |

## Exemple

::: code-group
```bash [cURL]
curl https://backend.zayono.com/api/v1/customers/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/customers/a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
  "message": "Customer retrieved successfully.",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "jean.dupont@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "phone": "+22990123456",
    "country": "BJ",
    "city": null,
    "address": null,
    "metadata": null,
    "created_at": "2025-05-10T08:00:00+00:00",
    "updated_at": "2025-05-10T08:00:00+00:00"
  },
  "errors": null
}
```

## Champs de la reponse

| Champ | Type | Description |
|-------|------|-------------|
| `id` | `string` | Identifiant unique (UUID) |
| `email` | `string` | Adresse email |
| `first_name` | `string` | Prenom |
| `last_name` | `string` | Nom de famille |
| `phone` | `string` | Numero de telephone |
| `country` | `string` | Code pays ISO 3166-1 alpha-2 |
| `city` | `string \| null` | Ville |
| `address` | `string \| null` | Adresse |
| `metadata` | `object \| null` | Donnees personnalisees |
| `created_at` | `string` | Date de creation |
| `updated_at` | `string` | Date de derniere modification |
