# Webhooks

Webhooks let your server be notified in real time when something happens on your Zayono account — a successful payment, a failed payout, a cancelled transaction. Instead of polling the API in a loop, your server receives an automatic HTTP POST request the moment a status changes.

## Event types

### Payment events

| Event | Description |
|---|---|
| `payment.initialized` | A payment has been created and is waiting to be processed |
| `payment.successful` | A payment was completed successfully |
| `payment.failed` | A payment failed |
| `payment.cancelled` | A payment was cancelled by the customer |
| `payment.refunded` | A payment was refunded |

### Payout events

| Event | Description |
|---|---|
| `payout.initialized` | A payout has been created and is waiting to be processed |
| `payout.successful` | A payout was completed successfully |
| `payout.failed` | A payout failed |
| `payout.cancelled` | A payout was cancelled |

## Webhook structure

All webhooks are sent as `POST` to your configured URL, with a JSON body containing the event and the data.

```json
{
  "event": "payment.successful",
  "data": {
    "id": "019e5eaf-cb99-7351-a6d5-c219e28534db",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "fee_percent": 2,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_code": "fedapay",
    "environment": "live",
    "customer": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "phone": "+22990123456",
      "email": "john@example.com"
    },
    "metadata": {
      "order_id": "ORD-2025-001"
    },
    "failure_reason": null,
    "processed_at": "2026-05-15T10:31:00+00:00",
    "created_at": "2026-05-15T10:30:00+00:00"
  },
  "sent_at": "2026-05-15T10:31:02+00:00"
}
```

### Payload fields

| Field | Type | Description |
|---|---|---|
| `event` | `string` | Event name (`payment.successful`, `payout.failed`, etc.) |
| `data.id` | `string` | Transaction UUID |
| `data.type` | `string` | `payment` or `payout` |
| `data.status` | `string` | Final transaction status |
| `data.amount` | `number` | Net amount (what the merchant receives) |
| `data.amount_charged` | `number` | Amount charged to the customer (= `amount` + fees if `fee_percent > 0`) |
| `data.fee_percent` | `number \| null` | Fee percentage applied (if configured on the method) |
| `data.currency` | `string` | ISO 4217 code |
| `data.operator` | `string \| null` | Operator code (e.g. `mtn_bj`) |
| `data.country` | `string \| null` | ISO 3166-1 alpha-2 code |
| `data.aggregator_code` | `string \| null` | Aggregator used (`pawapay`, `fedapay`, `stripe`…) |
| `data.environment` | `string` | `live` or `sandbox` |
| `data.customer` | `object \| null` | Customer info (`id`, `phone`, `email`) |
| `data.metadata` | `object` | Metadata you passed at initialization |
| `data.failure_reason` | `string \| null` | Failure cause (`failed` status only) |
| `data.processed_at` | `string \| null` | Completion date (ISO 8601) |
| `data.created_at` | `string` | Creation date (ISO 8601) |
| `sent_at` | `string` | Webhook send date (ISO 8601) |

## HTTP headers

Every webhook request sent by Zayono includes the following headers:

| Header | Description |
|---|---|
| `Content-Type` | `application/json` |
| `User-Agent` | `Zayono-Webhook/1.0` |
| `X-Zayono-Signature` | HMAC-SHA256 signature (see [Signature verification](#signature-verification)) |
| `X-Zayono-Event` | Event name (useful for routing without parsing the body) |
| `X-Zayono-Delivery-Id` | UUID of this delivery (useful for idempotency) |

## Configuration

Configure your webhooks from your [Zayono dashboard](https://app.zayono.com) → **Developers → Webhooks**.

When you create an endpoint, you receive a unique **webhook secret**. Keep it safe: it's used to sign every notification Zayono sends to your server.

## Receiving a webhook

Your webhook endpoint must:

1. Accept `POST` requests with `application/json`
2. Respond quickly with a `2xx` status code (Zayono timeout: **10 seconds**)
3. Process business logic asynchronously if needed

::: warning Public endpoint
Your endpoint must be reachable from the internet over HTTPS. Avoid `localhost` or private IPs — use a service like [ngrok](https://ngrok.com) for local testing.
:::

## Signature verification

Every webhook includes an **`X-Zayono-Signature`** header containing a HMAC-SHA256 of the request body, signed with your secret. **Always verify this signature** before processing the payload.

```
X-Zayono-Signature: sha256=a1b2c3d4e5f6...
```

### Process

1. Read the **raw** request body (do not parse it yet)
2. Compute the HMAC-SHA256 of the body using your `webhook_secret`
3. Compare it `timing-safely` with the received signature

### Examples

::: code-group
```javascript [Node.js]
const crypto = require('crypto')

function verifySignature(body, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

app.post('/webhooks/zayono', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-zayono-signature']
  const body = req.body.toString()

  if (!verifySignature(body, signature, process.env.ZAYONO_WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }

  const payload = JSON.parse(body)

  switch (payload.event) {
    case 'payment.successful':
      // Mark the order as paid
      break
    case 'payment.failed':
      // Notify the customer of the failure
      break
    case 'payment.refunded':
      // Reverse the order / credit the customer
      break
    case 'payout.successful':
      // Confirm the transfer
      break
  }

  res.status(200).send('OK')
})
```

```php [PHP]
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_ZAYONO_SIGNATURE'] ?? '';
$secret = getenv('ZAYONO_WEBHOOK_SECRET');

$expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Invalid signature');
}

$event = json_decode($payload, true);

match ($event['event']) {
    'payment.successful' => /* Mark the order as paid */,
    'payment.failed'     => /* Notify the failure */,
    'payment.refunded'   => /* Reverse the order */,
    'payout.successful'  => /* Confirm the transfer */,
    default              => null,
};

http_response_code(200);
echo 'OK';
```

```python [Python]
import hmac
import hashlib
import os
from flask import Flask, request, abort

app = Flask(__name__)

def verify_signature(body: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode('utf-8'),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

@app.route('/webhooks/zayono', methods=['POST'])
def webhook():
    body = request.get_data()
    signature = request.headers.get('X-Zayono-Signature', '')

    if not verify_signature(body, signature, os.environ['ZAYONO_WEBHOOK_SECRET']):
        abort(401)

    event = request.get_json()

    if event['event'] == 'payment.successful':
        # Mark the order as paid
        pass
    elif event['event'] == 'payment.refunded':
        # Reverse the order
        pass

    return 'OK', 200
```
:::

::: danger Security
- Always use a **timing-safe** comparison (`hmac.compare_digest`, `crypto.timingSafeEqual`, `hash_equals`)
- Verify the signature **before** parsing the body
- **Never** log your `webhook_secret`
:::

## Retry policy

If your server does not respond with a `2xx` status within **10 seconds**, Zayono retries automatically with exponential backoff:

| Attempt | Delay before retry |
|---|---|
| 1st | Immediate |
| 2nd | 10 seconds after failure |
| 3rd | 60 seconds after failure |

After 3 failed attempts, the webhook is marked `failed` in the dashboard. You can **replay it manually** from the webhooks interface.

## Best practices

- **Respond in under 10 seconds** with `200 OK`, then process business logic in the background
- **Handle idempotency**: use the `X-Zayono-Delivery-Id` header as an idempotency key — Zayono may deliver the same event multiple times (up to 3 retries)
- **Log raw payloads** for debugging and compliance
- **Use HTTPS** everywhere
- **Monitor webhook history** in the dashboard to detect recurring failures
