# Initialiser un paiement

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

<ApiEndpoint method="POST" path="/v1/payments/initialize" />

Cree une nouvelle transaction de paiement. Si un `operator` est specifie, le paiement est traite immediatement. Sinon, une URL de checkout est retournee.

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |
| `Content-Type` | Oui | `application/json` |
| `X-Idempotency-Key` | Non | UUID v4 pour eviter les doublons |

## Parametres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant du paiement (minimum : 1, maximum : 10 000 000)' },
  { name: 'currency', type: 'string', required: true, description: 'Code devise ISO 4217 (ex: XOF, XAF, GHS)' },
  { name: 'description', type: 'string', required: true, description: 'Description du paiement (max 255 caracteres)' },
  { name: 'return_url', type: 'string', required: true, description: 'URL de redirection apres paiement (max 500 caracteres)' },
  { name: 'customer', type: 'object', required: true, description: 'Informations du client' },
  { name: 'customer.email', type: 'string', required: true, description: 'Adresse email du client (max 255)', nested: true },
  { name: 'customer.first_name', type: 'string', required: true, description: 'Prenom du client (max 100)', nested: true },
  { name: 'customer.last_name', type: 'string', required: true, description: 'Nom de famille du client (max 100)', nested: true },
  { name: 'customer.phone', type: 'string', required: false, description: 'Numero de telephone au format international (regex ^\\+?[0-9]{8,15}$)', nested: true },
  { name: 'customer.country', type: 'string', required: false, description: 'Code pays ISO 3166-1 alpha-2', nested: true },
  { name: 'metadata', type: 'object', required: false, description: 'Donnees personnalisees (paires cle-valeur)' },
  { name: 'methods', type: 'array', required: false, description: 'Filtrer les methodes de paiement acceptees' },
  { name: 'operator', type: 'string', required: false, description: 'Code operateur (ex: mtn_bj). Si specifie, le paiement est traite immediatement.' },
]" />

## Exemples

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "Abonnement Premium - Mars 2025",
    "return_url": "https://votre-site.com/paiement/retour",
    "customer": {
      "email": "jean.dupont@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990123456"
    },
    "operator": "mtn_bj",
    "metadata": {
      "order_id": "ORD-2025-001",
      "plan": "premium"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '550e8400-e29b-41d4-a716-446655440000',
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'XOF',
    description: 'Abonnement Premium - Mars 2025',
    return_url: 'https://votre-site.com/paiement/retour',
    customer: {
      email: 'jean.dupont@example.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+22990123456',
    },
    operator: 'mtn_bj',
    metadata: {
      order_id: 'ORD-2025-001',
      plan: 'premium',
    },
  }),
})

const data = await response.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '550e8400-e29b-41d4-a716-446655440000'])
    ->post('https://backend.zayono.com/api/v1/payments/initialize', [
        'amount' => 5000,
        'currency' => 'XOF',
        'description' => 'Abonnement Premium - Mars 2025',
        'return_url' => 'https://votre-site.com/paiement/retour',
        'customer' => [
            'email' => 'jean.dupont@example.com',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '+22990123456',
        ],
        'operator' => 'mtn_bj',
        'metadata' => [
            'order_id' => 'ORD-2025-001',
            'plan' => 'premium',
        ],
    ]);
```
:::

## Reponses

### 201 — Paiement initialise

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 5000,
    "currency": "XOF",
    "checkout_url": null,
    "return_url": "https://votre-site.com/paiement/retour",
    "created_at": "2026-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

::: tip Frais répercutés au client
Si la méthode choisie a un `fee_percent` configuré sur votre compte, le montant facturé au client est automatiquement augmenté. Vous pouvez consulter le détail (`amount`, `amount_charged`, `fee_percent`) en appelant [`GET /v1/payments/{id}`](/paiements/retrouver) après l'initialisation ou en écoutant le webhook `payment.successful` qui inclut ces champs.
:::

::: info A propos de `checkout_url`
Pour les paiements Mobile Money, `checkout_url` est toujours `null` — le flux se deroule par OTP sur le telephone du client, sans redirection web. Pour les paiements par carte ou certains operateurs qui exigent une page intermediaire (rare), `checkout_url` contient l'URL vers laquelle rediriger le client.

Si vous voulez systematiquement une **page de paiement hebergee** (avec selection de l'operateur cote client), utilisez plutot l'endpoint dedie [`POST /v1/checkout/initialize`](/paiements/integration-standard) — sa reponse expose un `checkout_url` toujours peuple.
:::

### 202 — Accepte mais traitement echoue

Le paiement a ete cree mais l'agregateur n'a pas pu le traiter. Un retry via fallback ou webhook sera tente.

```json
{
  "message": "Payment initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": {
      "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
      "status": "initiated",
      "amount": 5000,
      "currency": "XOF",
      "checkout_url": null,
      "return_url": "https://votre-site.com/paiement/retour",
      "created_at": "2025-05-15T10:30:00+00:00"
    },
    "aggregator_error": "Timeout connecting to aggregator API"
  },
  "errors": null
}
```

### 422 — Erreur de validation

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

### 401 — Non authentifie

```json
{
  "message": "Invalid or missing API key.",
  "data": null,
  "errors": null
}
```
