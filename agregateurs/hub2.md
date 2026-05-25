# Configurer Hub2

[Hub2](https://hub2.io) est un **meta-PSP pan-africain** qui agrege les principaux operateurs mobile money de 7 pays d'Afrique de l'Ouest et Centrale. Cote Hub2, chaque pays est un compte separe avec son propre tableau de bord et ses propres credentials. Zayono reflete cette realite avec un `aggregator_code` distinct par pays.

## Codes Hub2 par pays

| Code | Pays | Devise | Operateurs disponibles |
|------|------|--------|------------------------|
| `hub2_bj` | Benin | XOF | MTN, Moov, Celtiis |
| `hub2_ci` | Cote d'Ivoire | XOF | MTN, Orange, Moov, Wave |
| `hub2_sn` | Senegal | XOF | Orange, Wave, Free |
| `hub2_tg` | Togo | XOF | MTN, Moov, T-Money |
| `hub2_ml` | Mali | XOF | Orange, Mobicash |
| `hub2_bf` | Burkina Faso | XOF | Orange, Moov, MTN |
| `hub2_cm` | Cameroun | XAF | MTN, Orange |

Vous n'avez **pas besoin** d'activer les 7 pays — configurez uniquement ceux ou vous voulez encaisser ou payer.

## Pre-requis cote Hub2

Avant d'ajouter une configuration dans Zayono, recuperez pour chaque pays :

1. Une **API key** (sandbox ou live selon l'environnement Zayono).
2. Le **merchant ID** Hub2 associe a ce pays.
3. (Optionnel) Le **webhook secret** que vous voulez utiliser. Hub2 supporte la rotation de secrets via deux cles actives en parallele (`s0` et `s1`), ce que Zayono respecte cote verification.

Ces credentials sont disponibles dans le tableau de bord Hub2 du pays concerne, section **API & Webhooks**.

## Configurer une cle Hub2 dans Zayono

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="POST" path="/v1/aggregator-configs" />

Repetez l'appel **une fois par pays** que vous voulez activer. L'environnement (sandbox vs live) est determine par la cle API Zayono utilisee — pas par le payload.

::: code-group
```bash [Cote d'Ivoire]
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

A la creation, Zayono renvoie une **`webhook_url` et un `webhook_secret`** propres a cette configuration. Conservez le secret immediatement, il n'est plus affiche par la suite (voir [Configurations](/agregateurs/configurations#reponse-201-created)).

## Coller l'URL webhook cote Hub2

Hub2 envoie ses notifications a l'URL que vous configurez dans son tableau de bord. **L'auto-enregistrement n'est pas supporte** pour Hub2 a ce jour — vous devez coller manuellement la `webhook_url` renvoyee par Zayono dans **Settings → Webhooks** du dashboard Hub2 **du pays concerne**.

::: warning Une URL par pays
Chaque configuration Hub2 (`hub2_ci`, `hub2_sn`, …) genere sa propre `webhook_url`. **Ne reutilisez pas** la meme URL pour tous les pays — vous melangeriez les notifications et les signatures echoueraient (le secret est lui aussi distinct par pays).
:::

## Flux de paiement Hub2

Contrairement aux drivers Mobile Money classiques (un seul appel `collect`), Hub2 implemente un flux en **3 etapes** :

1. **`POST /payment-intents`** — Zayono cree l'intention de paiement.
2. **`POST /payment-intents/{id}/payments`** — Zayono envoie le numero du client.
3. **`POST /payment-intents/{id}/authentication`** — le client confirme via OTP / USSD selon l'operateur.

Cote integration marchande, **rien ne change**. Vous appelez toujours `/v1/payments` comme pour les autres agregateurs. Zayono orchestre le multi-step en interne et expose le hint suivant dans la reponse `/v1/checkout/sessions/{token}/process` :

```json
{
  "next_action": {
    "type": "otp",
    "message": "Saisissez le code recu par SMS pour confirmer le paiement."
  }
}
```

Trois types de `next_action` sont possibles selon l'operateur :

| Type | Comportement attendu cote client |
|------|----------------------------------|
| `otp` | Le client recoit un SMS avec un code a saisir dans le checkout. |
| `ussd` | Le client doit composer un code USSD affiche dans le checkout (typique Orange CI). |
| `redirection` | Le client est redirige vers une page Hub2 (cartes / wallets externes). |

::: tip Idempotence des OTP
Si le client saisit un OTP errone, Zayono **reutilise la meme `payment-intent`** et n'en cree pas une nouvelle — pas de double-charge possible. Voir [Idempotence](/guide/idempotence).
:::

## Verification des signatures de webhook

Hub2 signe ses webhooks avec HMAC-SHA256 et envoie l'entete `X-Hub-Signature: t=<timestamp>,s0=<sha256_hex>,s1=<sha256_hex_secondary>`. La presence simultanee de `s0` et `s1` permet une **rotation de cles** sans coupure : Zayono accepte une signature valide pour `s0` **ou** `s1`.

Zayono verifie automatiquement ces signatures cote serveur — vous n'avez rien a faire si vous utilisez l'URL Zayono. Si vous re-relayez les evenements vers votre propre backend, voir [Verification de signature](/webhooks/verification-signature) pour la procedure complete.

## Limites & particularites

- **Aucune capability differente entre pays** : tous les `hub2_*` supportent paiement + transfert.
- **Pas de credentials globaux** : chaque pays est un compte Hub2 distinct. Zayono ne propose pas d'auto-derivation cross-pays.
- **Sandbox != live** : utilisez des cles `zyn_test_` cote Zayono **et** des cles sandbox cote Hub2. Melanger les environnements casse la verification de signature.
- **Djamo (Cote d'Ivoire)** est documente cote Hub2 mais non encore active dans le catalogue Zayono. Contactez-nous si vous en avez besoin.
