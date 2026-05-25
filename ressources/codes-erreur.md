# Codes d'erreur

Reference complete de tous les codes d'erreur HTTP retournes par l'API Zayono.

## Erreurs client (4xx)

### 400 — Bad Request

La requete est mal formee.

| Message | Cause |
|---------|-------|
| `X-Idempotency-Key must be a valid UUID.` | Header d'idempotence invalide |
| `Invalid request format.` | Corps de requete non-JSON |

### 401 — Unauthorized

Authentification echouee.

| Message | Cause |
|---------|-------|
| `Invalid or missing API key.` | Cle API absente, invalide, ou expiree |
| `API key format is invalid.` | La cle ne correspond pas au format `zyn_(live\|test)_*` |
| `API key has expired.` | La cle a depasse sa date d'expiration |
| `Unauthenticated.` | Token Sanctum invalide (dashboard) |

### 403 — Forbidden

Operation non autorisee.

| Message | Cause |
|---------|-------|
| `Merchant account is suspended.` | Le compte marchand a ete suspendu par l'admin |

### 404 — Not Found

Ressource introuvable.

| Message | Cause |
|---------|-------|
| `Payment not found.` | Transaction de paiement inexistante |
| `Payout not found.` | Transaction de transfert inexistante |
| `Checkout session not found.` | Session de checkout inexistante |
| `Customer not found.` | Client inexistant |

### 409 — Conflict

Conflit d'etat.

| Message | Cause |
|---------|-------|
| `This checkout session has already been completed.` | Session deja traitee |
| `Payment is already being processed.` | Paiement deja en cours |
| `Routing rule already exists.` | Regle de routage dupliquee |

### 410 — Gone

Ressource expiree.

| Message | Cause |
|---------|-------|
| `This checkout session has expired.` | Session de checkout au-dela de 30 min |

### 422 — Unprocessable Entity

Erreur de validation. Le champ `errors` contient les details :

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

**Messages courants :**

| Champ | Message | Cause |
|-------|---------|-------|
| `amount` | `The amount field is required.` | Montant absent |
| `amount` | `The amount must be at least 1.` | Montant trop petit |
| `currency` | `The currency must be 3 characters.` | Format devise invalide |
| `customer.email` | `The customer.email field is required.` | Email client absent |
| `operator` | `The operator field is required.` | Operateur absent (payouts) |
| `return_url` | `The return url must be a valid URL.` | URL invalide |
| `events` | `The events field is required.` | Pas d'evenement webhook |

### 429 — Too Many Requests

Limite de debit atteinte. Attendez avant de retenter.

## Erreurs serveur (5xx)

### 500 — Internal Server Error

Erreur interne. Contactez le support si le probleme persiste.

### 502 — Bad Gateway

L'agregateur de paiement n'a pas pu traiter la requete.

| Message | Cause |
|---------|-------|
| `Payment processing failed. Please try again.` | Echec de l'agregateur lors du checkout |
| `Payment initialized but processing failed.` | Echec apres initialisation directe |
