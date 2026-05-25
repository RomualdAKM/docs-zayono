# Verification de signature

Chaque webhook envoye par Zayono inclut une **signature HMAC-SHA256** dans les en-tetes HTTP, vous permettant de verifier que la notification provient bien de Zayono.

## En-tete de signature

```
X-Zayono-Signature: sha256=a1b2c3d4e5f6...
```

## Processus de verification

1. Recuperez le corps brut de la requete (ne le parsez pas avant la verification)
2. Calculez le HMAC-SHA256 du corps avec votre `webhook_secret`
3. Comparez avec la signature recue dans l'en-tete

## Exemples

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

// Dans votre handler Express
app.post('/webhooks/zayono', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-zayono-signature']
  const body = req.body.toString()

  if (!verifyWebhookSignature(body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }

  const payload = JSON.parse(body)

  // Traitez l'evenement
  switch (payload.event) {
    case 'payment.successful':
      // Marquer la commande comme payee
      break
    case 'payment.failed':
      // Notifier le client de l'echec
      break
    case 'payout.successful':
      // Confirmer le transfert
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
        'payment.successful' => /* Marquer la commande comme payee */,
        'payment.failed' => /* Notifier le client */,
        'payout.successful' => /* Confirmer le transfert */,
        default => null,
    };

    return response('OK', 200);
});
```
:::

::: danger Important
- Utilisez toujours une comparaison **timing-safe** pour eviter les attaques temporelles
- Verifiez la signature **avant** de parser ou traiter le corps de la requete
- Ne loggez **jamais** votre `webhook_secret`
:::
