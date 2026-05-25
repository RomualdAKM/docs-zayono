# Configure Hub2

[Hub2](https://hub2.io) is a **pan-African meta-PSP** that aggregates the main mobile money operators across 7 countries in West and Central Africa. On the Hub2 side, each country is a separate account with its own dashboard and credentials. Zayono mirrors that reality with a distinct `aggregator_code` per country.

## Hub2 codes per country

| Code | Country | Currency | Available operators |
|------|------|--------|------------------------|
| `hub2_bj` | Benin | XOF | MTN, Moov, Celtiis |
| `hub2_ci` | Côte d'Ivoire | XOF | MTN, Orange, Moov, Wave |
| `hub2_sn` | Senegal | XOF | Orange, Wave, Free |
| `hub2_tg` | Togo | XOF | MTN, Moov, T-Money |
| `hub2_ml` | Mali | XOF | Orange, Mobicash |
| `hub2_bf` | Burkina Faso | XOF | Orange, Moov, MTN |
| `hub2_cm` | Cameroon | XAF | MTN, Orange |

You don't **need** to enable all 7 countries — only configure the ones where you want to collect or pay.

## Prerequisites on the Hub2 side

Before adding a configuration in Zayono, retrieve for each country:

1. An **API key** (sandbox or live, matching the Zayono environment).
2. The **merchant ID** Hub2 issued for that country.
3. (Optional) The **webhook secret** you want to use. Hub2 supports key rotation via two active keys in parallel (`s0` and `s1`), which Zayono honours when verifying signatures.

These credentials are available in the Hub2 dashboard for the relevant country, under **API & Webhooks**.

## Configure a Hub2 key in Zayono

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="POST" path="/v1/aggregator-configs" />

Repeat the call **once per country** you want to enable. The environment (sandbox vs live) is determined by the Zayono API key used — not by the payload.

::: code-group
```bash [Côte d'Ivoire]
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "aggregator_code": "hub2_ci",
    "credentials": {
      "api_key": "hub2_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "merchant_id": "mch_xxxxxxxxxxxxxxxxxxxx"
    }
  }'
```

```bash [Senegal]
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "aggregator_code": "hub2_sn",
    "credentials": {
      "api_key": "hub2_test_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
      "merchant_id": "mch_yyyyyyyyyyyyyyyyyyyy"
    }
  }'
```
:::

On creation, Zayono returns a **`webhook_url` and a `webhook_secret`** that belong to this configuration. Save the secret immediately — it is no longer shown afterwards (see [Configurations](/en/agregateurs/configurations#response-201-created)).

## Paste the webhook URL on the Hub2 side

Hub2 sends its notifications to the URL you configure in its dashboard. **Auto-registration is not supported** for Hub2 today — you must manually paste the `webhook_url` returned by Zayono into **Settings → Webhooks** in the Hub2 dashboard **of the relevant country**.

::: warning One URL per country
Each Hub2 configuration (`hub2_ci`, `hub2_sn`, …) generates its own `webhook_url`. **Don't reuse** the same URL across countries — you'd mix up notifications and signatures would fail (the secret is also distinct per country).
:::

## Hub2 payment flow

Unlike the classic Mobile Money drivers (single `collect` call), Hub2 implements a **3-step** flow:

1. **`POST /payment-intents`** — Zayono creates the payment intent.
2. **`POST /payment-intents/{id}/payments`** — Zayono sends the customer phone number.
3. **`POST /payment-intents/{id}/authentication`** — the customer confirms via OTP / USSD depending on the operator.

On the merchant integration side, **nothing changes**. You still call `/v1/payments` like for the other aggregators. Zayono orchestrates the multi-step flow internally and exposes the following hint in the `/v1/checkout/sessions/{token}/process` response:

```json
{
  "next_action": {
    "type": "otp",
    "message": "Enter the code received by SMS to confirm the payment."
  }
}
```

Three `next_action` types are possible depending on the operator:

| Type | Expected behaviour on the customer side |
|------|----------------------------------|
| `otp` | The customer receives an SMS with a code to enter in the checkout. |
| `ussd` | The customer must dial a USSD code shown in the checkout (typical for Orange CI). |
| `redirection` | The customer is redirected to a Hub2 page (cards / external wallets). |

::: tip OTP idempotency
If the customer types in a wrong OTP, Zayono **reuses the same `payment-intent`** and does not create a new one — no double-charge possible. See [Idempotency](/en/guide/idempotence).
:::

## Webhook signature verification

Hub2 signs its webhooks with HMAC-SHA256 and sends the `X-Hub-Signature: t=<timestamp>,s0=<sha256_hex>,s1=<sha256_hex_secondary>` header. The simultaneous presence of `s0` and `s1` enables **key rotation** without downtime: Zayono accepts a signature valid for `s0` **or** `s1`.

Zayono verifies these signatures automatically on the server side — there is nothing for you to do if you use the Zayono URL. If you re-relay the events to your own backend, see [Signature verification](/en/webhooks/verification-signature) for the full procedure.

## Limits & caveats

- **No capability differences between countries**: every `hub2_*` supports payment + payout.
- **No global credentials**: each country is a separate Hub2 account. Zayono does not offer cross-country auto-derivation.
- **Sandbox != live**: use `zyn_test_` keys on the Zayono side **and** sandbox keys on the Hub2 side. Mixing environments breaks signature verification.
- **Djamo (Côte d'Ivoire)** is documented on the Hub2 side but not yet enabled in the Zayono catalog. Contact us if you need it.
