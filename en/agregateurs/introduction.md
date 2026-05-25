# Aggregators

Aggregators are the **payment gateways** that process your transactions with the mobile money operators. Zayono supports multiple aggregators, and each merchant configures **its own credentials** for each one.

## Supported aggregators

| Code | Name | Capabilities | Required credentials |
|------|-----|-------------|---------------------|
| `pawapay` | PawaPay | Payment + Payout | `api_key` |
| `fedapay` | FedaPay | Payment + Payout | `secret_key`, `public_key` |
| `feexpay` | FeexPay | Payment + Payout | `shop_id`, `api_token` |
| `kkiapay` | KKiaPay | Payment + Payout | `public_key`, `private_key`, `secret_key` |
| `ipay_money` | iPay Money | **Payment only** | `private_key` |
| `paydunya` | PayDunya | Payment + Payout | `master_key`, `private_key`, `token` |
| `hub2_bj`, `hub2_ci`, `hub2_sn`, `hub2_tg`, `hub2_ml`, `hub2_bf`, `hub2_cm` | Hub2 | Payment + Payout | `api_key`, `merchant_id` (per country) |

::: info Hub2 — one code per country
Hub2 is a **pan-African meta-PSP**: each covered country has its own Hub2 dashboard and **its own credentials**. Zayono therefore exposes a distinct `aggregator_code` per country (`hub2_bj`, `hub2_ci`, …) rather than a single global code. You configure one Hub2 code per country where you want to collect. See [Configure Hub2](/en/agregateurs/hub2) for the detailed walkthrough.
:::

::: tip Capabilities
- **Payment**: collect funds from the customer's mobile money (in).
- **Payout**: send funds to a recipient's mobile money (out).

`iPay Money` does **not** support outbound payouts. Any payout attempt against this aggregator will be rejected. Configure another aggregator for payouts if you operate in Benin or Niger.
:::

Each aggregator's capabilities are exposed dynamically via `GET /v1/aggregators/available` (`capabilities` field).

## Decentralised management

Each merchant configures its **own credentials** for each aggregator. There are no shared global credentials. This means:

- Revenue is paid **directly** into the merchant's aggregator account
- Each merchant can use **different aggregators**
- Credentials are encrypted with **AES-256** at rest

## Configuration per environment

You must configure your credentials **separately** for sandbox and live:

- Sandbox credentials: used for testing (aggregator test keys)
- Live credentials: used in production (aggregator production keys)

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/v1/aggregators/available` | Available aggregators |
| `GET` | `/v1/aggregator-configs` | Your configurations |
| `POST` | `/v1/aggregator-configs` | Add a configuration |
| `GET` | `/v1/aggregator-configs/{code}` | Retrieve a config |
| `DELETE` | `/v1/aggregator-configs/{code}` | Delete a config |
| `POST` | `/v1/aggregator-configs/{code}/test` | Test the connection |
