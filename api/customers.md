# Customers

L'API Customers expose le **référentiel client** de votre application. Un `Customer` est créé automatiquement à la première transaction (paiement ou payout) — il n'existe **pas d'endpoint de création directe** sur la v1.

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Auth** : `Authorization: Bearer zyn_test_...` ou `Bearer zyn_live_...`
- **Création** : implicite à la première transaction.

## L'objet Customer

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Identifiant unique du client.' },
  { name: 'email', type: 'string', required: true, description: 'Email du client (présent sur toutes les créations via paiement).' },
  { name: 'first_name', type: 'string', required: true, description: 'Prénom (max 100).' },
  { name: 'last_name', type: 'string', required: true, description: 'Nom (max 100).' },
  { name: 'phone', type: 'string | null', required: false, description: 'Numéro de téléphone E.164.' },
  { name: 'country', type: 'string (ISO-2) | null', required: false, description: 'Code pays alpha-2.' },
  { name: 'metadata', type: 'object | null', required: false, description: 'Paires clé/valeur libres (champ JSON sur la table `customers`).' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Horodatage de création.' },
]" />

::: info Lecture seule sur v1
La v1 expose `customers` en **lecture seule** (`GET /v1/customers`, `GET /v1/customers/{id}`). Les colonnes `city` et `address` existent en base mais ne sont pas sérialisées sur les endpoints v1 — elles sont alimentées par les drivers PSP qui les remontent. Pour modifier un client (renommage, fusion, suppression RGPD), passez par le [dashboard Zayono](https://app.zayono.com).
:::

---

## Lister les clients

<ApiEndpoint method="GET" path="/v1/customers" />

Renvoie une liste paginée des clients de l'application, triée par `created_at DESC`.

### Paramètres de query

<ParamTable :params="[
  { name: 'email', type: 'string', required: false, description: 'Filtre exact sur l’email.' },
  { name: 'phone', type: 'string', required: false, description: 'Filtre exact sur le téléphone (E.164).' },
  { name: 'country', type: 'string (ISO-2)', required: false, description: 'Filtre sur le pays.' },
  { name: 'per_page', type: 'integer', required: false, description: 'Nombre d’éléments par page (défaut 20).' },
  { name: 'page', type: 'integer', required: false, description: 'Page courante (défaut 1).' },
]" />

### Exemple

::: code-group

```bash [cURL]
curl "https://backend.zayono.com/api/v1/customers?country=BJ&per_page=50" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/customers?country=BJ', {
  headers: { 'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
})
const { data } = await res.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->get('https://backend.zayono.com/api/v1/customers', ['country' => 'BJ']);
```

```python [Python]
import requests

response = requests.get(
    "https://backend.zayono.com/api/v1/customers",
    headers={"Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
    params={"country": "BJ", "per_page": 50},
)
```

:::

### Réponse — 200 OK

```json
{
  "message": "Customers retrieved.",
  "data": {
    "customers": [
      {
        "id": "4ad8e7c2-...",
        "email": "jean@example.com",
        "first_name": "Jean",
        "last_name": "Dupont",
        "phone": "+22990123456",
        "country": "BJ",
        "created_at": "2026-05-25T10:30:00+00:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total": 142,
      "last_page": 3
    }
  },
  "errors": null
}
```

---

## Récupérer un client

<ApiEndpoint method="GET" path="/v1/customers/{id}" />

Renvoie un client avec ses **20 dernières transactions** (paiements et payouts confondus, triées par date desc).

### Paramètres de chemin

| Paramètre | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | UUID du client. |

### Exemple

```bash
curl https://backend.zayono.com/api/v1/customers/4ad8e7c2-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Réponse — 200 OK

```json
{
  "message": "Customer details retrieved.",
  "data": {
    "id": "4ad8e7c2-...",
    "email": "jean@example.com",
    "first_name": "Jean",
    "last_name": "Dupont",
    "phone": "+22990123456",
    "country": "BJ",
    "metadata": null,
    "created_at": "2026-05-25T10:30:00+00:00",
    "transactions": [
      {
        "id": "9e5f6a7b-...",
        "type": "payment",
        "status": "success",
        "amount": 5000,
        "currency": "XOF",
        "operator": "mtn_bj",
        "created_at": "2026-05-25T10:30:00+00:00"
      }
    ]
  },
  "errors": null
}
```

### Réponse — 404

```json
{ "message": "Customer not found.", "data": null, "errors": null }
```
