# Available methods

List of payout methods supported by Zayono. The `code` field is what you pass in the `operator` parameter when initializing a payout.

::: tip Shared catalogue
Payouts use the same operator codes as payments. See the full list at [Payments → Available methods](/en/paiements/methodes-disponibles).

A few practical differences between payments and payouts:
- Mobile Money operators generally support both flows
- **Cards** are not reversible → payments only, no payouts
- **Bank transfers** (`bank_ng`, `bank_gh`) are payout-only (no push-collect by bank transfer)
- **Wallets** Wave and Djamo support both payouts and payments
- **Crypto**: payouts only via `crypto_global` (Cryptomus). Coinbase Commerce is payment-only.
:::

## Mobile Money — available for payouts

The operator codes available for `POST /v1/payouts/initialize` are the same as for payments, provided at least one aggregator connected to your account supports payout on that method.

To check in real time which payout methods are enabled on your account:

```bash
curl https://backend.zayono.com/api/v1/operators?purpose=payout \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Bank transfer (payout-only)

Distinct from Mobile Money codes, the `bank_*` codes let you transfer directly to a recipient's bank account. For these methods, **additional fields** are required in `recipient`:

| Method | Code | Currency | Additional required fields |
|---|---|---|---|
| Bank Transfer Nigeria | `bank_ng` | NGN | `recipient.bank_code`, `recipient.account_number` |
| Bank Transfer Ghana | `bank_gh` | GHS | `recipient.bank_code`, `recipient.account_number` |

::: warning Aggregator-side validation
The account number is checked against the issuing bank **before** funds are sent. If the number is invalid, the payout moves straight to `failed` with `failure_reason: "Invalid account number"`.
:::

## Crypto (payout-only via Cryptomus)

| Method | Code | Currency | Additional required fields |
|---|---|---|---|
| Multi-asset crypto payout | `crypto_global` | * | `recipient.wallet_address`, `recipient.network` (BTC, ETH, TRC20, etc.) |

## Best practices

- **Check your Zayono account balance** before each payout (`GET /v1/balance`)
- For **high volumes**, contact support to raise your limits
- Watch the `payout.successful` webhook to confirm funds arrived at the recipient — a `pending` payout is **not** guaranteed to complete
- **Payout fees** are distinct from payment fees and configurable per method in your dashboard
