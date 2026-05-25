# Quickstart

This guide walks you through making your first payment with the Zayono API in just a few minutes.

## Step 1: Create an account

Sign up on the [Zayono dashboard](https://dashboard.zayono.com) to get your merchant account.

## Step 2: Configure an aggregator

From your dashboard, go to **Aggregators** and configure at least one aggregator in **sandbox** mode. For example, add your PawaPay test API keys.

## Step 3: Create routing rules

Set up a routing rule that maps an operator (e.g. `mtn_bj`) to your configured aggregator. This tells Zayono how to process payments for that operator.

## Step 4: Get your API key

In **API keys**, create a `secret` key in the `sandbox` environment. You'll get a key in the following format:

```
zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

::: warning Heads up
The full key is shown only once at creation time. Copy it and store it somewhere safe.
:::

## Step 5: Initialize a payment

Make your first API call:

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "XOF",
    "description": "Order #1234",
    "return_url": "https://your-site.com/return",
    "customer": {
      "email": "customer@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990000000"
    },
    "operator": "mtn_bj"
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 1000,
    currency: 'XOF',
    description: 'Order #1234',
    return_url: 'https://your-site.com/return',
    customer: {
      email: 'customer@example.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+22990000000',
    },
    operator: 'mtn_bj',
  }),
})

const data = await response.json()
console.log(data)
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->post('https://backend.zayono.com/api/v1/payments/initialize', [
        'amount' => 1000,
        'currency' => 'XOF',
        'description' => 'Order #1234',
        'return_url' => 'https://your-site.com/return',
        'customer' => [
            'email' => 'customer@example.com',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '+22990000000',
        ],
        'operator' => 'mtn_bj',
    ]);

$data = $response->json();
```
:::

**Response (201 Created):**

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 1000,
    "currency": "XOF",
    "checkout_url": null,
    "return_url": "https://your-site.com/return",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

## Step 6: Verify status

Verify the payment status using the returned identifier:

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
console.log(data.data.status) // "success", "pending", "failed"
```
:::

## Step 7: Receive webhooks

Configure a webhook endpoint to receive real-time notifications. See the [Webhooks](/en/webhooks/introduction) section for details.

## Next steps

- [Authentication](/en/guide/authentification) - Understand the API key system
- [Environments](/en/guide/environnements) - Sandbox vs Production
- [Payouts](/en/transferts/introduction) - Send money
- [Checkout](/en/checkout/introduction) - Hosted payment page
