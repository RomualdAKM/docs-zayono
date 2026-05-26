---
layout: home

hero:
  name: Zayono
  text: L'API de paiement unifiée pour l'Afrique
  tagline: |
    Une seule intégration pour les principales méthodes de paiement Mobile Money et carte bancaire en Afrique. Acceptez les paiements et envoyez des transferts en quelques lignes de code.
  image:
    src: /logo.gif
    alt: Zayono
  actions:
    - theme: brand
      text: Démarrer
      link: /introduction/authentification
    - theme: alt
      text: Référence des paiements
      link: /paiements/initialiser

features:
  - icon: /icons/payment.svg
    title: Accepter des paiements
    details: Mobile Money, cartes bancaires, virements et crypto — une seule API pour toutes les méthodes en Afrique.
    link: /paiements/initialiser
    linkText: Voir les paiements

  - icon: /icons/payout.svg
    title: Envoyer des transferts
    details: Versez des fonds directement sur les wallets Mobile Money ou comptes bancaires de vos bénéficiaires.
    link: /transferts/initialiser
    linkText: Voir les transferts

  - icon: /icons/checkout.svg
    title: Intégration standard
    details: Redirigez vos clients vers une page de paiement hébergée par Zayono. Aucun PCI-DSS à gérer.
    link: /paiements/integration-standard
    linkText: Voir l'intégration

  - icon: /icons/webhook.svg
    title: Webhooks signés
    details: Soyez notifié en temps réel à chaque changement de statut, avec signature HMAC-SHA256 vérifiable.
    link: /introduction/webhooks
    linkText: Voir les webhooks

  - icon: /icons/toolbox.svg
    title: SDKs officiels
    details: PHP, Node.js et Python. Plugin WooCommerce prêt à l'emploi pour WordPress.
    link: /sdks/
    linkText: Voir les SDKs

  - icon: /icons/flask.svg
    title: Sandbox complète
    details: Testez chaque méthode de paiement sans frais, avec des cartes et numéros de test fournis.
    link: /introduction/tests
    linkText: Tester l'API
---

<div style="max-width: 1240px; margin: 64px auto 0; padding: 0 24px;">

## Démarrer en 3 étapes

<Cards>
  <Card
    title="1. Créez votre compte"
    description="Inscrivez-vous sur app.zayono.com et générez une clé API sandbox en moins d'une minute."
    icon="/icons/key.svg"
    href="https://app.zayono.com/auth/register"
  />
  <Card
    title="2. Authentifiez-vous"
    description="Toutes les requêtes API utilisent une clé secrète au format Bearer."
    icon="/icons/lock.svg"
    href="/introduction/authentification"
  />
  <Card
    title="3. Initialisez un paiement"
    description="Suivez le guide en 5 minutes et recevez votre première notification webhook."
    icon="/icons/rocket.svg"
    href="/paiements/initialiser"
  />
</Cards>

## SDKs officiels

<Cards>
  <Card
    title="PHP"
    description="Composer · PHP 8.1+ · Production-ready"
    icon="/icons/php.svg"
    href="/sdks/php"
    badge="stable"
  />
  <Card
    title="Node.js"
    description="TypeScript-first · npm · ESM + CJS"
    icon="/icons/node.svg"
    href="/sdks/node"
    badge="stable"
  />
  <Card
    title="Python"
    description="PyPI · Python 3.9+ · Type hints"
    icon="/icons/python.svg"
    href="/sdks/python"
    badge="stable"
  />
  <Card
    title="Laravel"
    description="Service provider + facade pour Laravel 10/11/12"
    icon="/icons/laravel.svg"
    href="/sdks/laravel"
    badge="soon"
  />
</Cards>

## Intégrations e-commerce

<Cards>
  <Card
    title="WooCommerce"
    description="Plugin WordPress officiel. Mobile Money + cartes en checkout natif."
    icon="/icons/woocommerce.svg"
    href="/integrations/woocommerce"
    badge="stable"
  />
</Cards>

</div>
