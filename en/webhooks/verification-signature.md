# Signature verification

Each webhook Zayono sends includes an **HMAC-SHA256 signature** in the HTTP headers, letting you verify that the notification really comes from Zayono.

## Signature header

```
X-Zayono-Signature: sha256=a1b2c3d4e5f6...
```

## Verification process

1. Capture the raw request body (don't parse it before verification)
2. Compute the HMAC-SHA256 of the body with your `webhook_secret`
3. Compare with the signature received in the header

## Examples

::: code-group
```javascript [Node.js]
const crypto = require('crypto')

function verifyWebhookSignature(body, signature, secret) {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

// In your Express handler
app.post('/webhooks/zayono', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-zayono-signature']
  const body = req.body.toString()

  if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }

  const payload = JSON.parse(body)

  // Process the event
  switch (payload.event) {
    case 'payment.successful':
      // Mark the order as paid
      break
    case 'payment.failed':
      // Notify the customer of the failure
      break
    case 'payout.successful':
      // Confirm the payout
      break
  }

  res.status(200).send('OK')
})
```

```php [PHP / Laravel]
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/webhooks/zayono', function (Request $request) {
    $signature = $request->header('X-Zayono-Signature');
    $body = $request->getContent();
    $secret = config('services.zayono.webhook_secret');

    $expectedSignature = 'sha256=' . hash_hmac('sha256', $body, $secret);

    if (!hash_equals($expectedSignature, $signature)) {
        return response('Invalid signature', 401);
    }

    $payload = json_decode($body, true);

    match ($payload['event']) {
        'payment.successful' => /* Mark the order as paid */,
        'payment.failed' => /* Notify the customer */,
        'payout.successful' => /* Confirm the payout */,
        default => null,
    };

    return response('OK', 200);
});
```
:::

::: danger Important
- Always use a **timing-safe** comparison to avoid timing attacks
- Verify the signature **before** parsing or processing the request body
- **Never** log your `webhook_secret`
:::
