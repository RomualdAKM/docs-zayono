# Payments

L'API Payments permet de créer, vérifier et récupérer des paiements entrants. Tous les endpoints sont scopés à l'application liée à la clé API utilisée.

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Auth** : `Authorization: Bearer zyn_test_...` ou `Bearer zyn_live_...`
- **Idempotence** : `X-Idempotency-Key: <UUID v4>` sur `POST /payments/initialize`

## L'objet Payment

Représentation complète d'un paiement telle que renvoyée par `GET /v1/payments/{id}`.

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Identifiant unique de la transaction (UUID v7, casts via HasUuids).' },
  { name: 'type', type: 'string', required: true, description: 'Toujours `payment` sur cet endpoint (par opposition à `payout`).' },
  { name: 'status', type: 'string', required: true, description: 'État courant. Voir Statuts ci-dessous.' },
  { name: 'amount', type: 'number', required: true, description: 'Montant facturé au marchand, en devise déclarée (precision 2 décimales).' },
  { name: 'amount_charged', type: 'number | null', required: false, description: 'Montant réellement débité chez le client lorsque le marchand a configuré un fee_percent. `null` si pas de surcharge.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Devise de la transaction (XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR, …). Le filtre accepte toute devise présente dans `operators.php` ou dans une `ExchangeRate` active.' },
  { name: 'operator', type: 'string | null', required: false, description: 'Code opérateur (ex: `mtn_bj`, `orange_ci`, `wave_sn`, `card`, `crypto_global`). `null` tant que le client n’a pas choisi sa méthode sur le checkout.' },
  { name: 'country', type: 'string (ISO-2) | null', required: false, description: 'Pays dérivé de l’opérateur. `XX` pour les opérateurs internationaux (Stripe, crypto global).' },
  { name: 'description', type: 'string', required: false, description: 'Texte libre fourni par le marchand à la création.' },
  { name: 'checkout_url', type: 'string | null', required: false, description: 'URL hébergée vers laquelle rediriger le client. `null` pour les flux Mobile Money push-to-pay.' },
  { name: 'return_url', type: 'string', required: true, description: 'URL de retour fournie par le marchand.' },
  { name: 'failure_reason', type: 'string | null', required: false, description: 'Message d’erreur humanisé renvoyé par le driver (sanitizé, sans PAN ni headers).' },
  { name: 'metadata', type: 'object | null', required: false, description: 'Paires clé/valeur libres fournies à la création. Persistées en JSON.' },
  { name: 'customer', type: 'object | null', required: false, description: 'Snapshot du client (id, email, first_name, last_name, phone) à la création.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` ou `live`, dérivé du préfixe de la clé API.' },
  { name: 'processed_at', type: 'string (ISO 8601) | null', required: false, description: 'Horodatage où la transaction est passée à un statut terminal (success/failed/cancelled).' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Horodatage de création.' },
  { name: 'updated_at', type: 'string (ISO 8601)', required: true, description: 'Dernière modification.' },
]" />

### Statuts

Voir [Statuts de paiement](/paiements/statuts) pour la machine d'états complète. Récapitulatif :

| Statut | Description |
|---|---|
| `initiated` | Transaction créée côté Zayono, pas encore envoyée à l'agrégateur. |
| `pending` | Envoyée à l'agrégateur, en attente de confirmation (OTP, USSD, redirection hébergée). |
| `success` | Paiement confirmé par l'agrégateur. Terminal. |
| `failed` | Paiement refusé / timeout / erreur. Terminal. |
| `cancelled` | Annulé par le client ou expiré côté Zayono. Terminal. |
| `refunded` | Remboursé après un `success`. Terminal. |

---

## Initialiser un paiement

<ApiEndpoint method="POST" path="/v1/payments/initialize" />

Crée une nouvelle transaction de paiement. Si `operator` est fourni, le paiement est traité immédiatement (Mobile Money push, redirection hébergée). Sinon, le paiement reste à l'état `initiated` jusqu'à ce qu'une session de checkout l'associe à un opérateur.

### En-têtes

| En-tête | Requis | Description |
|---|---|---|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |
| `Content-Type` | Oui | `application/json` |
| `X-Idempotency-Key` | Non | UUID v4. Une retentative avec la même clé renvoie la transaction existante. |

### Paramètres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant entre 1 et 10 000 000 dans la devise déclarée. Le minimum réel dépend de l’opérateur (ex: 100 XOF pour MTN BJ).' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Code 3 lettres. Doit appartenir aux devises supportées (XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR, ou toute devise avec un taux FX actif).' },
  { name: 'description', type: 'string', required: true, description: 'Description du paiement (max 255 caractères).' },
  { name: 'return_url', type: 'string (URL)', required: true, description: 'URL absolue vers laquelle rediriger le client après paiement (max 500 caractères).' },
  { name: 'customer', type: 'object', required: true, description: 'Bloc client.' },
  { name: 'customer.email', type: 'string (email)', required: true, description: 'Email du client.', nested: true },
  { name: 'customer.first_name', type: 'string', required: true, description: 'Prénom (max 100).', nested: true },
  { name: 'customer.last_name', type: 'string', required: true, description: 'Nom (max 100).', nested: true },
  { name: 'customer.phone', type: 'string', required: false, description: 'E.164, 8 à 15 chiffres avec `+` optionnel. Requis pour Mobile Money.', nested: true },
  { name: 'customer.country', type: 'string (ISO-2)', required: false, description: 'Code pays alpha-2.', nested: true },
  { name: 'operator', type: 'string', required: false, description: 'Code opérateur (ex: `mtn_bj`, `orange_ci`, `wave_sn`, `card`). Si fourni, traitement immédiat. Doit être listé dans `operators.php`.' },
  { name: 'methods', type: 'array<string>', required: false, description: 'Liste d’opérateurs autorisés à afficher sur la page de checkout (filtre).' },
  { name: 'metadata', type: 'object', required: false, description: 'Objet libre persisté en JSON. Renvoyé tel quel dans les webhooks.' },
]" />

