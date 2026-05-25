# Payment status

A payment transitions through several states between creation and final outcome. This page lists all possible statuses and the logical transitions between them.

## Statuses

| Status | Description |
|---|---|
| `initiated` | The payment has been created and sent to the aggregator. Waiting for customer action. |
| `pending` | The aggregator accepted the payment, the customer started the flow (entering OTP, scanning, etc.). |
| `success` | The payment was confirmed by the operator. This is the final positive state — you can deliver the service. |
| `failed` | The payment failed. The `failure_reason` field details the cause. |
| `cancelled` | The payment was cancelled by the customer or due to checkout session expiration. |
| `refunded` | The payment was refunded (from the dashboard or via the dashboard API). |

## Transition diagram

```
initiated ──> pending ──> success ──> refunded
                   └────> failed
                   └────> cancelled
```

A payment **never** returns to an earlier state. Once `success`, `failed`, `cancelled` or `refunded`, it is immutable.

::: tip `refunded` status
Only a payment previously in `success` can move to `refunded`. The `payment.refunded` webhook is emitted at that moment. For payouts, the `refunded` status does not exist — a payout can only be `success`, `failed` or `cancelled`.
:::

## Common failure causes

The `failure_reason` field provides a human-readable text explaining the failure. The most frequent reasons:

| Reason | Description |
|---|---|
| `Insufficient funds` | The customer's wallet balance is insufficient |
| `Invalid PIN` | The Mobile Money PIN entered by the customer is incorrect |
| `Operation timeout` | The customer did not validate within the allotted time (usually 2-5 min) |
| `Operator unavailable` | Temporary unavailability of the operator's network |
| `Card declined` | The issuing bank refused the transaction (cards only) |
| `3DS failed` | 3D Secure authentication failure (international cards) |

## Best practices

- **Never deliver the service** on any status other than `success`
- **Log `failure_reason`** for your own dashboards and customer support
- **Listen to the `payment.refunded` webhook** to keep your orders in sync
- For payments stuck in `pending` beyond **15 minutes**, treat them as abandoned and call `GET /v1/payments/{id}` to confirm the final status
