# Initialize a payout

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

<ApiEndpoint method="POST" path="/v1/payouts/initialize" />

Creates a new payout to a recipient. The operator is **required** and the payout is processed immediately.

## Headers

| Header | Required | Description |
|---------|--------|-------------|
| `Authorization` | Yes | `Bearer zyn_test_...` or `Bearer zyn_live_...` |
| `Content-Type` | Yes | `application/json` |
| `X-Idempotency-Key` | No | UUID v4 to avoid duplicates |

## Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Payout amount (minimum: 1, maximum: 10,000,000)' },
  { name: 'currency', type: 'string', required: true, description: 'ISO 4217 currency code (e.g. XOF, XAF, GHS)' },
  { name: 'operator', type: 'string', required: true, description: 'Mobile money operator code (e.g. mtn_bj, orange_ci)' },
  { name: 'recipient', type: 'object', required: true, description: 'Recipient information' },
  { name: 'recipient.phone', type: 'string', required: true, description: 'Recipient phone in international format (regex ^\\+?[0-9]{8,15}$)', nested: true },
  { name: 'recipient.first_name', type: 'string', required: true, description: 'Recipient first name (max 100)', nested: true },
  { name: 'recipient.last_name', type: 'string', required: true, description: 'Recipient last name (max 100)', nested: true },
  { name: 'recipient.email', type: 'string', required: false, description: 'Recipient email address', nested: true },
  { name: 'description', type: 'string', required: false, description: 'Payout description (max 255 characters)' },
  { name: 'metadata', type: 'object', required: false, description: 'Custom data (key-value pairs)' },
]" />

## Examples

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
    "description": "Salary - May 2025",
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
    description: 'Salary - May 2025',
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
        'description' => 'Salary - May 2025',
        'metadata' => [
            'employee_id' => 'EMP-042',
        ],
    ]);
```
:::

## Responses

### 201 — Payout initialized

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

### 202 — Accepted but processing failed

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

### 422 — Validation error

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
