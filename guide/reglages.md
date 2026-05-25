# Reglages par application

Chaque application Zayono dispose de son propre bloc de reglages, configurables depuis le tableau de bord ou — si vous batissez une integration personnalisee — via l'API merchant. Le bloc complet est stocke dans `applications.settings` (JSON) et lu par les composants concernes a chaque transaction.

::: tip
Cette page est une **reference** : elle liste tous les champs disponibles, leur effet, et l'endroit du dashboard ou les configurer. Voir [Applications](/guide/applications) pour le concept multi-application.
:::

## Notifications email

Trois interrupteurs independants controlent les emails envoyes a chaque changement de statut de transaction. Tableau de bord : **Reglages → Reglages**.

| Champ | Type | Defaut | Effet |
|-------|------|--------|-------|
| `transaction_emails` | boolean | `false` | A chaque changement de statut (`success`, `failed`, `pending`, `cancelled`), un email recap est envoye a l'**email du compte marchand**. Genere du bruit — utile pour les marchands a faible volume. |
| `payment_emails` | boolean | `false` | Pour chaque **paiement reussi** uniquement, un email court est envoye au marchand. Moins bruyant que `transaction_emails`. Ignore pour les payouts. |
| `client_receipt` | boolean | `false` | Apres un paiement reussi (type=payment), un **recu** est envoye au client (utilise l'email recupere a la creation de la transaction). Ignore si le client n'a pas d'email. |

::: warning
Les trois flags sont independants : pour notifier le marchand a chaque transaction reussie ET envoyer un recu au client, activez `payment_emails` ET `client_receipt`.
:::

## Contacts de support (visibles sur le checkout)

Affiches sur la page hebergee de checkout et dans le recu email envoye au client. Tableau de bord : **Reglages → Reglages**.

| Champ | Type | Effet |
|-------|------|-------|
| `support_email` | string | Adresse email cliquable dans le recu et la page de checkout (`mailto:`). |
| `support_phone` | string | Numero de telephone affiche en clair dans le recu et le checkout. |

Si les deux sont vides, **aucun bloc support** ne s'affiche cote client.

## Routage et orchestration

Configurable depuis **Paiements → Reglages → Aiguillage**. Voir [Strategie de selection](/routage/introduction#strategie-de-selection) pour la logique complete.

| Champ | Type | Valeurs | Effet |
|-------|------|---------|-------|
| `routing_strategy` | string | `custom` (defaut), `auto` | `custom` : Zayono respecte exactement la regle stockee. `auto` : Zayono choisit en temps reel le meilleur (principal, secours) selon un score pondere succes/latence/cout. |

## Conversion automatique de devises

Configurable depuis **Paiements → Reglages → Conversion de devises**.

| Champ | Type | Defaut | Effet |
|-------|------|--------|-------|
| `currency_conversion` | boolean | `false` | Active la conversion automatique : si la devise declaree differe de celle de l'operateur, le montant est converti via les taux Zayono avant facturation. S'applique aux **paiements** ET aux **transferts**. |
| `correction_rate` | number (%) | `2.0` | Marge ajoutee au taux de change pour absorber les fluctuations. Par exemple, un taux base de 600 XOF/USD avec `correction_rate=2` donne 612 XOF/USD effectifs. Plage 0–100. |

Voir [Devises supportees](/taux-change/devises) pour la liste des paires couvertes.

## Apparence du checkout

Configurable depuis **Paiements → Reglages → Apparence**.

| Champ | Type | Valeurs | Effet |
|-------|------|---------|-------|
| `checkout_template` | string | `default` (defaut), `abidjan`, `cotonou` | Template applique aux sessions de checkout sans `template` explicite a l'initialisation. Voir [Checkout — Templates](/checkout/introduction#templates-de-page-de-checkout). |
| `checkout_primary_color` | string (hex) | `null` | Code hexadecimal `#RRGGBB`. Remplace la couleur primaire bleue Zayono par celle de votre marque sur les trois templates. `null` = couleur Zayono par defaut. La page de configuration verifie le contraste WCAG en direct. |

## Identite de l'application

Configurable depuis **Reglages → Informations**. Ces champs sont des **colonnes directes** sur la table `applications` (pas dans `settings`), mais influencent le rendu cote client.

| Champ | Type | Effet |
|-------|------|-------|
| `name` | string | Nom commercial affiche au client sur la page de checkout et dans le sujet/contenu du recu. |
| `description` | string | Description interne (non affichee au client). |
| `app_icon` | string (URL) | Icone affichee aux clients sur le checkout et dans le recu email. Upload via `POST /merchant/settings/icon`. |
| `website` | string | URL publique du site marchand. Expose dans la reponse `GET /v1/checkout/{token}` sous `data.merchant.website` pour les integrations qui hebergent leur propre checkout ; **pas affiche** par les trois templates Zayono par defaut. |

## Recapitulatif JSON

Voici la forme complete du bloc `settings` une fois tous les champs configures :

```json
{
  "transaction_emails": true,
  "payment_emails": true,
  "client_receipt": true,
  "support_email": "support@votre-boutique.com",
  "support_phone": "+229 90 11 22 33",
  "routing_strategy": "auto",
  "currency_conversion": true,
  "correction_rate": 2.0,
  "checkout_template": "abidjan",
  "checkout_primary_color": "#10B981",
  "app_icon": "https://cdn.zayono.com/icons/app-xyz.png",
  "website": "https://votre-boutique.com"
}
```

::: info
Tous les champs sont **optionnels**. Un nouveau compte demarre avec `settings = {}` et chaque composant retombe sur son comportement par defaut tant qu'un champ n'est pas defini.
:::
