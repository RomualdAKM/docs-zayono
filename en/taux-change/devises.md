# Supported currencies

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/currencies" />

Returns the list of every currency supported by Zayono.

## Example

```bash
curl https://backend.zayono.com/api/v1/currencies \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Operator settlement currencies (15)

The currencies below correspond to the currencies in which the supported Mobile Money operators settle transactions. Every transaction is ultimately billed in one of them; automatic currency conversion (see [Convert](/en/taux-change/convertir)) translates the others into these 15 targets.

| Code | Name | Countries |
|------|-----|------|
| `XOF` | West African CFA Franc | Benin, Côte d'Ivoire, Senegal, Togo, Mali, Niger, Burkina Faso |
| `XAF` | Central African CFA Franc | Cameroon, Congo, Chad, Central African Republic, Gabon, Equatorial Guinea |
| `GHS` | Ghanaian Cedi | Ghana |
| `KES` | Kenyan Shilling | Kenya |
| `UGX` | Ugandan Shilling | Uganda |
| `TZS` | Tanzanian Shilling | Tanzania |
| `RWF` | Rwandan Franc | Rwanda |
| `ZMW` | Zambian Kwacha | Zambia |
| `CDF` | Congolese Franc | Democratic Republic of the Congo |
| `NGN` | Nigerian Naira | Nigeria |
| `SLE` | Sierra Leonean Leone | Sierra Leone |
| `MWK` | Malawian Kwacha | Malawi |
| `MZN` | Mozambican Metical | Mozambique |
| `LSL` | Lesotho Loti | Lesotho |
| `ETB` | Ethiopian Birr | Ethiopia |

## Source currencies accepted at initialization

When initializing a payment or a payout, the `currency` field accepts the 15 currencies above **plus** every currency for which Zayono has an exchange rate (typically `USD` and `EUR`). If the declared currency differs from the operator's currency AND automatic conversion is enabled in the application settings, the amount is converted before billing. Otherwise, the API returns `422` (unsupported currency).

::: tip
Zayono rates cover every `USD → operator currency` pair and every `EUR → operator currency` pair (the latter via the `EUR → USD` pivot). Reverse pairs (`operator currency → USD`) are derived automatically.
:::
