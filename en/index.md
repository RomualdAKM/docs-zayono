---
layout: home

hero:
  name: Zayono
  text: The unified payment API for Africa
  tagline: |
    One integration for the main Mobile Money and card payment methods across Africa. Accept payments and send payouts in a few lines of code.
  image:
    src: /logo.gif
    alt: Zayono
  actions:
    - theme: brand
      text: Get started
      link: /en/introduction/authentification
    - theme: alt
      text: Payments reference
      link: /en/paiements/initialiser

features:
  - icon: /icons/payment.svg
    title: Accept payments
    details: Mobile Money, cards, bank transfers and crypto — one API for every method in Africa.
    link: /en/paiements/initialiser
    linkText: View payments

  - icon: /icons/payout.svg
    title: Send payouts
    details: Pay out funds directly to your recipients' Mobile Money wallets or bank accounts.
    link: /en/transferts/initialiser
    linkText: View payouts

  - icon: /icons/checkout.svg
    title: Standard integration
    details: Redirect your customers to a Zayono-hosted payment page. No PCI-DSS scope.
    link: /en/paiements/integration-standard
    linkText: View integration

  - icon: /icons/webhook.svg
    title: Signed webhooks
    details: Get notified in real time on every status change, with verifiable HMAC-SHA256 signature.
    link: /en/introduction/webhooks
    linkText: View webhooks

  - icon: /icons/toolbox.svg
    title: Official SDKs
    details: PHP, Node.js and Python. WooCommerce plugin ready to install on WordPress.
    link: /en/sdks/
    linkText: View SDKs

  - icon: /icons/flask.svg
    title: Full sandbox
    details: Test every payment method for free, with test cards and phone numbers provided.
    link: /en/introduction/tests
    linkText: Test the API
---

<div style="max-width: 1240px; margin: 64px auto 0; padding: 0 24px;">

## Get started in 3 steps

<Cards>
  <Card
    title="1. Create your account"
    description="Sign up on app.zayono.com and generate a sandbox API key in under a minute."
    icon="/icons/key.svg"
    href="https://app.zayono.com/auth/register"
  />
  <Card
    title="2. Authenticate"
    description="Every API request uses a secret key sent as a Bearer token."
    icon="/icons/lock.svg"
    href="/en/introduction/authentification"
  />
  <Card
    title="3. Initialize a payment"
    description="Follow the 5-minute guide and receive your first webhook notification."
    icon="/icons/rocket.svg"
    href="/en/paiements/initialiser"
  />
</Cards>

## Official SDKs

<Cards>
  <Card
    title="PHP"
    description="Composer · PHP 8.1+ · Production-ready"
    icon="/icons/php.svg"
    href="/en/sdks/php"
    badge="stable"
  />
  <Card
    title="Node.js"
    description="TypeScript-first · npm · ESM + CJS"
    icon="/icons/node.svg"
    href="/en/sdks/node"
    badge="stable"
  />
  <Card
    title="Python"
    description="PyPI · Python 3.9+ · Type hints"
    icon="/icons/python.svg"
    href="/en/sdks/python"
    badge="stable"
  />
  <Card
    title="Laravel"
    description="Service provider + facade for Laravel 10/11/12"
    icon="/icons/laravel.svg"
    href="/en/sdks/laravel"
    badge="soon"
  />
</Cards>

## E-commerce integrations

<Cards>
  <Card
    title="WooCommerce"
    description="Official WordPress plugin. Mobile Money + cards in native checkout."
    icon="/icons/woocommerce.svg"
    href="/en/integrations/woocommerce"
    badge="stable"
  />
</Cards>

</div>
