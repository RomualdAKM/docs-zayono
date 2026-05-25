# Aggregator configurations

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

## Available aggregators

<ApiEndpoint method="GET" path="/v1/aggregators/available" />

Lists every supported aggregator with the required credential fields.

```bash
curl https://backend.zayono.com/api/v1/aggregators/available \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## List your configurations

<ApiEndpoint method="GET" path="/v1/aggregator-configs" />

Returns all your aggregator configurations (credentials are masked).

```bash
curl https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Add a configuration

<ApiEndpoint method="POST" path="/v1/aggregator-configs" />

<ParamTable :params="[
  { name: 'aggregator_code', type: 'string', required: true, description: 'Aggregator code (pawapay, fedapay, etc.)' },
  { name: 'credentials', type: 'object', required: true, description: 'Aggregator-specific credentials' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Enable/disable (default: true)' },
]" />

::: tip Environment
The environment is no longer in the payload. It is determined **automatically** by the API key used:

- `zyn_test_xxx` key → configuration created in sandbox.
- `zyn_live_xxx` key → configuration created in live.

To configure the same gateway in sandbox **and** live, just make two calls with the two API keys.
:::

Fields in `credentials` vary per aggregator:

| Aggregator | Required fields |
|-----------|---------------|
| `pawapay` | `api_key` |
| `fedapay` | `secret_key`, `public_key` |
| `feexpay` | `shop_id`, `api_token` |
| `kkiapay` | `public_key`, `private_key`, `secret_key` |
| `ipay_money` | `private_key` |
| `paydunya` | `master_key`, `private_key`, `token` |
| `hub2_bj`, `hub2_ci`, `hub2_sn`, `hub2_tg`, `hub2_ml`, `hub2_bf`, `hub2_cm` | `api_key`, `merchant_id` |

::: tip Hub2 — one code per country
Hub2 is a meta-PSP with a separate account per country. See [Configure Hub2](/en/agregateurs/hub2) for the multi-country walkthrough.
:::

### Example (PawaPay)

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "aggregator_code": "pawapay",
    "credentials": {
      "api_key": "your_pawapay_sandbox_api_key"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/aggregator-configs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    aggregator_code: 'pawapay',
    credentials: {
      api_key: 'your_pawapay_sandbox_api_key',
    },
  }),
})
```
:::

### Example (FedaPay)

```bash
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "aggregator_code": "fedapay",
    "credentials": {
      "secret_key": "sk_sandbox_xxxxx",
      "public_key": "pk_sandbox_xxxxx"
    }
  }'
