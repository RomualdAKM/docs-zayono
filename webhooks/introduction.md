# Webhooks

Les webhooks permettent a Zayono de **notifier votre serveur en temps reel** lorsque le statut d'une transaction change.

## Principe

Au lieu de faire du polling pour verifier le statut de chaque transaction, vous configurez une URL sur laquelle Zayono enverra des notifications HTTP POST automatiquement.

```
Transaction status change
        ↓
Zayono detecte le changement
        ↓
POST vers votre endpoint webhook
        ↓
Votre serveur traite la notification
```

## Configuration

1. Enregistrez un [endpoint webhook](/webhooks/endpoints) via l'API ou le dashboard
2. Choisissez les [evenements](/webhooks/evenements) a ecouter
3. Recevez un `secret` pour [verifier les signatures](/webhooks/verification-signature)
4. Implementez la logique de traitement dans votre serveur

## Politique de retry

Si votre serveur ne repond pas avec un code `2xx` dans les 30 secondes, Zayono reessaie :

| Tentative | Delai |
|-----------|-------|
| 1ere | Immediate |
| 2eme | ~1 minute |
| 3eme | ~5 minutes |

Apres 3 tentatives echouees, le webhook est marque comme echoue.

## Bonnes pratiques

- **Repondez rapidement** avec un `200 OK` avant de traiter la logique metier
- **Verifiez la signature** pour authentifier l'origine de la notification
- **Gerez l'idempotence** — un meme evenement peut etre envoye plusieurs fois
- **Loggez les payloads** pour le debugging
- **Utilisez HTTPS** pour votre endpoint webhook
