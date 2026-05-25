# Payouts

Payouts let you **send money** directly to your recipients' mobile money accounts.

## Payout flow

```
1. Initialization            2. Processing            3. Result
   POST /payouts/initialize  →  Aggregator → Operator → Success/Failure
                                                           ↓
                                                      4. Webhook
                                                         → Your server
```

## Lifecycle

| Status | Description |
|--------|-------------|
| `initiated` | The payout has been created, waiting for processing |
| `pending` | The payout is being processed |
| `success` | The payout completed successfully |
| `failed` | The payout failed |
| `cancelled` | The payout was cancelled |

## Differences with payments

| | Payment | Payout |
|---|---------|-----------|
| **Direction** | Customer → Merchant | Merchant → Recipient |
| **Operator** | Optional | **Required** |
| **Counterparty** | `customer` | `recipient` |
| **Checkout** | Available | Not available |

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/v1/payouts/initialize` | [Initialize a payout](/en/transferts/initialiser) |
| `GET` | `/v1/payouts/{id}/verify` | [Verify status](/en/transferts/verifier) |
| `GET` | `/v1/payouts/{id}` | [Retrieve details](/en/transferts/recuperer) |
