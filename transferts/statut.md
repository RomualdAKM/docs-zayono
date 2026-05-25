# Statut d'un transfert

Un transfert traverse plusieurs états entre sa création et son issue finale. Cette page liste tous les statuts possibles et la transition logique entre eux.

## Statuts

| Statut | Description |
|---|---|
| `initiated` | Le transfert a été créé et envoyé à l'agrégateur. En attente du début de traitement. |
| `pending` | L'agrégateur a accepté le transfert et l'exécute. Aucune action requise de votre part. |
| `success` | Le bénéficiaire a reçu les fonds. C'est l'état final positif. |
| `failed` | Le transfert n'a pas pu être réalisé. Le champ `failure_reason` détaille la cause. |
| `cancelled` | Le transfert a été annulé avant exécution (manuellement ou par l'agrégateur). |

## Diagramme de transitions

```
initiated ──> pending ──> success
                   └────> failed
                   └────> cancelled
```

Un transfert ne revient **jamais** à un état antérieur. Une fois `success`, `failed` ou `cancelled`, il est immuable.

## Causes d'échec courantes

Le champ `failure_reason` fournit un texte humain expliquant l'échec. Les motifs les plus fréquents :

| Motif | Description |
|---|---|
| `Insufficient funds` | Votre solde Zayono ou celui de l'agrégateur est insuffisant |
| `Invalid recipient number` | Le numéro de téléphone du bénéficiaire est invalide ou non enregistré |
| `Recipient account inactive` | Le compte mobile money du bénéficiaire n'est pas activé |
| `Operator unavailable` | Indisponibilité temporaire du réseau de l'opérateur |
| `Amount limit exceeded` | Le montant dépasse les limites quotidiennes ou mensuelles autorisées |

## Bonnes pratiques

- **Ne livrez jamais le service** sur un statut autre que `success`
- **Loggez `failure_reason`** pour vos propres tableaux de bord et le support client
- **Retentez les transferts `failed`** uniquement si la cause est temporaire (réseau opérateur indisponible)
- Pour les transferts en `pending` au-delà de **24 heures**, contactez le support
