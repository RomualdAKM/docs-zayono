# Routing

L'API Routing permet de définir **par programmation** les règles qui sélectionnent l'agrégateur à utiliser pour chaque opérateur. C'est aussi gérable depuis le [dashboard](https://app.zayono.com) (cf. [Règles de routage](/routage/regles)) — l'API v1 est utile pour l'automatisation (Terraform / migration multi-environnement).

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Auth** : `Authorization: Bearer zyn_test_...` ou `Bearer zyn_live_...`

::: info Qu'est-ce qu'une règle de routage ?
Une `RoutingRule` lie un **opérateur** (ex: `mtn_bj`) à un **agrégateur primaire** (ex: `paydunya`), avec un **fallback** optionnel (ex: `feexpay`), un **priority** pour départager les doublons, un **fee_percent** propre à cette route, et un **purpose** (`payment` ou `payout`). Elle est scopée par `application_id` et `environment` (sandbox / live).
:::

---

## L'objet RoutingRule

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Identifiant unique de la règle.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` ou `live`.' },
  { name: 'country', type: 'string (ISO-2)', required: true, description: 'Dérivé de l’opérateur (lecture seule).' },
  { name: 'operator', type: 'string', required: true, description: 'Code opérateur (ex: `mtn_bj`, `orange_ci`).' },
  { name: 'aggregator_code', type: 'string', required: true, description: 'Agrégateur primaire (ex: `paydunya`, `hub2`, `feexpay`).' },
  { name: 'priority', type: 'integer (1-100)', required: true, description: 'Priorité de sélection. Plus bas = plus prioritaire.' },
  { name: 'fallback_aggregator', type: 'string | null', required: false, description: 'Agrégateur de secours si le primaire échoue (5xx ou décline non-business).' },
  { name: 'fee_percent', type: 'number (0-50) | null', required: false, description: 'Surcharge appliquée à `amount_charged` pour cette route. `null` = pas de surcharge.' },
  { name: 'is_active', type: 'boolean', required: true, description: 'Active la règle. Une règle inactive est ignorée par le routeur.' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Horodatage de création.' },
  { name: 'updated_at', type: 'string (ISO 8601)', required: true, description: 'Dernière modification.' },
]" />

Le champ `purpose` (`payment` ou `payout`) est utilisé en interne par le routeur. Il vaut `payment` par défaut sur les écritures API, peut être surchargé via le `bulk`.

---

## Lister les règles

<ApiEndpoint method="GET" path="/v1/routing-rules" />

### Query

<ParamTable :params="[
  { name: 'operator', type: 'string', required: false, description: 'Filtre par code opérateur.' },
  { name: 'environment', type: 'string', required: false, description: '`sandbox` ou `live`.' },
  { name: 'country', type: 'string (ISO-2)', required: false, description: 'Filtre par pays.' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Filtre par état actif.' },
  { name: 'per_page', type: 'integer', required: false, description: 'Défaut 25, max 100.' },
  { name: 'page', type: 'integer', required: false, description: 'Page courante (défaut 1).' },
]" />

```bash
curl "https://backend.zayono.com/api/v1/routing-rules?environment=live" \
  -H "Authorization: Bearer zyn_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Réponse :

```json
{
  "message": "Routing rules retrieved.",
  "data": {
    "data": [
      {
        "id": "f1e2d3c4-...",
        "environment": "live",
        "country": "BJ",
        "operator": "mtn_bj",
        "aggregator_code": "paydunya",
        "priority": 1,
        "fallback_aggregator": "feexpay",
        "fee_percent": 1.5,
        "is_active": true,
        "created_at": "2026-05-20T08:00:00+00:00",
        "updated_at": "2026-05-25T10:30:00+00:00"
      }
    ],
    "pagination": { "current_page": 1, "last_page": 1, "per_page": 25, "total": 1 }
  },
  "errors": null
}
```

---

## Créer une règle

<ApiEndpoint method="POST" path="/v1/routing-rules" />

### Paramètres

<ParamTable :params="[
  { name: 'operator', type: 'string', required: true, description: 'Code opérateur. Doit appartenir à `operators.php`.' },
  { name: 'aggregator_code', type: 'string', required: true, description: 'Agrégateur primaire (max 30). Doit supporter cet opérateur.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` ou `live`.' },
  { name: 'priority', type: 'integer (1-100)', required: true, description: 'Priorité.' },
  { name: 'purpose', type: 'string', required: false, description: '`payment` (défaut) ou `payout`.' },
  { name: 'fallback_aggregator', type: 'string', required: false, description: 'Doit supporter l’opérateur et être différent du primaire.' },
  { name: 'fee_percent', type: 'number (0-50)', required: false, description: 'Surcharge appliquée au client.' },
]" />

```bash
curl -X POST https://backend.zayono.com/api/v1/routing-rules \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "operator": "mtn_bj",
    "aggregator_code": "paydunya",
    "environment": "live",
    "priority": 1,
    "fallback_aggregator": "feexpay",
    "fee_percent": 1.5
  }'
```

#### 201 OK

```json
{
  "message": "Routing rule created successfully.",
  "data": { /* RoutingRule */ },
  "errors": null
}
```

#### 409 — Doublon

```json
{
  "message": "A routing rule already exists for this operator, aggregator, and environment combination.",
  "data": null,
  "errors": { "operator": "Duplicate routing rule." }
}
```

#### 422 — Validation

Erreurs courantes :

- `aggregator_code` : "Aggregator [X] does not support operator [Y]. Supported: …"
- `fallback_aggregator` : "Fallback aggregator must be different from the primary aggregator."

