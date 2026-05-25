# Gestion des erreurs

L'API Zayono utilise les codes HTTP standards pour indiquer le succes ou l'echec d'une requete.

## Format des erreurs

Toutes les erreurs suivent le format standard :

```json
{
  "message": "Description de l'erreur",
  "data": null,
  "errors": { ... }
}
```

Le champ `errors` contient les details specifiques en cas d'erreur de validation (422). Pour les autres codes d'erreur, `errors` est `null`.

## Reference des erreurs

### 400 — Requete invalide

La requete est mal formee ou contient des donnees invalides.

```json
{
  "message": "X-Idempotency-Key must be a valid UUID.",
  "data": null,
  "errors": null
}
```

### 401 — Non authentifie

La cle API est manquante, invalide ou expiree.

```json
{
  "message": "Invalid or missing API key.",
  "data": null,
  "errors": null
}
```

### 403 — Interdit

Le compte marchand est suspendu ou l'operation n'est pas autorisee.

```json
{
  "message": "Merchant account is suspended.",
  "data": null,
  "errors": null
}
```

### 404 — Non trouve

La ressource demandee n'existe pas.

```json
{
  "message": "Payment not found.",
  "data": null,
  "errors": null
}
```

### 409 — Conflit

La ressource est dans un etat conflictuel (ex: checkout deja complete).

```json
{
  "message": "This checkout session has already been completed.",
  "data": { "status": "completed", "return_url": "https://..." },
  "errors": null
}
```

### 410 — Expire

La ressource a expire (ex: session de checkout).

```json
{
  "message": "This checkout session has expired.",
  "data": { "status": "expired", "return_url": "https://..." },
  "errors": null
}
```

### 422 — Erreur de validation

Les donnees envoyees ne respectent pas les regles de validation.

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "currency": ["The currency must be 3 characters."],
    "customer.email": ["The customer.email field is required."]
  }
}
```

### 429 — Trop de requetes

Vous avez depasse la limite de debit. Voir [Limites de debit](/introduction/erreurs).

### 500 — Erreur serveur

Une erreur interne s'est produite. Contactez le support si le probleme persiste.

### 502 — Erreur de l'agregateur

L'agregateur de paiement n'a pas pu traiter la requete.

```json
{
  "message": "Payment initialized but processing failed. Will retry via fallback or webhook.",
  "data": {
    "transaction": { "id": "...", "status": "initiated", ... },
    "aggregator_error": "Timeout connecting to aggregator API"
  },
  "errors": null
}
```

## Bonnes pratiques

1. **Verifiez toujours le code HTTP** avant de parser le corps de la reponse
2. **Gerez le 422** en affichant les erreurs de validation a l'utilisateur
3. **Rejouez avec idempotence** en cas de timeout ou d'erreur 5xx
4. **Implementez un backoff exponentiel** pour les erreurs 429
5. **Loggez les erreurs 502** pour diagnostiquer les problemes d'agregateur
