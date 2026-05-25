# Plugin WooCommerce <span class="zd-tag stable">Stable</span>

Le plugin WooCommerce officiel Zayono permet d'accepter Mobile Money + cartes via le checkout natif WooCommerce, sans coder.

- **WordPress.org** : [`wordpress.org/plugins/zayono-woocommerce`](https://wordpress.org/plugins/zayono-woocommerce/)
- **Source** : [github.com/zayono/zayono-woocommerce](https://github.com/zayono/zayono-woocommerce)
- **License** : GPL-2.0
- **WordPress** : 5.8+
- **WooCommerce** : 6.0+
- **PHP** : 8.1+

## Installation

### Depuis l'admin WordPress

1. **Plugins → Ajouter** → rechercher "Zayono"
2. Cliquez "Installer maintenant" → "Activer"

### Manuellement

```bash
# Téléchargez la dernière release
wget https://github.com/zayono/zayono-woocommerce/releases/latest/download/zayono-woocommerce.zip

# Décompressez dans le dossier plugins
unzip zayono-woocommerce.zip -d wp-content/plugins/
```

Activez ensuite depuis **Extensions → Extensions installées**.

## Configuration

1. **WooCommerce → Réglages → Paiements** → activez "Zayono"
2. Cliquez "Configurer"
3. Renseignez :
   - **Clé API sandbox** (`zyn_test_...`) — copiée depuis [app.zayono.com → Intégration → Clés API](https://app.zayono.com/developers/api-keys)
   - **Clé API live** (`zyn_live_...`) — quand vous passerez en production
   - **Secret webhook** — copié depuis [app.zayono.com → Intégration → Webhooks](https://app.zayono.com/developers/webhooks) après création d'un endpoint
   - **Mode** : Sandbox (test) ou Live (production)
4. Sauvegardez.

## Configuration du webhook

Sur [app.zayono.com → Intégration → Webhooks](https://app.zayono.com/developers/webhooks) :

1. Cliquez "Ajouter un webhook"
2. **URL** :
   ```
   https://votre-boutique.com/?wc-api=zayono_webhook
   ```
3. **Événements** : cochez au minimum `payment.successful` et `payment.failed`
4. Cliquez "Créer", copiez le **secret** (affiché une seule fois) et collez-le dans la config WooCommerce.

## Flow client

1. Le client ajoute des produits au panier et va au checkout WooCommerce
2. Il sélectionne "Zayono" comme moyen de paiement
3. Cliquez "Commander" → redirection vers la page Zayono hébergée
4. Le client choisit son opérateur (MTN, Orange, Moov, etc.), entre son numéro, confirme
5. Sur succès → redirection vers la page de confirmation WooCommerce + la commande passe en `processing`
6. Sur échec → redirection vers le panier WooCommerce avec le message d'erreur

Le statut final est mis à jour automatiquement via webhook — vous n'avez **rien à faire**.

## Devises supportées

Le plugin détecte la devise WooCommerce et la transmet à Zayono. Devises supportées :

- **XOF** (Bénin, Togo, Sénégal, Mali, Côte d'Ivoire, Burkina Faso, Niger)
- **XAF** (Cameroun, Congo, Gabon)
- **GHS** (Ghana)
- **KES** (Kenya)
- **NGN** (Nigeria)
- **ZAR** (Afrique du Sud — cartes Paystack et EFT)
- **GNF** (Guinée — Mobile Money via Magma OnePay)
- **USD**, **EUR** (cartes internationales via Stripe ; règlement crypto en USD/EUR via Coinbase Commerce)

Si la devise WooCommerce ne match aucun opérateur disponible, Zayono affichera "Aucun moyen de paiement disponible" — pensez à activer une passerelle compatible depuis votre dashboard.

## Test en sandbox

1. Configurez le plugin en mode "Sandbox"
2. Créez une commande test (montant ≥ 200 XOF — limite minimum PayDunya sandbox)
3. Au checkout, utilisez :
   - **MTN BJ Sandbox** : `+22961000000`
   - **Orange CI Sandbox** : `+22507000000`
   - Autres numéros de test : voir [Numéros de test](/paiements/tests)

Les transactions sandbox sont visibles sur [app.zayono.com → Transactions](https://app.zayono.com/payments/transactions) en mode sandbox.

## Personnalisation

### Texte du moyen de paiement

```php
add_filter('zayono_payment_method_title', function ($title) {
    return 'Payer avec Mobile Money';
});
```

### Description sous le titre

```php
add_filter('zayono_payment_method_description', function ($desc) {
    return 'MTN, Orange, Moov, Wave, M-Pesa et plus.';
});
```

### Restreindre par pays

```php
add_filter('zayono_supported_countries', function () {
    return ['BJ', 'CI', 'SN', 'TG']; // UEMOA uniquement
});
```

## Dépannage

| Symptôme | Cause probable | Action |
|---|---|---|
| "Zayono" n'apparaît pas au checkout | Devise WooCommerce non supportée | Vérifier la devise (XOF par défaut) |
| Webhook jamais reçu | URL webhook incorrecte | URL doit être `?wc-api=zayono_webhook` exactement |
| Signature invalide dans les logs | Secret webhook désynchronisé | Régénérer le secret côté Zayono dashboard + remettre dans WC |
| Paiement reste en "Attente" | Webhook bloqué par firewall | Vérifier que votre serveur accepte les POST entrants HTTPS depuis Internet (pas de filtrage d'IP par défaut) |
| 500 au checkout | Plugin de cache trop agressif | Désactiver le cache sur `/?wc-api=*` |

Logs PHP : `wp-content/plugins/zayono-woocommerce/debug.log` (si `WP_DEBUG_LOG=true`).

Logs API Zayono : [app.zayono.com → Intégration → Logs API](https://app.zayono.com/developers/logs).

## Support

- Bug ou demande : [GitHub Issues](https://github.com/zayono/zayono-woocommerce/issues)
- Contact commercial : support@zayono.com
