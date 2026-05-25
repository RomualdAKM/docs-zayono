# Paiements

Les paiements permettent de **collecter de l'argent** aupres de vos clients via les operateurs mobile money.

## Flux de paiement

```
1. Initialisation          2. Traitement           3. Resultat
   POST /payments/initialize → Agregateur → Operateur → Succes/Echec
                                                           ↓
                                                      4. Webhook
                                                         → Votre serveur
```

## Cycle de vie

Un paiement passe par les statuts suivants :

| Statut | Description |
|--------|-------------|
| `initiated` | Le paiement a ete cree, en attente de traitement |
| `pending` | Le paiement est en cours de traitement par l'agregateur |
| `success` | Le paiement a ete effectue avec succes |
| `failed` | Le paiement a echoue |
| `cancelled` | Le paiement a ete annule |

## Deux modes d'initialisation

### Mode direct (avec operateur)

Si vous specifiez le parametre `operator` lors de l'initialisation, le paiement est **traite immediatement** via l'agregateur associe.

```json
{
  "amount": 1000,
  "currency": "XOF",
  "operator": "mtn_bj",
  ...
}
```

### Mode checkout (sans operateur)

Si vous ne specifiez pas `operator`, Zayono retourne une `checkout_url` ou le client peut choisir son operateur.

```json
{
  "amount": 1000,
  "currency": "XOF",
  ...
}
// → Reponse inclut checkout_url
```

## Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/v1/payments/initialize` | [Initialiser un paiement](/paiements/initialiser) |
| `GET` | `/v1/payments/{id}/verify` | [Verifier le statut](/paiements/verifier) |
| `GET` | `/v1/payments/{id}` | [Recuperer les details](/paiements/recuperer) |
