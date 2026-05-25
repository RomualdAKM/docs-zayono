# Evenements webhook

Zayono emet des webhooks pour les evenements suivants. Vous pouvez choisir les evenements a ecouter lors de la creation de votre endpoint.

## Liste des evenements

| Evenement | Description |
|-----------|-------------|
| `payment.initialized` | Un paiement a ete cree et est en attente de traitement |
| `payment.successful` | Un paiement a ete effectue avec succes |
| `payment.failed` | Un paiement a echoue |
| `payout.initialized` | Un transfert a ete cree et est en attente de traitement |
| `payout.successful` | Un transfert a ete effectue avec succes |
| `payout.failed` | Un transfert a echoue |

## Format du payload

Tous les webhooks sont envoyes en `POST` avec un corps JSON enveloppe :

- `event` : nom de l'evenement (ex : `payment.successful`)
- `data` : objet contenant la transaction complete
- `sent_at` : date d'envoi du webhook (ISO 8601)

### Exemple : `payment.successful`

```json
{
  "event": "payment.successful",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "type": "payment",
    "status": "success",
    "amount": 5000,
    "amount_charged": 5100,
    "fee_percent": 2,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_code": "fedapay",
    "environment": "live",
    "customer": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "email": "jean.dupont@example.com",
      "phone": "+22990123456"
    },
    "metadata": {
      "order_id": "ORD-2025-001"
    },
    "failure_reason": null,
    "processed_at": "2025-05-15T10:31:00+00:00",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "sent_at": "2025-05-15T10:31:02+00:00"
}
```

### Exemple : `payout.failed`

```json
{
  "event": "payout.failed",
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "type": "payout",
    "status": "failed",
    "amount": 25000,
    "amount_charged": 25000,
    "fee_percent": null,
    "currency": "XOF",
    "operator": "mtn_bj",
    "country": "BJ",
    "aggregator_code": "pawapay",
    "environment": "live",
    "customer": {
      "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
      "email": "marie.koffi@example.com",
      "phone": "+22990123456"
    },
    "metadata": {
      "employee_id": "EMP-042"
    },
    "failure_reason": "Insufficient funds on aggregator wallet",
    "processed_at": "2025-05-15T14:02:00+00:00",
    "created_at": "2025-05-15T14:00:00+00:00"
  },
  "sent_at": "2025-05-15T14:02:01+00:00"
}
```

## Champs du payload

| Champ | Type | Description |
|-------|------|-------------|
| `event` | `string` | Nom de l'evenement |
| `data.id` | `string` | UUID de la transaction |
| `data.type` | `string` | `payment` ou `payout` |
| `data.status` | `string` | Statut final (`success`, `failed`, `cancelled`...) |
| `data.amount` | `number` | Montant net (ce que le marchand recoit) |
| `data.amount_charged` | `number` | Montant facture au client (= `amount` + frais si `fee_percent > 0`) |
| `data.fee_percent` | `number \| null` | Pourcentage de frais applique (si configure sur la methode) |
| `data.currency` | `string` | Code devise ISO 4217 |
| `data.operator` | `string \| null` | Code operateur (ex : `mtn_bj`) |
| `data.country` | `string \| null` | Code pays ISO-2 (ex : `BJ`) |
| `data.aggregator_code` | `string \| null` | Agregateur ayant traite la transaction |
| `data.environment` | `string` | `sandbox` ou `live` |
| `data.customer` | `object \| null` | Informations du client/beneficiaire |
| `data.metadata` | `object \| null` | Donnees personnalisees fournies a l'init |
| `data.failure_reason` | `string \| null` | Message d'erreur (si `failed`) |
| `data.processed_at` | `string \| null` | Date de traitement par l'agregateur (ISO 8601) |
| `data.created_at` | `string` | Date de creation de la transaction (ISO 8601) |
| `sent_at` | `string` | Date d'envoi du webhook (ISO 8601) |
