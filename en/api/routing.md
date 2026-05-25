# Routing

The Routing API lets you define **programmatically** the rules that pick which aggregator to use for each operator. It is also managed from the [dashboard](https://app.zayono.com) (see [Routing rules](/en/routage/regles)) — the v1 API is useful for automation (Terraform / multi-environment migration).

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Auth**: `Authorization: Bearer zyn_test_...` or `Bearer zyn_live_...`

::: info What is a routing rule?
A `RoutingRule` ties an **operator** (e.g. `mtn_bj`) to a **primary aggregator** (e.g. `paydunya`), with an optional **fallback** (e.g. `feexpay`), a **priority** to break ties between duplicates, a route-specific **fee_percent**, and a **purpose** (`payment` or `payout`). It is scoped by `application_id` and `environment` (sandbox / live).
:::

---

## The RoutingRule object

<ParamTable :params="[
  { name: 'id', type: 'string (UUID)', required: true, description: 'Unique identifier of the rule.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` or `live`.' },
  { name: 'country', type: 'string (ISO-2)', required: true, description: 'Derived from the operator (read-only).' },
  { name: 'operator', type: 'string', required: true, description: 'Operator code (e.g. `mtn_bj`, `orange_ci`).' },
  { name: 'aggregator_code', type: 'string', required: true, description: 'Primary aggregator (e.g. `paydunya`, `hub2`, `feexpay`).' },
  { name: 'priority', type: 'integer (1-100)', required: true, description: 'Selection priority. Lower = higher priority.' },
  { name: 'fallback_aggregator', type: 'string | null', required: false, description: 'Backup aggregator if the primary fails (5xx or non-business decline).' },
  { name: 'fee_percent', type: 'number (0-50) | null', required: false, description: 'Surcharge applied to `amount_charged` on this route. `null` = no surcharge.' },
  { name: 'is_active', type: 'boolean', required: true, description: 'Enables the rule. An inactive rule is ignored by the router.' },
  { name: 'created_at', type: 'string (ISO 8601)', required: true, description: 'Creation timestamp.' },
  { name: 'updated_at', type: 'string (ISO 8601)', required: true, description: 'Last modification.' },
]" />

The `purpose` field (`payment` or `payout`) is used internally by the router. It defaults to `payment` on API writes and can be overridden via the `bulk` endpoint.

---

## List rules

<ApiEndpoint method="GET" path="/v1/routing-rules" />

### Query

<ParamTable :params="[
  { name: 'operator', type: 'string', required: false, description: 'Filter by operator code.' },
  { name: 'environment', type: 'string', required: false, description: '`sandbox` or `live`.' },
  { name: 'country', type: 'string (ISO-2)', required: false, description: 'Filter by country.' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Filter by active state.' },
  { name: 'per_page', type: 'integer', required: false, description: 'Default 25, max 100.' },
  { name: 'page', type: 'integer', required: false, description: 'Current page (default 1).' },
]" />

```bash
curl "https://backend.zayono.com/api/v1/routing-rules?environment=live" \
  -H "Authorization: Bearer zyn_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Response:

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

## Create a rule

<ApiEndpoint method="POST" path="/v1/routing-rules" />

### Parameters

<ParamTable :params="[
  { name: 'operator', type: 'string', required: true, description: 'Operator code. Must belong to `operators.php`.' },
  { name: 'aggregator_code', type: 'string', required: true, description: 'Primary aggregator (max 30). Must support this operator.' },
  { name: 'environment', type: 'string', required: true, description: '`sandbox` or `live`.' },
  { name: 'priority', type: 'integer (1-100)', required: true, description: 'Priority.' },
  { name: 'purpose', type: 'string', required: false, description: '`payment` (default) or `payout`.' },
  { name: 'fallback_aggregator', type: 'string', required: false, description: 'Must support the operator and be different from the primary.' },
  { name: 'fee_percent', type: 'number (0-50)', required: false, description: 'Surcharge applied to the customer.' },
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

#### 409 — Duplicate

```json
{
  "message": "A routing rule already exists for this operator, aggregator, and environment combination.",
  "data": null,
  "errors": { "operator": "Duplicate routing rule." }
}
```

#### 422 — Validation

Common errors:

- `aggregator_code`: "Aggregator [X] does not support operator [Y]. Supported: …"
- `fallback_aggregator`: "Fallback aggregator must be different from the primary aggregator."

---

## Retrieve a rule

<ApiEndpoint method="GET" path="/v1/routing-rules/{id}" />

```bash
curl https://backend.zayono.com/api/v1/routing-rules/f1e2d3c4-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Update a rule

