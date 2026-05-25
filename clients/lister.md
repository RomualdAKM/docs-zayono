# Lister les clients

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/customers" />

Recupere la liste paginee de tous vos clients. Les clients sont crees automatiquement lors de l'initialisation des paiements et transferts.

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |

## Parametres de requete

| Parametre | Type | Description |
|-----------|------|-------------|
| `page` | `integer` | Numero de page (defaut : 1) |
| `per_page` | `integer` | Nombre de resultats par page (defaut : 20, max : 100) |

## Exemple

::: code-group
```bash [cURL]
curl "https://backend.zayono.com/api/v1/customers?page=1&per_page=20" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/customers?page=1&per_page=20',
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
  "message": "Customers retrieved successfully.",
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "jean.dupont@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456",
      "country": "BJ",
      "created_at": "2025-05-10T08:00:00+00:00"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      "email": "marie.koffi@example.com",
      "first_name": "Marie",
      "last_name": "Koffi",
      "phone": "+22597000000",
      "country": "CI",
      "created_at": "2025-05-12T10:00:00+00:00"
    }
  ],
  "errors": null
}
```
