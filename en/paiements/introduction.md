# Payments

Payments let you **collect money** from your customers via mobile money operators.

## Payment flow

```
1. Initialization        2. Processing            3. Result
   POST /payments/initialize → Aggregator → Operator → Success/Failure
                                                          ↓
                                                     4. Webhook
                                                        → Your server
```

## Lifecycle

A payment goes through the following statuses:

| Status | Description |
|--------|-------------|
| `initiated` | The payment has been created, waiting for processing |
| `pending` | The payment is being processed by the aggregator |
| `success` | The payment completed successfully |
| `failed` | The payment failed |
| `cancelled` | The payment was cancelled |

## Two initialization modes

### Direct mode (with operator)

If you specify the `operator` parameter at initialization, the payment is **processed immediately** through the associated aggregator.

```json
{
  "amount": 1000,
  "currency": "XOF",
  "operator": "mtn_bj",
  ...
}
```

### Checkout mode (without operator)

If you don't specify `operator`, Zayono returns a `checkout_url` where the customer can pick their operator.

```json
{
  "amount": 1000,
  "currency": "XOF",
  ...
}
// → Response includes checkout_url
```

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/v1/payments/initialize` | [Initialize a payment](/en/paiements/initialiser) |
| `GET` | `/v1/payments/{id}/verify` | [Verify status](/en/paiements/verifier) |
| `GET` | `/v1/payments/{id}` | [Retrieve details](/en/paiements/recuperer) |
