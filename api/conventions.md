# Conventions API

Convention partagées par tous les endpoints `/api/v1/*`. Lisez cette page une fois, ensuite vous pouvez aller directement à n'importe quel endpoint.

## Authentification

Toutes les requêtes nécessitent un header `Authorization: Bearer <clé>` :

```http
Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Voir [Authentification](/guide/authentification) pour générer une clé.

## Format des réponses

Toutes les réponses suivent l'enveloppe :

```json
{
  "message": "Payment created.",
  "data": { /* ... ressource ou liste ... */ },
  "errors": null
}
```

En cas d'erreur :

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount must be at least 100."]
  }
}
```

Voir [Format des réponses](/guide/format-reponses) et [Gestion des erreurs](/guide/gestion-erreurs).

## Codes HTTP

| Code | Signification |
|---|---|
| 200 | OK — ressource récupérée |
| 201 | Created — ressource créée |
| 204 | No Content — action effectuée, pas de body |
| 400 | Bad Request — body invalide |
| 401 | Unauthorized — clé manquante ou invalide |
| 403 | Forbidden — accès refusé |
| 404 | Not Found — ressource inconnue |
| 409 | Conflict — idempotency key réutilisée avec un body différent |
| 422 | Unprocessable Entity — validation échouée (`errors` détaille) |
| 429 | Too Many Requests — rate limit dépassé (`Retry-After` en header) |
| 5xx | Server Error — retry conseillé avec backoff |

## Idempotency

Toutes les requêtes mutatives acceptent `Idempotency-Key` (UUID ou ULID recommandé) :

```http
POST /api/v1/payments
Idempotency-Key: 019e5eaf-cb99-7351-a6d5-c219e28534db
```

Voir [Idempotence](/guide/idempotence).

## Pagination

Les endpoints liste retournent :

```json
{
  "data": [/* ... */],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 142,
    "last_page": 10
  }
}
```

Query params : `?page=2&per_page=25` (max 100 par page).

## Rate limits

- **API key** : 100 req/min en moyenne, burst 200
- **Dashboard auth** : 60 req/min par session

Le header `X-RateLimit-Remaining` est inclus sur chaque réponse. Voir [Limites de débit](/guide/limites-debit).

## Environnements

- **Sandbox** : clés `zyn_test_*`. Aucun paiement réel n'est débité.
- **Live** : clés `zyn_live_*`. Argent réel.

L'environnement est dérivé de la clé. Aucun header supplémentaire n'est nécessaire.

## Webhooks

Tous les changements de statut (paiement, transfert, refund) déclenchent un webhook signé HMAC-SHA256. Voir [Webhooks](/webhooks/introduction).
