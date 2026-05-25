# Webhooks

Les webhooks vous permettent d'être notifié en temps réel des événements qui surviennent sur votre compte Zayono — un paiement réussi, un transfert échoué, une transaction annulée. Plutôt que d'interroger l'API en boucle, votre serveur reçoit une requête HTTP POST automatique dès qu'un changement intervient.

## Types d'événements

### Événements de paiement

| Événement | Description |
|-----------|-------------|
| `payment.initialized` | Un paiement a été créé et est en attente de traitement |
| `payment.successful` | Un paiement a été effectué avec succès |
| `payment.failed` | Un paiement a échoué |
| `payment.cancelled` | Un paiement a été annulé par le client |

### Événements de transfert

| Événement | Description |
|-----------|-------------|
| `payout.initialized` | Un transfert a été créé et est en attente de traitement |
| `payout.successful` | Un transfert a été effectué avec succès |
| `payout.failed` | Un transfert a échoué |
| `payout.cancelled` | Un transfert a été annulé |

## Structure du webhook

Tous les webhooks sont envoyés en `POST` vers votre URL configurée, avec un corps JSON contenant l'événement et les données.

```json
{
  "event": "payment.successful",
  "data": {
    "id": "019e5eaf-cb99-7351-a6d5-c219e28534db",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "customer": {
      "email": "jean@example.com",
      "phone": "+22990123456"
    },
    "metadata": {
      "order_id": "ORD-2025-001"
    },
    "processed_at": "2026-05-15T10:31:00+00:00",
    "created_at": "2026-05-15T10:30:00+00:00"
  },
  "sent_at": "2026-05-15T10:31:02+00:00"
}
```

## Configuration

Configurez vos webhooks depuis votre [tableau de bord Zayono](https://app.zayono.com) → **Développeurs → Webhooks**.

À la création d'un endpoint, vous recevez un **secret de webhook** unique. Conservez-le : il sera utilisé pour signer chaque notification que Zayono enverra à votre serveur.

## Réception d'un webhook

Votre endpoint webhook doit :

1. Accepter les requêtes `POST` en `application/json`
2. Répondre rapidement avec un code `2xx` (idéalement en moins de 5 secondes)
3. Traiter la logique métier de manière asynchrone si besoin

::: warning Endpoint public
Votre endpoint doit être accessible depuis Internet en HTTPS. Évitez les `localhost` ou IPs privées — utilisez un service comme [ngrok](https://ngrok.com) pour les tests locaux.
:::

## Vérification de signature

Chaque webhook inclut un en-tête **`X-Zayono-Signature`** contenant un HMAC-SHA256 du corps de la requête, signé avec votre secret. **Vérifiez toujours cette signature** avant de traiter le contenu.

```
X-Zayono-Signature: sha256=a1b2c3d4e5f6...
```

### Processus

1. Récupérez le corps **brut** de la requête (ne le parsez pas avant)
2. Calculez le HMAC-SHA256 du corps avec votre `webhook_secret`
3. Comparez en `timing-safe` avec la signature reçue

### Exemples

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
      // Marquer la commande comme payée
      break
    case 'payment.failed':
      // Notifier le client de l'échec
      break
    case 'payout.successful':
      // Confirmer le transfert
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
    'payment.successful' => /* Marquer la commande comme payée */,
    'payment.failed'     => /* Notifier l'échec */,
    'payout.successful'  => /* Confirmer le transfert */,
    default              => null,
};

http_response_code(200);
echo 'OK';
```

```python [Python]
import hmac
import hashlib
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
        # Marquer la commande comme payée
        pass
    elif event['event'] == 'payment.failed':
        # Notifier l'échec
        pass

    return 'OK', 200
```
:::

::: danger Sécurité
- Utilisez toujours une comparaison **timing-safe** (`hmac.compare_digest`, `crypto.timingSafeEqual`, `hash_equals`)
- Vérifiez la signature **avant** de parser le corps
- Ne loggez **jamais** votre `webhook_secret`
:::

## Politique de retry

Si votre serveur ne répond pas avec un code `2xx` dans les 30 secondes, Zayono réessaie automatiquement :

| Tentative | Délai après l'échec précédent |
|-----------|-------------------------------|
| 1ʳᵉ | Immédiate |
| 2ᵉ | ~1 minute |
| 3ᵉ | ~5 minutes |

Après 3 tentatives échouées, le webhook est marqué comme `failed` dans le dashboard. Vous pouvez le **rejouer manuellement** depuis l'interface webhooks.

## Bonnes pratiques

- **Répondez en moins de 5 secondes** avec `200 OK`, puis traitez la logique métier en arrière-plan
- **Gérez l'idempotence** : un même événement peut être livré plusieurs fois — comparez `data.id` à votre base avant d'agir
- **Loggez les payloads bruts** pour le debugging et la conformité
- **Utilisez HTTPS** systématiquement
- **Surveillez l'historique des webhooks** dans le dashboard pour détecter les échecs récurrents
