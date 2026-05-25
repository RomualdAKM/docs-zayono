# Introduction

Zayono is a **mobile money payment aggregation platform** built for Africa. It provides a single REST API that lets merchants accept payments and send payouts through multiple operators and payment aggregators.

## How it works

```
Your Application → Zayono API → Aggregator → Mobile Money Operator
                                 (PawaPay)    (MTN Mobile Money)
                                 (FedaPay)    (Orange Money)
                                 (FeexPay)    (Moov Money)
                                 (KKiaPay)    (...)
                                 (iPay Money)
                                 (PayDunya)
```

Instead of integrating each aggregator individually, you only integrate one API. Zayono handles routing to the right aggregator based on the operator, the country and your priority rules.

## Key concepts

| Concept | Description |
|---------|-------------|
| **Payment** | Collect money from a customer (mobile money to merchant) |
| **Payout** | Send money to a recipient (merchant to mobile money) |
| **Checkout** | Payment page hosted by Zayono |
| **Operator** | Mobile money service (MTN, Orange, Moov, etc.) |
| **Aggregator** | Payment gateway (PawaPay, FedaPay, etc.) |
| **Routing** | Rules that define which aggregator to use for each operator |

## Base URL

All API requests use the following base URL:

```
https://backend.zayono.com/api/v1/
```

## Next steps

- [Quickstart](/en/guide/demarrage-rapide) - Make your first payment in 5 minutes
- [Authentication](/en/guide/authentification) - Configure your API keys
- [Payments](/en/paiements/introduction) - Learn how to collect payments
