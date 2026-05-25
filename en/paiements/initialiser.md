# Initialize a payment

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

<ApiEndpoint method="POST" path="/v1/payments/initialize" />

Creates a new payment transaction. If an `operator` is specified, the payment is processed immediately. Otherwise, a checkout URL is returned.

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |
| `Content-Type` | Yes | `application/json` |
| `X-Idempotency-Key` | No | UUID v4 to avoid duplicates |

## Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Payment amount (minimum: 1, maximum: 10,000,000)' },
  { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code (e.g. XOF, XAF, GHS)' },
  { name: 'description', type: 'string', required: true, description: 'Payment description (max 255 characters)' },
  { name: 'return_url', type: 'string', required: true, description: 'Redirect URL after payment (max 500 characters)' },
  { name: 'customer', type: 'object', required: true, description: 'Customer information' },
  { name: 'customer.email', type: 'string', required: true, description: 'Customer email address (max 255)', nested: true },
  { name: 'customer.first_name', type: 'string', required: true, description: 'Customer first name (max 100)', nested: true },
  { name: 'customer.last_name', type: 'string', required: true, description: 'Customer last name (max 100)', nested: true },
  { name: 'customer.phone', type: 'string', required: false, description: 'International phone number (regex ^\\+?[0-9]{8,15}$)', nested: true },
  { name: 'customer.country', type: 'string', required: false, description: 'ISO 3166-1 alpha-2 country code', nested: true },
  { name: 'metadata', type: 'object', required: false, description: 'Custom data (key-value pairs)' },
  { name: 'methods', type: 'array', required: false, description: 'Filter accepted payment methods' },
  { name: 'operator', type: 'string', required: false, description: 'Operator code (e.g. mtn_bj). If specified, the payment is processed immediately.' },
]" />

## Examples

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "Premium subscription - March 2025",
    "return_url": "https://your-site.com/payment/return",
    "customer": {
      "email": "jean.dupont@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "operator": "mtn_bj",
    "metadata": {
      "order_id": "ORD-2025-001",
      "plan": "premium"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '550e8400-e29b-41d4-a716-446655440000',
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'XOF',
    description: 'Premium subscription - March 2025',
    return_url: 'https://your-site.com/payment/return',
    customer: {
      email: 'jean.dupont@example.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+22990123456',
    },
    operator: 'mtn_bj',
    metadata: {
      order_id: 'ORD-2025-001',
      plan: 'premium',
    },
  }),
})

const data = await response.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '550e8400-e29b-41d4-a716-446655440000'])
    ->post('https://backend.zayono.com/api/v1/payments/initialize', [
        'amount' => 5000,
        'currency' => 'XOF',
        'description' => 'Premium subscription - March 2025',
        'return_url' => 'https://your-site.com/payment/return',
        'customer' => [
            'email' => 'jean.dupont@example.com',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '+22990123456',
        ],
        'operator' => 'mtn_bj',
        'metadata' => [
            'order_id' => 'ORD-2025-001',
            'plan' => 'premium',
        ],
    ]);
```
:::

## Responses

### 201 — Payment initialized

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 5000,
    "currency": "XOF",
    "checkout_url": null,
    "return_url": "https://your-site.com/payment/return",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

::: tip Fees passed on to the customer
If the selected method has a `fee_percent` configured on your account, the amount charged to the customer is automatically increased. You can fetch the breakdown (`amount`, `amount_charged`, `fee_percent`) by calling [`GET /v1/payments/{id}`](/en/paiements/retrouver) after initialization or by listening to the `payment.successful` webhook which includes these fields.
:::

::: info About `checkout_url`
For Mobile Money payments, `checkout_url` is always `null` — the flow runs through an OTP on the customer's phone, with no web redirect. For card payments or for the few operators that require an intermediate page (rare), `checkout_url` contains the URL to redirect the customer to.

If you want a **hosted payment page** in every case (with operator selection on the customer side), use the dedicated [`POST /v1/checkout/initialize`](/en/paiements/integration-standard) endpoint instead — its response always populates `checkout_url`.
:::

### 202 — Accepted but processing failed

The payment was created but the aggregator could not process it. A retry will be attempted via fallback or webhook.

```json
{
  "message": "Payment initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": {
      "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
      "status": "initiated",
      "amount": 5000,
      "currency": "XOF",
      "checkout_url": null,
      "return_url": "https://your-site.com/payment/return",
      "created_at": "2025-05-15T10:30:00+00:00"
    },
    "aggregator_error": "Timeout connecting to aggregator API"
  },
  "errors": null
}
```

### 422 — Validation error

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "customer.email": ["The customer.email field is required."]
  }
}
```

### 401 — Not authenticated

```json
{
  "message": "Invalid or missing API key.",
  "data": null,
  "errors": null
}
```