### Exemple

::: code-group

```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "Abonnement Premium",
    "return_url": "https://example.com/retour",
    "customer": {
      "email": "jean@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "operator": "mtn_bj",
    "metadata": { "order_id": "ORD-2025-001" }
  }'
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '550e8400-e29b-41d4-a716-446655440000',
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'XOF',
    description: 'Abonnement Premium',
    return_url: 'https://example.com/retour',
    customer: {
      email: 'jean@example.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+22990123456',
    },
    operator: 'mtn_bj',
    metadata: { order_id: 'ORD-2025-001' },
  }),
})
const data = await res.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '550e8400-e29b-41d4-a716-446655440000'])
    ->post('https://backend.zayono.com/api/v1/payments/initialize', [
        'amount' => 5000,
        'currency' => 'XOF',
        'description' => 'Abonnement Premium',
        'return_url' => 'https://example.com/retour',
        'customer' => [
            'email' => 'jean@example.com',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '+22990123456',
        ],
        'operator' => 'mtn_bj',
        'metadata' => ['order_id' => 'ORD-2025-001'],
    ]);
```

```python [Python]
import requests

response = requests.post(
    "https://backend.zayono.com/api/v1/payments/initialize",
    headers={
        "Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "X-Idempotency-Key": "550e8400-e29b-41d4-a716-446655440000",
    },
    json={
        "amount": 5000,
        "currency": "XOF",
        "description": "Abonnement Premium",
        "return_url": "https://example.com/retour",
        "customer": {
            "email": "jean@example.com",
            "first_name": "Jean",
            "last_name": "Dupont",
            "phone": "+22990123456",
        },
        "operator": "mtn_bj",
        "metadata": {"order_id": "ORD-2025-001"},
    },
)
```

:::

### Réponses

#### 201 — Paiement initialisé

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 5000,
    "currency": "XOF",
    "checkout_url": null,
    "return_url": "https://example.com/retour",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

#### 202 — Initialisé mais traitement échoué (retry attendu)

L'opérateur a refusé la première tentative ; un fallback ou un webhook tentera la suite.

```json
{
  "message": "Payment initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": { "id": "9e5f...", "status": "failed", "amount": 5000, "currency": "XOF", "checkout_url": null, "return_url": "...", "created_at": "..." },
    "aggregator_error": "Timeout connecting to aggregator API"
  },
  "errors": null
}
```

#### 400 — Clé d'idempotence invalide

```json
{ "message": "X-Idempotency-Key must be a valid UUID.", "data": null, "errors": null }
```

#### 403 — Application ou marchand suspendu

```json
{ "message": "Application is inactive.", "data": null, "errors": null }
```

#### 422 — Validation

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

---

## Récupérer un paiement

<ApiEndpoint method="GET" path="/v1/payments/{id}" />

Renvoie l'état complet d'un paiement, incluant `customer`, `metadata`, `failure_reason` et les horodatages.

### Paramètres de chemin

| Paramètre | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | UUID de la transaction. |

### Exemple

```bash
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Réponse — 200 OK

```json
{
  "message": "Payment details retrieved.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Abonnement Premium",
    "checkout_url": null,
    "return_url": "https://example.com/retour",
    "failure_reason": null,
    "metadata": { "order_id": "ORD-2025-001" },
    "customer": {
      "id": "4ad...",
      "email": "jean@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "environment": "sandbox",
    "processed_at": "2026-05-25T10:31:14+00:00",
    "created_at": "2026-05-25T10:30:00+00:00",
    "updated_at": "2026-05-25T10:31:14+00:00"
  },
  "errors": null
}
```

### Réponse — 404

```json
{ "message": "Payment not found.", "data": null, "errors": null }
```

---

## Vérifier un paiement

<ApiEndpoint method="GET" path="/v1/payments/{id}/verify" />

Force une re-synchronisation du statut auprès de l'agrégateur (appel `verifyTransaction`) puis renvoie le nouvel état. Utile quand votre webhook a manqué un événement ou pour confirmer un statut côté backend avant livraison.

::: tip Préférez les webhooks
Cet endpoint fait un round-trip réseau vers le PSP. Pour les notifications de statut en temps réel, privilégiez les [webhooks](/webhooks/introduction).
:::

### Paramètres de chemin

| Paramètre | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | UUID de la transaction. |

### Exemple

```bash
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Réponse — 200 OK

```json
{
  "message": "Payment status verified.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_status": "COMPLETED",
    "failure_reason": null,
    "processed_at": "2026-05-25T10:31:14+00:00",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

Le champ `aggregator_status` est le code brut retourné par le PSP (ex: `COMPLETED`, `SUCCESS`, `FAILED`, `PROCESSING`). Le champ `status` est sa version normalisée Zayono.

---

## Réessais & idempotence

- **Race condition** : deux requêtes simultanées avec la même `X-Idempotency-Key` aboutissent à une seule transaction. La seconde reçoit la même réponse.
- **Conflit MySQL 1062** : capturé en interne et retraduit en succès idempotent.
- **Sans clé d'idempotence** : aucune protection ; deux clics rapides côté front peuvent créer deux transactions distinctes.

Voir [Idempotence](/guide/idempotence) pour les détails.
