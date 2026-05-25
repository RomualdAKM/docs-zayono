# Webhooks

Zayono notifies your server in real time on every status change of a payment or payout through **HMAC-signed webhooks**. This page covers:

1. The list of emitted events.
2. The payload structure.
3. Signature verification.
4. The retry policy.
5. CRUD management of endpoints through the v1 API.

For the conceptual details (receiver-side idempotency, duplicate handling, language-specific examples), see [Introduction to webhooks](/en/webhooks/introduction).

---

## Emitted events

| Event | Triggered by |
|---|---|
| `payment.initialized` | Payment transition to `initiated` or `pending`. |
| `payment.successful` | Payment transition to `success`. |
| `payment.failed` | Payment transition to `failed`. |
| `payment.cancelled` | Payment transition to `cancelled`. |
| `payment.refunded` | Payment transition to `refunded`. |
| `payout.initialized` | Payout transition to `initiated` or `pending`. |
| `payout.successful` | Payout transition to `success`. |
| `payout.failed` | Payout transition to `failed`. |
| `payout.cancelled` | Payout transition to `cancelled`. |

::: warning `events` filter at creation
`POST /v1/webhook-endpoints` only accepts a subset that is publicly exposed today: `payment.initialized`, `payment.successful`, `payment.failed`, `payout.initialized`, `payout.successful`, `payout.failed`. The `*.cancelled` and `*.refunded` events are dispatched internally but cannot yet appear in the subscription filter — use `payment.failed` to catch `cancelled` on the receiver side if needed.
:::

---

## Payload structure

Every delivery uses the same envelope:

```json
{
  "event": "payment.successful",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "fee_percent": 2,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_code": "paydunya",
    "environment": "sandbox",
    "customer": {
      "id": "4ad...",
      "phone": "+22990123456",
      "email": "jean@example.com"
    },
    "metadata": { "order_id": "ORD-2025-001" },
    "failure_reason": null,
    "processed_at": "2026-05-25T10:31:14+00:00",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "sent_at": "2026-05-25T10:31:14+00:00"
}
```

### Headers

| Header | Description |
|---|---|
| `Content-Type` | `application/json` |
| `User-Agent` | `Zayono-Webhook/1.0` |
| `X-Zayono-Signature` | `sha256=<hex(hmac_sha256(secret, raw_body))>` |
| `X-Zayono-Event` | Event name (e.g. `payment.successful`). |
| `X-Zayono-Delivery-Id` | Unique delivery UUID (usable as an idempotency key on the receiver side). |

---

## Signature verification

The signature is computed as HMAC-SHA256 over the **raw JSON body** (before any parsing), using the `secret` returned only once when the endpoint was created.

::: code-group

```php [PHP]
$payload = file_get_contents('php://input');
$header = $_SERVER['HTTP_X_ZAYONO_SIGNATURE'] ?? '';
$signature = str_replace('sha256=', '', $header);

$expected = hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Invalid signature');
}
```

```js [Node.js]
import crypto from 'crypto'

app.post('/webhook', express.raw({ type: '*/*' }), (req, res) => {
  const signature = (req.header('X-Zayono-Signature') || '').replace('sha256=', '')
  const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return res.sendStatus(401)
  }

  const event = JSON.parse(req.body.toString())
  // … handle event …
  res.sendStatus(200)
})
```

```python [Python]
import hmac, hashlib

@app.post("/webhook")
def webhook():
    payload = request.get_data()  # raw bytes
    signature = request.headers.get("X-Zayono-Signature", "").replace("sha256=", "")
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, signature):
        return "", 401

    event = request.get_json()
    return "", 200
```

:::

::: tip SDK helpers
The Zayono SDKs ([PHP](/en/sdks/php), [Node](/en/sdks/node), [Python](/en/sdks/python), [Laravel](/en/sdks/laravel)) expose a `verifyWebhook(payload, signature, secret)` helper that wraps the constant-time comparison and header parsing.
:::

---

## Retry policy

The `WebhookDeliveryJob` automatically retries every non-2xx delivery with exponential backoff.