```

### Response — 201 Created

On creation, Zayono returns in cleartext, **once only**, the unique `webhook_secret` and `webhook_url` for this configuration. Save them carefully.

The `webhook_auto_registered` field tells you whether Zayono was able to **automatically register** the URL on the aggregator's dashboard (FedaPay only today). When `true`, there is nothing to do on the aggregator side — the URL is already in place.

```json
{
  "message": "Aggregator configuration saved.",
  "data": {
    "id": "8c1d2e3f-...",
    "aggregator_code": "pawapay",
    "environment": "sandbox",
    "is_active": true,
    "credentials": { "api_key": "abcd****wxyz" },
    "configured_at": "2025-05-15T11:00:00+00:00",
    "methods_created": 11,
    "webhook_url": "https://backend.zayono.com/api/api/webhooks/ho_abc123def456",
    "webhook_secret": "ih_<id>_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "webhook_auto_registered": false,
    "external_webhook_id": null
  },
  "errors": null
}
```

::: warning Copy this immediately
The `webhook_secret` only appears **at creation time**. Store it somewhere safe — you won't be able to view it again. If you lose it, regenerate it (see below).

The `webhook_url` should be set on the aggregator side in place of any generic webhook. Each configuration has its own URL, which isolates your webhooks from those of other merchants.
:::

::: info What is the `webhook_secret` actually for?
The secret is intended for **aggregators that accept a custom webhook signing key** (Stripe, PayPal and more to come).

For the **current Mobile Money aggregators** (FedaPay, KKiaPay, PawaPay, PayDunya, iPay Money, FeexPay), **there is nothing to paste on the aggregator side** — they don't offer a "custom secret" field and sign their webhooks with their own key (your `secret_key`, `master_key`, `private_key`, etc. already supplied in `credentials`). Zayono automatically verifies the signature using that same key.

Why keep the `webhook_secret` anyway? For the future:
- aggregators supporting custom signing that you'll integrate later,
- alternative verification channel,
- unique cryptographic trace per config in case of audit.
:::

### Per-aggregator webhook registration strategy

Zayono always tries to spare you manual configuration when the aggregator allows it. Three automation levels exist depending on the APIs available:

| Aggregator | Strategy | Required action on the aggregator dashboard |
|------------|-----------|--------------------------------------|
| **FedaPay** | Auto via `/v1/webhooks` API | None. Zayono registers the URL automatically on connection (and deletes it on disconnection). |
| **FeexPay** | Per-request `callback_url` | None in theory — Zayono injects the URL on every collect/payout. You can still set a global URL as a backup. |
| **iPay Money** | Per-request `callback_url` | None in theory. URL injected on every collect. |
| **PayDunya** | Per-request for payout, manual for collect | For **collects**, paste the `webhook_url` into the PayDunya dashboard's IPN URL. Payouts use the per-request URL. |
| **PawaPay** | Manual | Paste the `webhook_url` into **Settings → Webhooks** in your PawaPay dashboard. |
| **KKiaPay** | Manual | Paste the `webhook_url` into **Settings → Notifications** in your KKiaPay dashboard. |
| **Hub2 (per country)** | Manual | Paste the `webhook_url` into **Settings → Webhooks** in the Hub2 dashboard **of the relevant country**. One URL per country — don't reuse between `hub2_ci`, `hub2_sn`, etc. |

::: tip URL always visible
Whatever the strategy, **the `webhook_url` and `webhook_secret` are always shown** in the gateway details. You can therefore configure an additional endpoint yourself, or take over if an auto-configuration silently fails.
:::

::: warning Best-effort
The FedaPay auto-registration is **best-effort**: if the call fails (rate limit, missing scope, API unavailability), Zayono saves the configuration locally without blocking and lets you paste the URL by hand. No error is surfaced in that case — the "Webhook configured automatically" badge only appears if the operation succeeded.
:::

---

## Retrieve a configuration

<ApiEndpoint method="GET" path="/v1/aggregator-configs/{aggregator}" />

```bash
curl https://backend.zayono.com/api/v1/aggregator-configs/pawapay \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

::: tip Note
Credentials are masked in the response for security reasons.
:::

---

## Delete a configuration

<ApiEndpoint method="DELETE" path="/v1/aggregator-configs/{aggregator}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/aggregator-configs/pawapay \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Deletion also automatically deactivates all **methods** linked to this configuration.

---

## Regenerate the webhook URL and secret

<ApiEndpoint method="POST" path="/v1/aggregator-configs/{aggregator}/regenerate-webhook" />

Generates a **new** `webhook_url` (unique token) and a **new** `webhook_secret` for this configuration. The previous pair is immediately invalidated — notifications signed with the old secret will be rejected.

```bash
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs/pawapay/regenerate-webhook \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Response — 200 OK

```json
{
  "message": "Webhook channel rotated.",
  "data": {
    "webhook_url": "https://backend.zayono.com/api/api/webhooks/ho_yyy456abc789",
    "webhook_secret": "ih_<id>_yyyyyyyyyyyyyyyyyyyyyyyyyyyy"
  },
  "errors": null
}
```

::: danger Do this right away
After regeneration, immediately update the `webhook_url` **and** `webhook_secret` in the relevant aggregator's dashboard. Otherwise, no inbound notification will be accepted until the aggregator uses the new secret.
:::
