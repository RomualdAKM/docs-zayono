# Retrieve a payment

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/payments/{id}" />

Retrieves the full details of a payment, including customer information and metadata.

## Path parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Transaction UUID |

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |

## Example

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

## Response — 200 OK

```json
{
  "message": "Payment details retrieved.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Premium subscription - March 2025",
    "checkout_url": null,
    "return_url": "https://your-site.com/payment/return",
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

## Response fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID) |
| `type` | `string` | Transaction type (`payment`) |
| `status` | `string` | Current status |
| `amount` | `number` | Requested amount (net received by the merchant) |
| `amount_charged` | `number \| null` | Amount actually charged to the customer, fees included. Equal to `amount` if no fee is configured on the method. |
| `currency` | `string` | Currency code |
| `operator` | `string \| null` | Operator code used |
| `country` | `string \| null` | Country code |
| `description` | `string \| null` | Payment description |
| `checkout_url` | `string \| null` | Checkout URL (if checkout mode) |
| `return_url` | `string \| null` | Redirect URL |
| `failure_reason` | `string \| null` | Failure reason (if `failed`) |
| `metadata` | `object \| null` | Custom data |
| `customer` | `object \| null` | Customer information |
| `environment` | `string` | `sandbox` or `live` |
| `processed_at` | `string \| null` | Processing date (ISO 8601) |
| `created_at` | `string` | Creation date (ISO 8601) |
| `updated_at` | `string` | Last update date (ISO 8601) |
