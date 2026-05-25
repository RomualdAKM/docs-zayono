# Payout status

A payout transitions through several states between creation and final outcome. This page lists all possible statuses and the logical transitions between them.

## Statuses

| Status | Description |
|---|---|
| `initiated` | The payout has been created and sent to the aggregator. Waiting for processing to begin. |
| `pending` | The aggregator has accepted the payout and is executing it. No action required on your side. |
| `success` | The recipient has received the funds. This is the final positive state. |
| `failed` | The payout could not be completed. The `failure_reason` field details the cause. |
| `cancelled` | The payout was cancelled before execution (manually or by the aggregator). |

## Transition diagram

```
initiated ──> pending ──> success
                   └────> failed
                   └────> cancelled
```

A payout **never** returns to an earlier state. Once `success`, `failed` or `cancelled`, it is immutable.

## Common failure causes

The `failure_reason` field provides a human-readable text explaining the failure. The most frequent reasons:

| Reason | Description |
|---|---|
| `Insufficient funds` | Your Zayono balance or the aggregator's balance is insufficient |
| `Invalid recipient number` | The recipient's phone number is invalid or not registered |
| `Recipient account inactive` | The recipient's mobile money account is not active |
| `Operator unavailable` | Temporary unavailability of the operator's network |
| `Amount limit exceeded` | The amount exceeds daily or monthly limits |

## Best practices

- **Never deliver the service** on any status other than `success`
- **Log `failure_reason`** for your own dashboards and customer support
- **Retry `failed` payouts** only if the cause is temporary (operator network unavailable)
- For payouts stuck in `pending` for over **24 hours**, contact support
