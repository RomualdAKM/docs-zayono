# Payouts

L'API Payouts permet d'envoyer de l'argent vers un wallet Mobile Money, une carte ou un compte bancaire. Contrairement aux paiements entrants, **l'opérateur est obligatoire** à la création — il n'existe pas de checkout hébergé pour les payouts.

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Auth** : `Authorization: Bearer zyn_test_...` ou `Bearer zyn_live_...`
- **Idempotence** : `X-Idempotency-Key: <UUID v4>` sur `POST /payouts/initialize`

## L'objet Payout

Représentation complète d'un payout telle que renvoyée par `GET /v1/payouts/{id}`.

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Identifiant unique du payout.' },
  { name: 'type', type: 'string', required: true, description: 'Toujours `payout`.' },
  { name: 'status', type: 'string', required: true, description: 'État courant. Mêmes valeurs que pour les paiements, sauf `refunded` qui n’existe pas pour les payouts.' },
  { name: 'amount', type: 'number', required: true, description: 'Montant à envoyer au bénéficiaire (precision 2 décimales).' },
  { name: 'amount_charged', type: 'number | null', required: false, description: 'Montant débité du wallet marchand lorsque l’agrégateur facture des frais. `null` si non applicable.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Devise du payout.' },
  { name: 'operator', type: 'string', required: true, description: 'Code opérateur de destination (ex: `mtn_bj`, `orange_sn`, `wave_ci`).' },
  { name: 'country', type: 'string (ISO-2)', required: true, description: 'Pays dérivé de l’opérateur.' },
  { name: 'description', type: 'string | null', required: false, description: 'Description fournie par le marchand.' },
  { name: 'failure_reason', type: 'string | null', required: false, description: 'Message d’erreur humanisé renvoyé par le driver.' },
  { name: 'metadata', type: 'object | null', required: false, description: 'Paires clé/valeur libres.' },
  { name: 'recipient', type: 'object | null', required: false, description: 'Bénéficiaire (id, email, first_name, last_name, phone). Mappé sur la même table `customers` qu’un paiement.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` ou `live`.' },
  { name: 'processed_at', type: 'string (ISO 8601) | null', required: false, description: 'Horodatage de la transition vers un statut terminal.' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Horodatage de création.' },
  { name: 'updated_at', type: 'string (ISO 8601)', required: true, description: 'Dernière modification.' },
]" />

### Statuts

| Statut | Description |
|---|---|
| `initiated` | Payout créé, pas encore traité. |
| `pending` | Envoyé à l'agrégateur, en cours de traitement. |
| `success` | Fonds reçus par le bénéficiaire. Terminal. |
| `failed` | Refus, solde insuffisant côté agrégateur, numéro invalide, etc. Terminal. |
| `cancelled` | Annulé. Terminal. |

---

## Initialiser un payout

<ApiEndpoint method="POST" path="/v1/payouts/initialize" />

Crée un nouveau payout et le pousse immédiatement à l'agrégateur. Échec côté driver = 202 + retry attendu (fallback ou webhook), pas 5xx.

### En-têtes

| En-tête | Requis | Description |
|---|---|---|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |
| `Content-Type` | Oui | `application/json` |
| `X-Idempotency-Key` | Non | UUID v4. Forcement recommandé pour les payouts. |

### Paramètres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant entre 1 et 10 000 000. Minimum réel selon l’opérateur.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Code 3 lettres. Doit appartenir aux devises opérateur ou avoir un taux FX actif.' },
  { name: 'operator', type: 'string', required: true, description: 'Code opérateur de destination. Liste : `GET /v1/operators`.' },
  { name: 'description', type: 'string', required: false, description: 'Note libre (max 255 caractères).' },
  { name: 'recipient', type: 'object', required: true, description: 'Bloc bénéficiaire.' },
  { name: 'recipient.phone', type: 'string', required: true, description: 'E.164, 8 à 15 chiffres avec `+` optionnel. Numéro Mobile Money de destination.', nested: true },
  { name: 'recipient.first_name', type: 'string', required: true, description: 'Prénom (max 100).', nested: true },
  { name: 'recipient.last_name', type: 'string', required: true, description: 'Nom (max 100).', nested: true },
  { name: 'recipient.email', type: 'string (email)', required: false, description: 'Email du bénéficiaire (optionnel).', nested: true },
  { name: 'metadata', type: 'object', required: false, description: 'Objet libre persisté en JSON.' },
]" />

