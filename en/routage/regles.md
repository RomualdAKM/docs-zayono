# Routing rules

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

## Create a rule

<ApiEndpoint method="POST" path="/v1/routing-rules" />

<ParamTable :params="[
  { name: 'operator', type: 'string', required: true, description: 'Operator code (e.g. mtn_bj, orange_ci)' },
  { name: 'aggregator_code', type: 'string', required: true, description: 'Aggregator code (e.g. pawapay, fedapay)' },
  { name: 'environment', type: 'string', required: true, description: 'sandbox or live' },
  { name: 'priority', type: 'integer', required: true, description: 'Priority (1-100, 1 = highest)' },
  { name: 'fallback_aggregator', type: 'string', required: false, description: 'Fallback aggregator (must differ from the primary)' },
  { name: 'fee_percent', type: 'number', required: false, description: 'Fee in % applied to this specific method (operator+aggregator). If > 0, automatically added to the amount the customer pays. Optional, 0-50.' },
]" />

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/routing-rules \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "operator": "mtn_bj",
    "aggregator_code": "pawapay",
    "environment": "sandbox",
    "priority": 1,
    "fallback_aggregator": "fedapay",
    "fee_percent": 2.5
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/routing-rules', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    operator: 'mtn_bj',
    aggregator_code: 'pawapay',
    environment: 'sandbox',
    priority: 1,
    fallback_aggregator: 'fedapay',
    fee_percent: 2.5,
  }),
})
```
:::

---

## List rules

<ApiEndpoint method="GET" path="/v1/routing-rules" />

```bash
curl https://backend.zayono.com/api/v1/routing-rules \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Retrieve a rule

<ApiEndpoint method="GET" path="/v1/routing-rules/{id}" />

---

## Update a rule

<ApiEndpoint method="PUT" path="/v1/routing-rules/{id}" />

Editable parameters: `priority`, `fallback_aggregator`, `fee_percent`, `is_active`.

---

## Delete a rule

<ApiEndpoint method="DELETE" path="/v1/routing-rules/{id}" />

---

## Bulk import

<ApiEndpoint method="POST" path="/v1/routing-rules/bulk" />

Create up to **50 rules** in a single request. The behaviour is an upsert: if a rule already exists for the same operator/aggregator/environment, it is updated.

```bash
curl -X POST https://backend.zayono.com/api/v1/routing-rules/bulk \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {
        "operator": "mtn_bj",
        "aggregator_code": "pawapay",
        "environment": "sandbox",
        "priority": 1
      },
      {
        "operator": "moov_bj",
        "aggregator_code": "fedapay",
        "environment": "sandbox",
        "priority": 1
      }
    ]
  }'
```

---

## `fee_percent` behaviour

`fee_percent` is configured **per method** — i.e. per operator×aggregator pair. You can therefore have different fees for the same method depending on the aggregator used. Examples:

- MTN Money Benin via FedaPay = 2%
- MTN Money Benin via PawaPay = 1.5%
- Orange Money CI via PawaPay = 1%

On an inbound payment (collection):

- If `fee_percent` is null or 0 → the customer pays exactly the initial `amount`, and the merchant absorbs the actual aggregator fees.
- If `fee_percent > 0` → the amount is **automatically increased**: the customer is charged `amount × (1 + fee_percent/100)`. The merchant receives the net `amount`.

Example: for a **1,000 XOF** payment via a method configured at **2%**, the customer is charged **1,020 XOF**.

::: tip
For outbound payouts, the `fee_percent` configured here is **not** added to the amount sent to the recipient — the aggregator deducts its own fees from the merchant wallet. The field still helps on the dashboard side to declare an internal margin.
:::

### Automatic currency conversion

If you enable **automatic currency conversion** in your application settings (Payments → Settings → Currency conversion), Zayono automatically converts the transaction amount into the operator's settlement currency, in **both directions**:

- **Payments**: the customer pays in the currency you declare (e.g. USD), Zayono converts to the operator currency (e.g. XOF) before billing.
- **Payouts**: you specify the amount to send in your currency (e.g. USD), Zayono converts to the recipient's currency (e.g. XOF) before execution.

The applied rate is the Zayono rate multiplied by `1 + correction_rate/100` (the `correction_rate` is a configurable margin percentage, 2% by default to absorb fluctuations). See [Supported currencies](/en/taux-change/devises) for the full list of available pairs.

---

## Available operators

<ApiEndpoint method="GET" path="/v1/routing/operators" />

Returns every operator with its supported aggregators.

---

## Aggregators for an operator

<ApiEndpoint method="GET" path="/v1/routing/operators/{operator}/aggregators" />

Returns the aggregators available for a specific operator.

```bash
curl https://backend.zayono.com/api/v1/routing/operators/mtn_bj/aggregators \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
