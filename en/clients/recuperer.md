# Retrieve a customer

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/customers/{id}" />

Retrieves the details of a specific customer.

## Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Customer UUID |

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |

## Example

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

## Response — 200 OK

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

## Response fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID) |
| `email` | `string` | Email address |
| `first_name` | `string` | First name |
| `last_name` | `string` | Last name |
| `phone` | `string` | Phone number |
| `country` | `string` | ISO 3166-1 alpha-2 country code |
| `city` | `string \| null` | City |
| `address` | `string \| null` | Address |
| `metadata` | `object \| null` | Custom data |
| `created_at` | `string` | Creation date |
| `updated_at` | `string` | Last update date |
