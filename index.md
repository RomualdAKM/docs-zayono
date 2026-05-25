---
layout: home

hero:
  name: Zayono
  text: L'API de paiement unifiée pour l'Afrique
  tagline: |
    Une seule intégration pour 16+ agrégateurs Mobile Money + cartes en Afrique francophone. Production-ready, SDKs PHP / Node / Python, webhooks signés, dashboard pro.
  image:
    src: /logo.svg
    alt: Zayono
  actions:
    - theme: brand
      text: Démarrage rapide
      link: /guide/demarrage-rapide
    - theme: alt
      text: Référence API
      link: /api/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/zayono

features:
  - icon: 💳
    title: Paiements Mobile Money
    details: MTN, Orange, Moov, Wave, Free Money, M-Pesa et 30+ opérateurs dans 12 pays — une seule API.
    link: /paiements/introduction
    linkText: Voir les paiements

  - icon: 💸
    title: Transferts (Payouts)
    details: Envoyez de l'argent directement sur les wallets Mobile Money ou comptes bancaires de vos bénéficiaires.
    link: /transferts/introduction
    linkText: Voir les transferts

  - icon: 🔗
    title: Checkout hébergé
    details: Redirigez vos clients vers une page de paiement signée Zayono. Trois templates (Default / Abidjan / Cotonou).
    link: /checkout/introduction
    linkText: Voir le checkout

  - icon: 🔀
    title: Routage intelligent
    details: Règles de routage par opérateur + fallback automatique en cas d'échec. Aucun appel perdu.
    link: /routage/introduction
    linkText: Voir le routage

  - icon: 🔔
    title: Webhooks signés
    details: Notifications HMAC-SHA256 sur chaque changement de statut. Replay, idempotency, livraison garantie.
    link: /webhooks/introduction
    linkText: Voir les webhooks

  - icon: 🌍
    title: Multi-pays · Multi-devises
    details: XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR. Conversion FX intégrée. Pegs régionaux respectés (UEMOA / BEAC).
    link: /taux-change/lister
    linkText: Voir les devises
---

<div style="max-width: 1240px; margin: 64px auto 0; padding: 0 24px;">

## SDKs officiels

Intégrez Zayono dans votre stack en moins de 5 minutes.

<Cards>
  <Card
    title="PHP SDK"
    description="Composer · PHP 8.1+ · Production-ready"
    icon="🐘"
    href="/sdks/php"
    badge="stable"
  />
  <Card
    title="Laravel SDK"
    description="Service provider + facade pour Laravel 10/11/12"
    icon="🅻"
    href="/sdks/laravel"
    badge="soon"
  />
  <Card
    title="Node.js SDK"
    description="TypeScript-first · npm · ESM + CJS"
    icon="⬢"
    href="/sdks/node"
    badge="stable"
  />
  <Card
    title="Python SDK"
    description="PyPI · Python 3.9+ · Type hints complets"
    icon="🐍"
    href="/sdks/python"
    badge="stable"
  />
</Cards>

## Intégrations e-commerce

Branchez votre boutique sans écrire une ligne de code.

<Cards>
  <Card
    title="WooCommerce"
    description="Plugin WordPress officiel. Mobile Money + cartes en checkout natif."
    icon="🛒"
    href="/integrations/woocommerce"
    badge="stable"
  />
  <Card
    title="Shopify"
    description="App Shopify pour Mobile Money africain."
    icon="🛍️"
    href="/integrations/shopify"
    badge="soon"
  />
  <Card
    title="PrestaShop"
    description="Module officiel PrestaShop."
    icon="🏬"
    href="/integrations/prestashop"
    badge="soon"
  />
  <Card
    title="Magento"
    description="Extension Magento 2."
    icon="🧱"
    href="/integrations/magento"
    badge="soon"
  />
</Cards>

## Démarrer en 3 étapes

<Cards>
  <Card
    title="1. Créez votre compte"
    description="Inscrivez-vous sur app.zayono.com et générez une clé API sandbox en 30 secondes."
    icon="🔑"
    href="https://app.zayono.com/auth/register"
  />
  <Card
    title="2. Faites votre 1er paiement"
    description="Suivez le tutoriel curl en 5 minutes. Aucune passerelle requise — on fournit le sandbox."
    icon="🚀"
    href="/guide/demarrage-rapide"
  />
  <Card
    title="3. Connectez vos passerelles"
    description="Configurez vos identifiants PayDunya / KKiaPay / PAL Africa / Stripe depuis le dashboard."
    icon="🔌"
    href="/agregateurs/introduction"
  />
</Cards>

</div>