### Exemple

::: code-group

```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payouts/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440001" \
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "description": "Commission affilié - Mai 2026",
    "recipient": {
      "phone": "+22996123456",
      "first_name": "Adèle",
      "last_name": "Akpovi",
      "email": "adele@example.com"
    },
    "metadata": { "affiliate_id": "AFF-42" }
  }'
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/payouts/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '550e8400-e29b-41d4-a716-446655440001',
  },
  body: JSON.stringify({
    amount: 25000,
    currency: 'XOF',
    operator: 'mtn_bj',
    description: 'Commission affilié - Mai 2026',
    recipient: {
      phone: '+22996123456',
      first_name: 'Adèle',
      last_name: 'Akpovi',
    },
    metadata: { affiliate_id: 'AFF-42' },
  }),
})
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '550e8400-e29b-41d4-a716-446655440001'])
    ->post('https://backend.zayono.com/api/v1/payouts/initialize', [
        'amount' => 25000,
        'currency' => 'XOF',
        'operator' => 'mtn_bj',
        'description' => 'Commission affilié - Mai 2026',
        'recipient' => [
            'phone' => '+22996123456',
            'first_name' => 'Adèle',
            'last_name' => 'Akpovi',
        ],
        'metadata' => ['affiliate_id' => 'AFF-42'],
    ]);
```

```python [Python]
import requests

response = requests.post(
    "https://backend.zayono.com/api/v1/payouts/initialize",
    headers={
        "Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "X-Idempotency-Key": "550e8400-e29b-41d4-a716-446655440001",
    },
    json={
        "amount": 25000,
        "currency": "XOF",
        "operator": "mtn_bj",
        "recipient": {
            "phone": "+22996123456",
            "first_name": "Adèle",
            "last_name": "Akpovi",
        },
    },
)
```

:::

### Réponses

#### 201 — Payout initialisé

```json
{
  "message": "Payout initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "pending",
    "amount": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "created_at": "2026-05-25T10:30:00+00:00"
  },
  "errors": null
}
```

#### 202 — Initialisé mais traitement échoué

```json
{
  "message": "Payout initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": { "id": "9e5f...", "status": "failed", "amount": 25000, "currency": "XOF", "operator": "mtn_bj", "country": "BJ", "created_at": "..." },
    "aggregator_error": "Insufficient balance on aggregator wallet"
  },
  "errors": null
}
```

#### 422 — Validation

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "operator": ["The operator field is required."],
    "recipient.phone": ["Recipient phone number is required."]
  }
}
```

---

## Récupérer un payout

<ApiEndpoint method="GET" path="/v1/payouts/{id}" />

### Paramètres de chemin

| Paramètre | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | UUID du payout. |

### Exemple

```bash
curl https://backend.zayono.com/api/v1/payouts/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Réponse — 200 OK

```json
{
  "message": "Payout details retrieved.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payout",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25050,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "description": "Commission affilié - Mai 2026",
    "failure_reason": null,
    "metadata": { "affiliate_id": "AFF-42" },
    "recipient": {
      "id": "4ad...",
      "email": "adele@example.com",
      "first_name": "Adèle",
      "last_name": "Akpovi",
      "phone": "+22996123456"
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
{ "message": "Payout not found.", "data": null, "errors": null }
```

---

## Vérifier un payout

<ApiEndpoint method="GET" path="/v1/payouts/{id}/verify" />

Force une re-synchronisation auprès de l'agrégateur et renvoie le nouvel état.

### Paramètres de chemin

| Paramètre | Type | Description |
|---|---|---|
| `id` | `string` (UUID) | UUID du payout. |

### Réponse — 200 OK

```json
{
  "message": "Payout status verified.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "success",
    "amount": 25000,
    "amount_charged": 25050,
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

Le champ `aggregator_status` correspond au code brut renvoyé par le PSP de payout (ex: `COMPLETED`, `IN_PROGRESS`, `FAILED`).
