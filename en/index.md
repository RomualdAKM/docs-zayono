---
layout: home

hero:
  name: Zayono
  text: The unified payment API for Africa
  tagline: |
    One integration for 16+ Mobile Money aggregators + cards in francophone Africa. Production-ready, PHP / Node / Python SDKs, signed webhooks, pro dashboard.
  image:
    src: /logo.svg
    alt: Zayono
  actions:
    - theme: brand
      text: Quickstart
      link: /en/guide/demarrage-rapide
    - theme: alt
      text: API Reference
      link: /en/api/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/zayono

features:
  - icon: 💳
    title: Mobile Money payments
    details: MTN, Orange, Moov, Wave, Free Money, M-Pesa and 30+ operators across 12 countries — one API.
    link: /en/paiements/introduction
    linkText: View payments

  - icon: 💸
    title: Payouts
    details: Send money directly to your recipients' Mobile Money wallets or bank accounts.
    link: /en/transferts/introduction
    linkText: View payouts

  - icon: 🔗
    title: Hosted checkout
    details: Redirect your customers to a Zayono-signed payment page. Three templates (Default / Abidjan / Cotonou).
    link: /en/checkout/introduction
    linkText: View checkout

  - icon: 🔀
    title: Smart routing
    details: Per-operator routing rules + automatic fallback on failure. No lost call.
    link: /en/routage/introduction
    linkText: View routing

  - icon: 🔔
    title: Signed webhooks
    details: HMAC-SHA256 notifications on every status change. Replay, idempotency, guaranteed delivery.
    link: /en/webhooks/introduction
    linkText: View webhooks

  - icon: 🌍
    title: Multi-country · Multi-currency
    details: XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR. Built-in FX conversion. Regional pegs respected (UEMOA / BEAC).
    link: /en/taux-change/lister
    linkText: View currencies
---

<div style="max-width: 1240px; margin: 64px auto 0; padding: 0 24px;">

## Official SDKs

Integrate Zayono into your stack in under 5 minutes.

<Cards>
  <Card
    title="PHP SDK"
    description="Composer · PHP 8.1+ · Production-ready"
    icon="🐘"
    href="/en/sdks/php"
    badge="stable"
  />
  <Card
    title="Laravel SDK"
    description="Service provider + facade for Laravel 10/11/12"
    icon="🅻"
    href="/en/sdks/laravel"
    badge="soon"
  />
  <Card
    title="Node.js SDK"
    description="TypeScript-first · npm · ESM + CJS"
    icon="⬢"
    href="/en/sdks/node"
    badge="stable"
  />
  <Card
    title="Python SDK"
    description="PyPI · Python 3.9+ · Full type hints"
    icon="🐍"
    href="/en/sdks/python"
    badge="stable"
  />
</Cards>

## E-commerce integrations

Plug your store in without writing a single line of code.

<Cards>
  <Card
    title="WooCommerce"
    description="Official WordPress plugin. Mobile Money + cards in native checkout."
    icon="🛒"
    href="/en/integrations/woocommerce"
    badge="stable"
  />
  <Card
    title="Shopify"
    description="Shopify app for African Mobile Money."
    icon="🛍️"
    href="/en/integrations/shopify"
    badge="soon"
  />
  <Card
    title="PrestaShop"
    description="Official PrestaShop module."
    icon="🏬"
    href="/en/integrations/prestashop"
    badge="soon"
  />
  <Card
    title="Magento"
    description="Magento 2 extension."
    icon="🧱"
    href="/en/integrations/magento"
    badge="soon"
  />
</Cards>

## Get started in 3 steps

<Cards>
  <Card
    title="1. Create your account"
    description="Sign up on app.zayono.com and generate a sandbox API key in 30 seconds."
    icon="🔑"
    href="https://app.zayono.com/auth/register"
  />
  <Card
    title="2. Make your 1st payment"
    description="Follow the 5-minute curl tutorial. No gateway required — we provide the sandbox."
    icon="🚀"
    href="/en/guide/demarrage-rapide"
  />
  <Card
    title="3. Connect your gateways"
    description="Configure your PayDunya / KKiaPay / PAL Africa / Stripe credentials from the dashboard."
    icon="🔌"
    href="/en/agregateurs/introduction"
  />
</Cards>

</div>