---

## Récupérer une règle

<ApiEndpoint method="GET" path="/v1/routing-rules/{id}" />

```bash
curl https://backend.zayono.com/api/v1/routing-rules/f1e2d3c4-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Mettre à jour une règle

<ApiEndpoint method="PUT" path="/v1/routing-rules/{id}" />

Seuls les champs **non immuables** sont modifiables (l'opérateur et l'agrégateur primaire restent figés — supprimez et recréez si besoin de les changer).

<ParamTable :params="[
  { name: 'priority', type: 'integer (1-100)', required: false, description: 'Nouvelle priorité.' },
  { name: 'fallback_aggregator', type: 'string | null', required: false, description: 'Nouveau fallback ou `null` pour le retirer.' },
  { name: 'fee_percent', type: 'number (0-50) | null', required: false, description: 'Nouvelle surcharge.' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Active/désactive la règle.' },
]" />

```bash
curl -X PUT https://backend.zayono.com/api/v1/routing-rules/f1e2d3c4-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{ "priority": 2, "fee_percent": 1.2 }'
```

---

## Supprimer une règle

<ApiEndpoint method="DELETE" path="/v1/routing-rules/{id}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/routing-rules/f1e2d3c4-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Soft delete : la règle est conservée pour l'historique mais ne participe plus au routage.

---

## Batch (upsert massif)

<ApiEndpoint method="POST" path="/v1/routing-rules/bulk" />

Utile pour initialiser ou migrer un parc de règles en une seule requête. Pour chaque entrée :

- Si une règle `(operator, aggregator_code, environment, purpose)` existe déjà → **update** (priority, fallback, fee_percent).
- Sinon → **create**.

### Paramètres

<ParamTable :params="[
  { name: 'rules', type: 'array<RuleInput>', required: true, description: '1 à 50 entrées.' },
  { name: 'rules[].operator', type: 'string', required: true, description: 'Code opérateur.', nested: true },
  { name: 'rules[].aggregator_code', type: 'string', required: true, description: 'Agrégateur primaire.', nested: true },
  { name: 'rules[].environment', type: 'string', required: true, description: '`sandbox` ou `live`.', nested: true },
  { name: 'rules[].priority', type: 'integer (1-100)', required: true, description: 'Priorité.', nested: true },
  { name: 'rules[].purpose', type: 'string', required: false, description: '`payment` (défaut) ou `payout`.', nested: true },
  { name: 'rules[].fallback_aggregator', type: 'string', required: false, description: 'Agrégateur de secours.', nested: true },
  { name: 'rules[].fee_percent', type: 'number (0-50)', required: false, description: 'Surcharge.', nested: true },
]" />

```bash
curl -X POST https://backend.zayono.com/api/v1/routing-rules/bulk \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      { "operator": "mtn_bj", "aggregator_code": "paydunya", "environment": "live", "priority": 1, "fallback_aggregator": "feexpay" },
      { "operator": "orange_ci", "aggregator_code": "paydunya", "environment": "live", "priority": 1 }
    ]
  }'
```

#### 201 OK — toutes les règles traitées sans erreur

```json
{
  "message": "Bulk routing rules processed.",
  "data": {
    "created": [ /* RoutingRule[] */ ],
    "updated": [ /* RoutingRule[] */ ],
    "errors": []
  },
  "errors": null
}
```

#### 207 Multi-Status — succès partiel

Lorsque certaines entrées échouent (agrégateur incompatible, fallback identique, etc.), la réponse renvoie un code `207` et les erreurs sont énumérées :

```json
{
  "message": "Bulk routing rules processed.",
  "data": {
    "created": [ ... ],
    "updated": [],
    "errors": [
      "Rule #0: Aggregator [stripe] does not support operator [mtn_bj].",
      "Rule #1: Fallback must be different from primary aggregator."
    ]
  },
  "errors": null
}
```

---

## Catalogue opérateurs / agrégateurs

### Lister les opérateurs disponibles

<ApiEndpoint method="GET" path="/v1/routing/operators" />

Renvoie tous les opérateurs catalogués (`config/operators.php`) avec la liste des agrégateurs qui les supportent. C'est l'endpoint spécifique au routage (avec mapping agrégateur).

::: tip Catalogue opérateurs simple
Pour la liste plate des opérateurs (sans mapping agrégateur), utilisez plutôt [`GET /v1/operators`](/methodes/operateurs) — c'est l'endpoint canonique référencé depuis [`/v1/payouts/initialize`](/api/payouts).
:::

```bash
curl https://backend.zayono.com/api/v1/routing/operators \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Lister les agrégateurs pour un opérateur

<ApiEndpoint method="GET" path="/v1/routing/operators/{operator}/aggregators" />

```bash
curl https://backend.zayono.com/api/v1/routing/operators/mtn_bj/aggregators \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Réponse :

```json
{
  "message": "Aggregators for operator [mtn_bj] retrieved.",
  "data": {
    "operator": "mtn_bj",
    "name": "MTN Mobile Money Bénin",
    "country": "BJ",
    "currency": "XOF",
    "aggregators": ["paydunya", "feexpay", "hub2", "qosic"]
  },
  "errors": null
}
```

Réponse 404 si l'opérateur n'est pas reconnu :

```json
{ "message": "Operator [foobar] is not recognized.", "data": null, "errors": null }
```

---

## Voir aussi

- [Concepts du routage](/routage/introduction)
- [Santé du routage en temps réel](/routage/sante) — exposée uniquement sur le dashboard (Sanctum).
