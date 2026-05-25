# Customers

The Customers API exposes your application's **customer directory**. A `Customer` is created automatically on the first transaction (payment or payout) — there is **no direct creation endpoint** in v1.

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Auth**: `Authorization: Bearer zyn_test_...` or `Bearer zyn_live_...`
- **Creation**: implicit on the first transaction.

## The Customer object

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Unique identifier of the customer.' },
  { name: 'email', type: 'string', required: true, description: 'Customer email (present on every creation through a payment).' },
  { name: 'first_name', type: 'string', required: true, description: 'First name (max 100).' },
  { name: 'last_name', type: 'string', required: true, description: 'Last name (max 100).' },
  { name: 'phone', type: 'string | null', required: false, description: 'E.164 phone number.' },
  { name: 'country', type: 'string (ISO-2) | null', required: false, description: 'Alpha-2 country code.' },
  { name: 'metadata', type: 'object | null', required: false, description: 'Free-form key/value pairs (JSON column on the `customers` table).' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Creation timestamp.' },
]" />

::: info Read-only on v1
v1 exposes `customers` **read-only** (`GET /v1/customers`, `GET /v1/customers/{id}`). The `city` and `address` columns exist in the database but are not serialized on the v1 endpoints — they are populated by the PSP drivers that report them. To edit a customer (rename, merge, GDPR deletion), use the [Zayono dashboard](https://app.zayono.com).
:::

---

## List customers

<ApiEndpoint method="GET" path="/v1/customers" />

Returns a paginated list of the application's customers, sorted by `created_at DESC`.

### Query parameters

<ParamTable :params="[
  { name: 'email', type: 'string', required: false, description: 'Exact filter on email.' },
  { name: 'phone', type: 'string', required: false, description: 'Exact filter on phone number (E.164).' },
  { name: 'country', type: 'string (ISO-2)', required: false, description: 'Filter on country.' },
  { name: 'per_page', type: 'integer', required: false, description: 'Number of items per page (default 20).' },
  { name: 'page', type: 'integer', required: false, description: 'Current page (default 1).' },
]" />

### Example

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

### Response — 200 OK

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

## Retrieve a customer

<ApiEndpoint method="GET" path="/v1/customers/{id}" />

Returns a customer along with their **20 most recent transactions** (payments and payouts combined, sorted by date desc).

### Path parameters

| Parameter | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | Customer UUID. |

### Example

```bash
curl https://backend.zayono.com/api/v1/customers/4ad8e7c2-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Response — 200 OK

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

### Response — 404

```json
{ "message": "Customer not found.", "data": null, "errors": null }
```
