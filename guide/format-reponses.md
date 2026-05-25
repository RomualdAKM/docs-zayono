# Format des reponses

Toutes les reponses de l'API Zayono suivent un **format JSON uniforme**.

## Structure

```json
{
  "message": "Description de l'operation",
  "data": { ... },
  "errors": null
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `message` | `string` | Message decrivant le resultat de l'operation |
| `data` | `object \| null` | Donnees retournees (null en cas d'erreur) |
| `errors` | `object \| null` | Details des erreurs de validation (null en cas de succes) |

## Reponse de succes

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 1000,
    "currency": "XOF",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

## Reponse d'erreur

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "currency": ["The currency must be 3 characters."]
  }
}
```

## Codes HTTP

| Code | Signification |
|------|---------------|
| `200` | Succes |
| `201` | Ressource creee |
| `202` | Acceptee (traitement asynchrone en cours) |
| `400` | Requete invalide |
| `401` | Non authentifie |
| `403` | Interdit (compte suspendu) |
| `404` | Ressource non trouvee |
| `409` | Conflit (doublon, etat invalide) |
| `410` | Ressource expiree |
| `422` | Erreur de validation |
| `429` | Trop de requetes |
| `500` | Erreur serveur |
| `502` | Erreur de l'agregateur |

## Conventions

- Tous les **montants** sont des nombres decimaux (ex: `1000.00`)
- Toutes les **dates** sont au format **ISO 8601** (ex: `2025-05-15T10:30:00+00:00`)
- Tous les **identifiants** sont des **UUID v4**
- Les **devises** utilisent le format **ISO 4217** a 3 lettres (ex: `XOF`, `XAF`)
- Les **pays** utilisent le format **ISO 3166-1 alpha-2** (ex: `BJ`, `CI`)
