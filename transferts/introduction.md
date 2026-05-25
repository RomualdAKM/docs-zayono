# Transferts (Payouts)

Les transferts permettent d'**envoyer de l'argent** directement sur les comptes mobile money de vos beneficiaires.

## Flux de transfert

```
1. Initialisation             2. Traitement           3. Resultat
   POST /payouts/initialize  →  Agregateur → Operateur → Succes/Echec
                                                            ↓
                                                       4. Webhook
                                                          → Votre serveur
```

## Cycle de vie

| Statut | Description |
|--------|-------------|
| `initiated` | Le transfert a ete cree, en attente de traitement |
| `pending` | Le transfert est en cours de traitement |
| `success` | Le transfert a ete effectue avec succes |
| `failed` | Le transfert a echoue |
| `cancelled` | Le transfert a ete annule |

## Differences avec les paiements

| | Paiement | Transfert |
|---|---------|-----------|
| **Direction** | Client → Marchand | Marchand → Beneficiaire |
| **Operateur** | Optionnel | **Obligatoire** |
| **Destinataire** | `customer` | `recipient` |
| **Checkout** | Disponible | Non disponible |

## Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/v1/payouts/initialize` | [Initialiser un transfert](/transferts/initialiser) |
| `GET` | `/v1/payouts/{id}/verify` | [Verifier le statut](/transferts/verifier) |
| `GET` | `/v1/payouts/{id}` | [Recuperer les details](/transferts/recuperer) |
