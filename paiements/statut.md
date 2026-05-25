# Statut d'un paiement

Un paiement traverse plusieurs états entre sa création et son issue finale. Cette page liste tous les statuts possibles et la transition logique entre eux.

## Statuts

| Statut | Description |
|---|---|
| `initiated` | Le paiement a été créé et envoyé à l'agrégateur. En attente d'action client. |
| `pending` | L'agrégateur a accepté le paiement, le client a démarré le règlement (saisie OTP, scan, etc.). |
| `success` | Le paiement a été confirmé par l'opérateur. C'est l'état final positif — vous pouvez livrer le service. |
| `failed` | Le paiement a échoué. Le champ `failure_reason` détaille la cause. |
| `cancelled` | Le paiement a été annulé par le client ou par expiration de la session de checkout. |
| `refunded` | Le paiement a été remboursé (depuis le tableau de bord ou via l'API du dashboard). |

## Diagramme de transitions

```
initiated ──> pending ──> success ──> refunded
                   └────> failed
                   └────> cancelled
```

Un paiement ne revient **jamais** à un état antérieur. Une fois `success`, `failed`, `cancelled` ou `refunded`, il est immuable.

::: tip Statut `refunded`
Seul un paiement préalablement en `success` peut passer en `refunded`. Le webhook `payment.refunded` est émis à ce moment-là. Pour les transferts, le statut `refunded` n'existe pas — un transfert ne peut être que `success`, `failed` ou `cancelled`.
:::

## Causes d'échec courantes

Le champ `failure_reason` fournit un texte humain expliquant l'échec. Les motifs les plus fréquents :

| Motif | Description |
|---|---|
| `Insufficient funds` | Le solde du wallet client est insuffisant |
| `Invalid PIN` | Le code de validation Mobile Money est incorrect |
| `Operation timeout` | Le client n'a pas validé dans le délai imparti (généralement 2-5 min) |
| `Operator unavailable` | Indisponibilité temporaire du réseau de l'opérateur |
| `Card declined` | La banque émettrice a refusé la transaction (cartes uniquement) |
| `3DS failed` | Échec de l'authentification 3D Secure (cartes internationales) |

## Bonnes pratiques

- **Ne livrez jamais le service** sur un statut autre que `success`
- **Loggez `failure_reason`** pour vos propres tableaux de bord et le support client
- **Écoutez le webhook `payment.refunded`** pour synchroniser vos commandes côté boutique
- Pour les paiements en `pending` au-delà de **15 minutes**, considérez-les comme abandonnés et appelez `GET /v1/payments/{id}` pour confirmer le statut final
