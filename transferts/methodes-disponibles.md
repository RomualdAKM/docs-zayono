# Méthodes disponibles

Liste des méthodes de transfert (payout) supportées par Zayono. Le champ `code` est ce que vous passez dans le paramètre `operator` lors de l'initialisation d'un transfert.

::: tip Catalogue partagé
Les transferts utilisent les mêmes codes opérateurs que les paiements. Voir la liste complète sur [Paiements → Méthodes disponibles](/paiements/methodes-disponibles).

Quelques différences pratiques entre paiements et transferts :
- Les opérateurs Mobile Money supportent généralement les deux flux
- Les **cartes bancaires** ne sont pas réversibles → uniquement paiements, pas de transferts
- Les **virements bancaires** (`bank_ng`, `bank_gh`) sont des transferts uniquement (pas de collecte par virement en push)
- Les **wallets** Wave et Djamo supportent transferts + paiements
- Les **crypto** : transferts uniquement via `crypto_global` (Cryptomus). Coinbase Commerce est paiement-only.
:::

## Mobile Money — disponibles pour transferts

Les codes opérateurs disponibles pour `POST /v1/payouts/initialize` sont les mêmes que pour les paiements, sous réserve qu'au moins un agrégateur connecté à votre compte supporte l'opération payout sur cette méthode.

Pour vérifier en temps réel quelles méthodes payout sont activées sur votre compte :

```bash
curl https://backend.zayono.com/api/v1/operators?purpose=payout \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Virement bancaire (payout-only)

Distincts des codes Mobile Money, les codes `bank_*` permettent de virer directement sur un compte bancaire du bénéficiaire. Pour ces méthodes, des **champs additionnels** sont requis dans `recipient` :

| Méthode | Code | Devise | Champs supplémentaires requis |
|---|---|---|---|
| Virement bancaire Nigeria | `bank_ng` | NGN | `recipient.bank_code`, `recipient.account_number` |
| Virement bancaire Ghana | `bank_gh` | GHS | `recipient.bank_code`, `recipient.account_number` |

::: warning Validation côté agrégateur
Le numéro de compte est vérifié auprès de la banque émettrice **avant** envoi des fonds. Si le numéro est invalide, le transfert passe directement en `failed` avec `failure_reason: "Invalid account number"`.
:::

## Crypto (payout-only via Cryptomus)

| Méthode | Code | Devise | Champs supplémentaires requis |
|---|---|---|---|
| Transfert crypto multi-actifs | `crypto_global` | * | `recipient.wallet_address`, `recipient.network` (BTC, ETH, TRC20, etc.) |

## Bonnes pratiques

- **Vérifiez le solde** de votre compte Zayono avant chaque transfert (`GET /v1/balance`)
- Pour les **gros volumes**, contactez le support pour augmenter vos limites
- Surveillez le webhook `payout.successful` pour confirmer l'arrivée des fonds chez le bénéficiaire — un transfert `pending` n'est **pas** garanti d'aboutir
- Les **frais payout** sont distincts des frais paiement et configurables par méthode dans votre tableau de bord
