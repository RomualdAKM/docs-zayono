# Checkout — Hosted payment page

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

The hosted checkout lets you redirect your customers to a **secure payment page** managed by Zayono, with no need to build your own payment UI.

## Flow

```
1. Your server                      2. Redirect            3. Payment
   POST /v1/checkout/initialize  →  Customer redirected →  Customer picks
   ← checkout_url                    to checkout_url        operator and pays
                                                              ↓
4. Return                                              5. Webhook
   Customer redirected to return_url                     → Your server
```

## Initialize a session

<ApiEndpoint method="POST" path="/v1/checkout/initialize" />

Creates a checkout session and returns a URL to redirect your customer to.

### Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |
| `Content-Type` | Yes | `application/json` |

### Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Payment amount (minimum: 1, maximum: 10,000,000)' },
  { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code (e.g. XOF, XAF, GHS, KES)' },
  { name: 'return_url', type: 'string', required: true, description: 'Redirect URL after successful payment (max 500)' },
  { name: 'cancel_url', type: 'string', required: false, description: 'Redirect URL on cancellation (max 500)' },
  { name: 'customer_phone', type: 'string', required: false, description: 'Customer phone number in international format (pre-filled on the page)' },
  { name: 'customer_email', type: 'string', required: false, description: 'Customer email (pre-filled)' },
  { name: 'description', type: 'string', required: false, description: 'Description shown on the payment page (max 255)' },
  { name: 'metadata', type: 'object', required: false, description: 'Custom data attached to the transaction' },
  { name: 'template', type: 'string', required: false, description: 'Page appearance: default, abidjan (mobile-first) or cotonou (desktop 2-col). If omitted, uses the default template configured on your account.' },
]" />

### Example

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/checkout/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 15000,
    "currency": "XOF",
    "return_url": "https://your-site.com/thank-you",
    "cancel_url": "https://your-site.com/cancelled",
    "customer_email": "customer@example.com",
    "description": "Premium Pack",
    "metadata": {
      "order_id": "ORD-789"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/checkout/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 15000,
    currency: 'XOF',
    return_url: 'https://your-site.com/thank-you',
    cancel_url: 'https://your-site.com/cancelled',
    customer_email: 'customer@example.com',
    description: 'Premium Pack',
    metadata: {
      order_id: 'ORD-789',
    },
  }),
})

const data = await response.json()
// Redirect the customer to data.data.checkout_url
window.location.href = data.data.checkout_url
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->post('https://backend.zayono.com/api/v1/checkout/initialize', [
        'amount' => 15000,
        'currency' => 'XOF',
        'return_url' => 'https://your-site.com/thank-you',
        'cancel_url' => 'https://your-site.com/cancelled',
        'customer_email' => 'customer@example.com',
        'description' => 'Premium Pack',
        'metadata' => ['order_id' => 'ORD-789'],
    ]);

// Redirect the customer
return redirect($response->json('data.checkout_url'));
```
:::

### Response — 201 Created

```json
{
  "message": "Checkout session created successfully.",
  "data": {
    "checkout_url": "https://app.zayono.com/checkout/a1b2c3d4e5f6...",
    "session_token": "a1b2c3d4e5f6...",
    "expires_at": "2025-05-15T11:00:00+00:00"
  },
  "errors": null
}
```

## Checkout page templates

Three appearances are available for the hosted page. You can either:

- enforce a template per session via the `template` parameter above,
- or set a **default template** in your dashboard (Payments → Settings → Appearance), which applies to every session without an explicit `template`.

| Code | Style | When to use it |
|------|-------|------------------|
| `default` | Balanced layout, works on mobile and desktop | A safe choice if you're not sure |
| `abidjan` | **Mobile-first**, full-height layout, amount up front, sticky CTA | Your customers pay mostly from a phone |
| `cotonou` | **Desktop-first**, 2 columns (summary on the left, form on the right) | Your customers pay from a desktop (classic e-commerce) |

## Colour customisation

You can replace the primary colour of buttons and accents with your own brand colour from Payments → Settings → Appearance → **Your brand colours**. The colour is:

- stored as a hexadecimal code `#RRGGBB`,
- applied to **all three** checkout templates (`default`, `abidjan`, `cotonou`),
- injected as a CSS variable (`--checkout-primary`) on the hosted page, with no server-side recompilation.

The settings page computes the **WCAG contrast ratio** against the white button text in real time. If the contrast is low (< 4.5:1), a warning is shown to flag that the buttons may be hard to read — saving is still allowed so we don't get in the way of your branding, but the warning stays visible. Leave the field empty to revert to the default Zayono blue.

The API exposes the configured colour in the `GET /v1/checkout/{token}` response under `data.merchant.branding.primary_color` (or `null` if not configured), in case you're building a custom integration yourself.

## Transaction fees

If the method the customer picks has a `fee_percent` configured in your routing rules, the amount charged to the customer is **automatically** increased. For example, on a 1,000 XOF payment via a method configured at 2%, the customer pays 1,020 XOF. The checkout page displays the breakdown (Subtotal / Fees / Total) before confirmation. See from your dashboard (Methods) for details.

## Expiration

Checkout sessions expire after **30 minutes**. Past that:

- The checkout page shows an expiration message
- The API returns `410 Gone` if you try to query the session
- You must create a new session

## After the payment

Once the payment is made:

1. The customer is redirected to your `return_url`
2. A [webhook](/en/introduction/webhooks) is sent to your configured endpoints
3. You can verify the status via `GET /v1/payments/{id}/verify`

::: warning Important
Don't rely on the redirect alone to confirm the payment. Always use webhooks or the verification endpoint to confirm the status on the server side.
:::