| Attempt | Delay before retry |
|---|---|
| 1 | Immediate |
| 2 | +10 seconds |
| 3 | +60 seconds |
| (final failure) | +300 seconds max stored as `failed` |

- **HTTP timeout**: 10 seconds per attempt.
- **Success**: HTTP `2xx` (the response body is truncated to 2000 characters and stored for audit).
- **Non-2xx codes**: counted as a failure, retry scheduled.
- **Manual retry**: from the dashboard, `POST /merchant/webhook-logs/{log}/replay` (Sanctum auth, throttle 10/min).

See [Replay & resilience](/en/webhooks/replay) for receiver-side practice.

---

## Managing endpoints

The endpoints below let you manage your webhooks programmatically through the v1 API. A Sanctum-authenticated equivalent exists at `/api/merchant/webhook-endpoints` for the dashboard.

### List endpoints

<ApiEndpoint method="GET" path="/v1/webhook-endpoints" />

```bash
curl https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Response:

```json
{
  "message": "Webhook endpoints retrieved.",
  "data": [
    {
      "id": "0d4b8a3c-...",
      "url": "https://example.com/webhooks/zayono",
      "events": ["payment.successful", "payment.failed"],
      "secret": "************abc123",
      "is_active": true,
      "created_at": "2026-05-20T08:00:00+00:00",
      "updated_at": "2026-05-25T10:30:00+00:00"
    }
  ],
  "errors": null
}
```

The `secret` field is **masked** (12 asterisks + last 6 characters). The full value is exposed **only once**, at creation (or regeneration).

### Create an endpoint

<ApiEndpoint method="POST" path="/v1/webhook-endpoints" />

<ParamTable :params="[
  { name: 'url', type: 'string (URL)', required: true, description: 'HTTPS URL that will receive deliveries (max 2048).' },
  { name: 'events', type: 'array<string>', required: true, description: 'List of events to subscribe to. At least 1 entry. Allowed values: `payment.initialized`, `payment.successful`, `payment.failed`, `payout.initialized`, `payout.successful`, `payout.failed`.' },
]" />

```bash
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhooks/zayono",
    "events": ["payment.successful", "payment.failed"]
  }'
```

Response — 201:

```json
{
  "message": "Webhook endpoint created.",
  "data": {
    "id": "0d4b8a3c-...",
    "url": "https://example.com/webhooks/zayono",
    "events": ["payment.successful", "payment.failed"],
    "secret": "9f3a1b2c4d5e6f78901234567890abcdef1234567890abcdef1234567890abcd",
    "is_active": true,
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

::: warning `secret` exposed only once
The `secret` field is returned in plain text only in this 201 response and in the `regenerate-secret` response. Save it immediately in your vault. All later reads (`GET /webhook-endpoints`, `GET /webhook-endpoints/{id}`) return a masked version.
:::

### Retrieve an endpoint

<ApiEndpoint method="GET" path="/v1/webhook-endpoints/{id}" />

```bash
curl https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Update an endpoint

<ApiEndpoint method="PUT" path="/v1/webhook-endpoints/{id}" />

<ParamTable :params="[
  { name: 'url', type: 'string (URL)', required: false, description: 'New URL (max 2048).' },
  { name: 'events', type: 'array<string>', required: false, description: 'New event list (at least 1).' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Enable/disable without deleting.' },
]" />

```bash
curl -X PUT https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{ "is_active": false }'
```

### Delete an endpoint

<ApiEndpoint method="DELETE" path="/v1/webhook-endpoints/{id}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Regenerate the secret

<ApiEndpoint method="POST" path="/v1/webhook-endpoints/{id}/regenerate-secret" />

Use this if the secret has leaked. The new secret takes effect immediately — any in-flight delivery using the old secret will become invalid for your receiver.

```bash
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-.../regenerate-secret \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Response:

```json
{
  "message": "Webhook secret regenerated.",
  "data": {
    "id": "0d4b8a3c-...",
    "secret": "<new plain-text secret, to be saved>"
  },
  "errors": null
}
```
