# Webhooks

Zayono notifie votre serveur en temps réel à chaque changement de statut sur un paiement ou un payout via des **webhooks HMAC-signés**. Cette page documente :

1. La liste des événements émis.
2. La structure du payload.
3. La vérification de signature.
4. La politique de retries.
5. La gestion CRUD des endpoints via l'API v1.

Pour les détails conceptuels (idempotence côté receveur, gestion des doublons, exemples par langage), voir [Introduction aux webhooks](/webhooks/introduction).

---

## Événements émis

| Événement | Déclenché par |
|---|---|
| `payment.initialized` | Transition d'un paiement vers `initiated` ou `pending`. |
| `payment.successful` | Transition d'un paiement vers `success`. |
| `payment.failed` | Transition d'un paiement vers `failed`. |
| `payment.cancelled` | Transition d'un paiement vers `cancelled`. |
| `payment.refunded` | Transition d'un paiement vers `refunded`. |
| `payout.initialized` | Transition d'un payout vers `initiated` ou `pending`. |
| `payout.successful` | Transition d'un payout vers `success`. |
| `payout.failed` | Transition d'un payout vers `failed`. |
| `payout.cancelled` | Transition d'un payout vers `cancelled`. |

::: warning Filtre `events` à la création
Le `POST /v1/webhook-endpoints` n'accepte qu'un sous-ensemble exposé publiquement aujourd'hui : `payment.initialized`, `payment.successful`, `payment.failed`, `payout.initialized`, `payout.successful`, `payout.failed`. Les événements `*.cancelled` et `*.refunded` sont dispatchés en interne mais ne peuvent pas encore figurer dans le filtre d'abonnement — utilisez `payment.failed` pour capter `cancelled` côté receveur si nécessaire.
:::

---

## Structure du payload

Toutes les livraisons utilisent la même enveloppe :

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

### En-têtes

| En-tête | Description |
|---|---|
| `Content-Type` | `application/json` |
| `User-Agent` | `Zayono-Webhook/1.0` |
| `X-Zayono-Signature` | `sha256=<hex(hmac_sha256(secret, raw_body))>` |
| `X-Zayono-Event` | Nom de l'événement (ex: `payment.successful`). |
| `X-Zayono-Delivery-Id` | UUID unique de la livraison (utilisable comme clé d'idempotence côté receveur). |

---

## Vérification de signature

La signature est calculée en HMAC-SHA256 sur le **corps brut JSON** (avant tout parsing), avec le `secret` retourné une seule fois à la création de l'endpoint.

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
  // … traiter event …
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

::: tip Helpers SDK
Les SDK Zayono ([PHP](/sdks/php), [Node](/sdks/node), [Python](/sdks/python), [Laravel](/sdks/laravel)) exposent un helper `verifyWebhook(payload, signature, secret)` qui encapsule la comparaison à temps constant et la dérivation de l'en-tête.
:::

---

## Politique de retries

Le job `WebhookDeliveryJob` retente automatiquement la livraison à chaque livraison non-2xx, avec backoff exponentiel.

| Tentative | Délai avant retry |
|---|---|
| 1 | Immédiat |
| 2 | +10 secondes |
| 3 | +60 secondes |
| (échec final) | +300 secondes max stocké comme `failed` |

- **Timeout HTTP** : 10 secondes par tentative.
- **Succès** : code HTTP `2xx` (le corps de réponse est tronqué à 2000 caractères et stocké pour audit).
- **Codes non-2xx** : compte comme un échec, retry programmé.
- **Réessais manuels** : depuis le dashboard, `POST /merchant/webhook-logs/{log}/replay` (Sanctum auth, throttle 10/min).

Voir [Replay & resilience](/webhooks/replay) pour la pratique côté receveur.

---

## Gestion des endpoints

Les endpoints suivants permettent de gérer vos webhooks par programme via l'API v1. Une version équivalente Sanctum-authentifiée existe sur `/api/merchant/webhook-endpoints` pour le dashboard.

### Lister les endpoints

<ApiEndpoint method="GET" path="/v1/webhook-endpoints" />

```bash
curl https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Réponse :

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

Le champ `secret` est **masqué** (12 étoiles + 6 derniers caractères). La valeur complète n'est exposée que **une fois** à la création (ou la régénération).

### Créer un endpoint

<ApiEndpoint method="POST" path="/v1/webhook-endpoints" />

<ParamTable :params="[
  { name: 'url', type: 'string (URL)', required: true, description: 'URL HTTPS qui recevra les livraisons (max 2048).' },
  { name: 'events', type: 'array<string>', required: true, description: 'Liste d’événements à écouter. Au moins 1 entrée. Valeurs admises : `payment.initialized`, `payment.successful`, `payment.failed`, `payout.initialized`, `payout.successful`, `payout.failed`.' },
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

Réponse — 201 :

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

::: warning `secret` exposé une seule fois
Le champ `secret` n'est renvoyé en clair que dans cette réponse 201 et dans la réponse à `regenerate-secret`. Sauvegardez-le immédiatement dans votre coffre-fort. Toutes les lectures ultérieures (`GET /webhook-endpoints`, `GET /webhook-endpoints/{id}`) renvoient une version masquée.
:::

### Récupérer un endpoint

<ApiEndpoint method="GET" path="/v1/webhook-endpoints/{id}" />

```bash
curl https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Mettre à jour un endpoint

<ApiEndpoint method="PUT" path="/v1/webhook-endpoints/{id}" />

<ParamTable :params="[
  { name: 'url', type: 'string (URL)', required: false, description: 'Nouvelle URL (max 2048).' },
  { name: 'events', type: 'array<string>', required: false, description: 'Nouvelle liste d’événements (au moins 1).' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Active/désactive sans supprimer.' },
]" />

```bash
curl -X PUT https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{ "is_active": false }'
```

### Supprimer un endpoint

<ApiEndpoint method="DELETE" path="/v1/webhook-endpoints/{id}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Régénérer le secret

<ApiEndpoint method="POST" path="/v1/webhook-endpoints/{id}/regenerate-secret" />

À utiliser si le secret a fuité. Le nouveau secret est appliqué immédiatement — toute livraison en cours avec l'ancien secret deviendra invalide pour votre receveur.

```bash
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints/0d4b8a3c-.../regenerate-secret \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Réponse :

```json
{
  "message": "Webhook secret regenerated.",
  "data": {
    "id": "0d4b8a3c-...",
    "secret": "<nouveau secret en clair, à sauvegarder>"
  },
  "errors": null
}
```
