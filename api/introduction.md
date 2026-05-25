# API Reference

L'API Zayono est une API REST organisée autour de ressources prédictibles (`/payments`, `/payouts`, `/customers`, etc.). Toutes les requêtes acceptent et retournent du JSON, utilisent les codes HTTP standard, et sont authentifiées par bearer token.

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Format** : JSON
- **Auth** : Bearer token (clé API)
- **Versionning** : préfixe `/v1` dans l'URL
- **Encoding** : UTF-8 partout

## Endpoints principaux

<Cards>
  <Card
    title="Paiements"
    description="Créer, vérifier, lister les paiements entrants."
    icon="💳"
    href="/api/payments"
  />
  <Card
    title="Transferts"
    description="Envoyer de l'argent vers wallets ou comptes bancaires."
    icon="💸"
    href="/api/payouts"
  />
  <Card
    title="Checkout"
    description="Sessions de checkout hébergé."
    icon="🔗"
    href="/api/checkout"
  />
  <Card
    title="Webhooks"
    description="Configurer + écouter les événements signés."
    icon="🔔"
    href="/api/webhooks"
  />
  <Card
    title="Clients"
    description="Référentiel client unifié."
    icon="👤"
    href="/api/customers"
  />
  <Card
    title="Routage"
    description="Règles de routing + fallbacks par opérateur."
    icon="🔀"
    href="/api/routing"
  />
  <Card
    title="Taux de change"
    description="FX rates et conversion."
    icon="🌍"
    href="/api/exchange-rates"
  />
</Cards>

## Démarrer rapidement

```bash
curl https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "T-shirt premium",
    "return_url": "https://votre-site.com/success",
    "customer": {
      "email": "customer@example.com",
      "first_name": "Jean",
      "last_name": "Dupont"
    },
    "operator": "mtn_bj"
  }'
```

Pour un démarrage guidé avec votre langage de prédilection, voir [Démarrage rapide](/guide/demarrage-rapide).

Pour les détails techniques (auth, idempotence, erreurs, rate limits), voir [Conventions](/api/conventions).