<ApiEndpoint method="PUT" path="/v1/routing-rules/{id}" />

Only **non-immutable** fields can be modified (the operator and the primary aggregator stay frozen — delete and recreate if you need to change them).

<ParamTable :params="[
  { name: 'priority', type: 'integer (1-100)', required: false, description: 'New priority.' },
  { name: 'fallback_aggregator', type: 'string | null', required: false, description: 'New fallback, or `null` to remove it.' },
  { name: 'fee_percent', type: 'number (0-50) | null', required: false, description: 'New surcharge.' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Enable/disable the rule.' },
]" />

```bash
curl -X PUT https://backend.zayono.com/api/v1/routing-rules/f1e2d3c4-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{ "priority": 2, "fee_percent": 1.2 }'
```

---

## Delete a rule

<ApiEndpoint method="DELETE" path="/v1/routing-rules/{id}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/routing-rules/f1e2d3c4-... \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Soft delete: the rule is kept for history but no longer participates in routing.

---

## Batch (bulk upsert)

<ApiEndpoint method="POST" path="/v1/routing-rules/bulk" />

Useful to initialize or migrate a fleet of rules in a single request. For each entry:

- If a `(operator, aggregator_code, environment, purpose)` rule already exists → **update** (priority, fallback, fee_percent).
- Otherwise → **create**.

### Parameters

<ParamTable :params="[
  { name: 'rules', type: 'array<RuleInput>', required: true, description: '1 to 50 entries.' },
  { name: 'rules[].operator', type: 'string', required: true, description: 'Operator code.', nested: true },
  { name: 'rules[].aggregator_code', type: 'string', required: true, description: 'Primary aggregator.', nested: true },
  { name: 'rules[].environment', type: 'string', required: true, description: '`sandbox` or `live`.', nested: true },
  { name: 'rules[].priority', type: 'integer (1-100)', required: true, description: 'Priority.', nested: true },
  { name: 'rules[].purpose', type: 'string', required: false, description: '`payment` (default) or `payout`.', nested: true },
  { name: 'rules[].fallback_aggregator', type: 'string', required: false, description: 'Backup aggregator.', nested: true },
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

#### 201 OK — all rules processed without errors

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

#### 207 Multi-Status — partial success

When some entries fail (incompatible aggregator, identical fallback, etc.), the response returns a `207` code and the errors are listed:

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

## Operator / aggregator catalog

### List available operators

<ApiEndpoint method="GET" path="/v1/routing/operators" />

Returns every cataloged operator (`config/operators.php`) along with the list of aggregators that support it. This is the routing-specific endpoint (with aggregator mapping).

::: tip Plain operator catalog
For the flat list of operators (no aggregator mapping), use [`GET /v1/operators`](/en/methodes/operateurs) instead — it's the canonical endpoint referenced from [`/v1/payouts/initialize`](/en/api/payouts).
:::

```bash
curl https://backend.zayono.com/api/v1/routing/operators \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### List aggregators for an operator

<ApiEndpoint method="GET" path="/v1/routing/operators/{operator}/aggregators" />

```bash
curl https://backend.zayono.com/api/v1/routing/operators/mtn_bj/aggregators \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Response:

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

404 response if the operator is unknown:

```json
{ "message": "Operator [foobar] is not recognized.", "data": null, "errors": null }
```

---

## See also

- [Routing concepts](/en/routage/introduction)
- [Real-time routing health](/en/routage/sante) — exposed only on the dashboard (Sanctum).
