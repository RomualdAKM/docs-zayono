# Initialiser un transfert

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

<ApiEndpoint method="POST" path="/v1/payouts/initialize" />

Cree un nouveau transfert vers un beneficiaire. L'operateur est **obligatoire** et le transfert est traite immediatement.

## En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |
| `Content-Type` | Oui | `application/json` |
| `X-Idempotency-Key` | Non | UUID v4 pour eviter les doublons |

## Parametres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant du transfert en unite principale de la devise, pas en centimes (ex: 5000 = 5000 XOF ; 50.99 = 50.99 USD). Minimum : 1, maximum : 10 000 000.' },
  { name: 'currency', type: 'string', required: true, description: 'Code devise ISO 4217 (ex: XOF, XAF, GHS)' },
  { name: 'operator', type: 'string', required: true, description: 'Code operateur mobile money (ex: mtn_bj, orange_ci)' },
  { name: 'recipient', type: 'object', required: true, description: 'Informations du beneficiaire' },
  { name: 'recipient.phone', type: 'string', required: true, description: 'Numero du beneficiaire au format international (regex ^\\+?[0-9]{8,15}$)', nested: true },
  { name: 'recipient.first_name', type: 'string', required: true, description: 'Prenom du beneficiaire (max 100)', nested: true },
  { name: 'recipient.last_name', type: 'string', required: true, description: 'Nom de famille du beneficiaire (max 100)', nested: true },
  { name: 'recipient.email', type: 'string', required: false, description: 'Adresse email du beneficiaire', nested: true },
  { name: 'description', type: 'string', required: false, description: 'Description du transfert (max 255 caracteres)' },
  { name: 'metadata', type: 'object', required: false, description: 'Donnees personnalisees (paires cle-valeur)' },
]" />

## Exemples

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payouts/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 660e8400-e29b-41d4-a716-446655440001" \
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "recipient": {
      "phone": "+22990123456",
      "first_name": "Marie",
      "last_name": "Koffi",
      "email": "marie.koffi@example.com"
    },
    "description": "Salaire - Mai 2025",
    "metadata": {
      "employee_id": "EMP-042"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/payouts/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
    'X-Idempotency-Key': '660e8400-e29b-41d4-a716-446655440001',
  },
  body: JSON.stringify({
    amount: 25000,
    currency: 'XOF',
    operator: 'mtn_bj',
    recipient: {
      phone: '+22990123456',
      first_name: 'Marie',
      last_name: 'Koffi',
      email: 'marie.koffi@example.com',
    },
    description: 'Salaire - Mai 2025',
    metadata: {
      employee_id: 'EMP-042',
    },
  }),
})

const data = await response.json()
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->withHeaders(['X-Idempotency-Key' => '660e8400-e29b-41d4-a716-446655440001'])
    ->post('https://backend.zayono.com/api/v1/payouts/initialize', [
        'amount' => 25000,
        'currency' => 'XOF',
        'operator' => 'mtn_bj',
        'recipient' => [
            'phone' => '+22990123456',
            'first_name' => 'Marie',
            'last_name' => 'Koffi',
            'email' => 'marie.koffi@example.com',
        ],
        'description' => 'Salaire - Mai 2025',
        'metadata' => [
            'employee_id' => 'EMP-042',
        ],
    ]);
```
:::

## Reponses

### 201 — Transfert initialise

```json
{
  "message": "Payout initialized successfully.",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "status": "initiated",
    "amount": 25000,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "created_at": "2025-05-15T14:00:00+00:00"
  },
  "errors": null
}
```

### 202 — Accepte mais traitement echoue

```json
{
  "message": "Payout initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      "status": "initiated",
      "amount": 25000,
      "currency": "XOF",
      "operator": "mtn_bj",
      "country": "BJ",
      "created_at": "2025-05-15T14:00:00+00:00"
    },
    "aggregator_error": "Insufficient balance on aggregator account"
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
    "operator": ["The operator field is required."],
    "recipient.phone": ["The recipient.phone field is required."]
  }
}
```
