# Routing

Zayono's routing system lets you define **which aggregator** should be used to process payments for each operator.

## Principle

When a payment is initiated with an operator (e.g. `mtn_bj`), Zayono consults your routing rules to determine:

1. Which **aggregator** to use (e.g. PawaPay, FedaPay)
2. Which **fallback aggregator** to use on failure
3. Which **fee percentage** to add to the amount charged to the customer (the merchant receives the net `amount`)

```
MTN BJ payment
      ↓
Rule: mtn_bj → pawapay (priority 1, fallback: fedapay)
      ↓
Try PawaPay → Failure?
      ↓              ↓
   Success       Try FedaPay
```

## Configuration per environment

Routing rules are configured **separately** for sandbox and live:

- Sandbox rules: used with `zyn_test_...` keys
- Live rules: used with `zyn_live_...` keys

## Priority

Each rule has a **priority** (1-100, 1 = highest). If multiple rules exist for the same operator, the one with the highest priority is used.

## Selection strategy

The `routing_strategy` field in your application settings (Payments → Settings → Routing) controls **how** Zayono picks the aggregator on each transaction:

### `custom` — you decide (default)

The primary aggregator and the fallback are exactly the ones you configured in the routing rule. No automatic logic alters them. Pick this strategy if you want total, predictable control.

### `auto` — Zayono optimises in real time

On every transaction, Zayono scores the connected aggregators able to serve the requested operator, then automatically picks the **best (primary, fallback) duo** based on a weighted score:

- **50% success rate** over the last 7 days for this (application × operator × environment × type) tuple
- **30% average latency** of successful calls (faster is better)
- **20% cost** (the `fee_percent` you declared)

The computation is **cached for 15 minutes** per tuple to stay negligible at transaction scale. If an aggregator has fewer than 5 attempts in the window (cold start), Zayono falls back to a deterministic alphabetical order until data accumulates.

The stored rule is **not** modified — Zayono only overrides the (primary, fallback) pair in memory at transaction execution time. If you switch back to `custom`, your manual configuration kicks back in immediately.

::: tip
Enabling `auto` does not remove the need for a routing rule: Zayono can only pick from aggregators **connected to the application** AND **listed as compatible** with the operator in the internal configuration. The rule also declares the `fee_percent` that feeds the score.
:::

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/v1/routing-rules` | List your rules |
| `POST` | `/v1/routing-rules` | Create a rule |
| `GET` | `/v1/routing-rules/{id}` | Retrieve a rule |
| `PUT` | `/v1/routing-rules/{id}` | Update a rule |
| `DELETE` | `/v1/routing-rules/{id}` | Delete a rule |
| `POST` | `/v1/routing-rules/bulk` | Bulk create rules |
| `GET` | `/v1/routing/operators` | Available operators |
| `GET` | `/v1/routing/operators/{op}/aggregators` | Aggregators for an operator |

See the [Routing rules](/en/routage/regles) page for the full reference.
