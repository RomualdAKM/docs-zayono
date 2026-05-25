# API Reference

The Zayono API is a REST API organised around predictable resources (`/payments`, `/payouts`, `/customers`, etc.). All requests accept and return JSON, use standard HTTP status codes, and authenticate via bearer token.

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Format**: JSON
- **Auth**: Bearer token (API key)
- **Versioning**: `/v1` prefix in the URL
- **Encoding**: UTF-8 everywhere

## Main endpoints

<Cards>
  <Card
    title="Payments"
    description="Create, verify and list incoming payments."
    icon="💳"
    href="/en/api/payments"
  />
  <Card
    title="Payouts"
    description="Send money to wallets or bank accounts."
    icon="💸"
    href="/en/api/payouts"
  />
  <Card
    title="Checkout"
    description="Hosted checkout sessions."
    icon="🔗"
    href="/en/api/checkout"
  />
  <Card
    title="Webhooks"
    description="Configure + listen to signed events."
    icon="🔔"
    href="/en/api/webhooks"
  />
  <Card
    title="Customers"
    description="Unified customer directory."
    icon="👤"
    href="/en/api/customers"
  />
  <Card
    title="Routing"
    description="Per-operator routing rules + fallbacks."
    icon="🔀"
    href="/en/api/routing"
  />
  <Card
    title="Exchange rates"
    description="FX rates and conversion."
    icon="🌍"
    href="/en/api/exchange-rates"
  />
</Cards>

## Quick start

```bash
curl https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "Premium T-shirt",
    "return_url": "https://your-site.com/success",
    "customer": {
      "email": "customer@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "operator": "mtn_bj"
  }'
```

For a guided start with your favourite language, see [Quickstart](/en/guide/demarrage-rapide).

For technical details (auth, idempotency, errors, rate limits), see [Conventions](/en/api/conventions).
