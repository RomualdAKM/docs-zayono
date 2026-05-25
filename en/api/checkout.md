# Checkout

The Checkout API creates a **hosted payment session**: Zayono generates a `https://app.zayono.com/checkout/{token}` URL that you redirect the customer to. On that page, the customer picks the operator themselves, enters their number, validates the OTP — you do not have to orchestrate the flow from your backend.

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Auth**: `Authorization: Bearer zyn_test_...` or `Bearer zyn_live_...`
- **Expiration**: 30 minutes after creation (`expires_at`).

::: tip Checkout vs `POST /v1/payments/initialize`

| | `POST /v1/checkout/initialize` | `POST /v1/payments/initialize` |
|---|---|---|
| Hosted page | Yes (Zayono branded, `app_icon`, `primary_color`) | No — you handle the UI |
| Operator choice | On the customer side (on the Zayono page) | On the server side (you force it via `operator`) |
| Templates | 3 available (`default`, `abidjan`, `cotonou`) | N/A |
| Multi-operator / FX | Yes, automatic | A single forced method |
| Status | `expires_at` after 30 min; URL is reusable | Plain transaction |
| Use case | E-commerce, cart checkout, payment link | Backoffice, pre-orchestrated subscriptions |

:::

## Create a checkout session

<ApiEndpoint method="POST" path="/v1/checkout/initialize" />

Creates a `CheckoutSession` and returns a `checkout_url` to hand to the customer.

### Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |
| `Content-Type` | Yes | `application/json` |

### Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Amount between 1 and 10,000,000 in the declared currency.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: '3-letter code. Limited to native operator currencies (XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR, …) — no exotic FX on checkout.' },
  { name: 'return_url', type: 'string (URL)', required: true, description: 'URL to redirect the customer to after a successful payment (max 500).' },
  { name: 'cancel_url', type: 'string (URL)', required: false, description: 'URL to redirect the customer to on cancellation / failure (max 500).' },
  { name: 'customer_email', type: 'string (email)', required: false, description: 'Email pre-filled on the checkout page (max 255). Also used to send the receipt.' },
  { name: 'customer_phone', type: 'string', required: false, description: 'Pre-filled phone number (E.164, 8 to 15 digits).' },
  { name: 'description', type: 'string', required: false, description: 'Shown on the payment page (max 255).' },
  { name: 'template', type: 'string', required: false, description: 'Visual variant: `default`, `abidjan`, or `cotonou`. Defaults to the value of `application.settings.checkout_template`, otherwise `default`.' },
  { name: 'metadata', type: 'object', required: false, description: 'Free-form object persisted as JSON; returned in webhooks emitted from this session.' },
]" />

### Example

::: code-group

```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/checkout/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "T-shirt premium",
    "return_url": "https://example.com/merci",
    "cancel_url": "https://example.com/panier",
    "customer_email": "jean@example.com",
    "template": "abidjan",
    "metadata": { "order_id": "ORD-2025-001" }
  }'
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/checkout/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'XOF',
    description: 'T-shirt premium',
    return_url: 'https://example.com/merci',
    cancel_url: 'https://example.com/panier',
    customer_email: 'jean@example.com',
    template: 'abidjan',
  }),
})
const { data } = await res.json()
window.location.href = data.checkout_url
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->post('https://backend.zayono.com/api/v1/checkout/initialize', [
        'amount' => 5000,
        'currency' => 'XOF',
        'description' => 'T-shirt premium',
        'return_url' => 'https://example.com/merci',
        'cancel_url' => 'https://example.com/panier',
        'customer_email' => 'jean@example.com',
        'template' => 'abidjan',
    ]);

return redirect($response['data']['checkout_url']);
```

```python [Python]
import requests

response = requests.post(
    "https://backend.zayono.com/api/v1/checkout/initialize",
    headers={"Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
    json={
        "amount": 5000,
        "currency": "XOF",
        "description": "T-shirt premium",
        "return_url": "https://example.com/merci",
        "customer_email": "jean@example.com",
    },
)
checkout_url = response.json()["data"]["checkout_url"]
```

:::

### Responses

#### 201 — Session created

```json
{
  "message": "Checkout session created successfully.",
  "data": {
    "checkout_url": "https://app.zayono.com/checkout/4f5c8e9a...d2b1",
    "session_token": "4f5c8e9a...d2b1",
    "expires_at": "2026-05-25T11:00:00+00:00"
  },
  "errors": null
}
```

#### 403 — Application or merchant suspended

```json
{ "message": "Application is inactive.", "data": null, "errors": null }
```

#### 422 — Validation

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "return_url": ["A return URL is required for redirection after payment."]
  }
}
```

---

## Templates

The `template` parameter changes the look and feel of the hosted page:

| Code | Style |
|---|---|
| `default` | Stripe-like, neutral, white/black. |
| `abidjan` | Warm colors (green/yellow), inspired by Côte d'Ivoire. |
| `cotonou` | Cyan / orange, inspired by Benin. |

See [Checkout templates](/en/checkout/templates) for the visual previews.

---

## Public client-side endpoints

The following endpoints (prefix `/api/checkout/{token}` without `/v1`) are consumed by the checkout page itself — **you do not need to call them from your server**. They are documented here for transparency and debugging.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/checkout/{token}` | Retrieves the session for display (available operators, FX, branding). Public, no-auth. Cache-Control `private, no-store`. |
| `POST` | `/checkout/{token}/process` | Kicks off the payment after operator and phone-number selection. Throttle 10/min/IP. |
| `GET` | `/checkout/{token}/status` | Polls the current status (every 0.5 s on the SPA). Throttle 120/min/IP. |
| `POST` | `/checkout/{token}/resend-otp` | Requests a fresh OTP from the PSP (Hub2 Orange only as of today). Throttle 3/min/IP. |
| `POST` | `/checkout/{token}/email-receipt` | Emails the receipt. **Can only be sent to the email captured at creation** (anti-relay). Throttle 3/min/IP. |
| `GET` | `/checkout/{token}/receipt.pdf` | Receipt download. Throttle 30/min/IP. |

::: warning Token security
The `session_token` is the session identifier — anyone who holds it can view (and trigger the payment) on the session. Do not log it, and do not put it in a shareable URL outside the legitimate flow.
:::
