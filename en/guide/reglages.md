# Application settings

Each Zayono application has its own settings block, configurable from the dashboard or — if you're building a custom integration — through the merchant API. The full block is stored in `applications.settings` (JSON) and read by the relevant components on every transaction.

::: tip
This page is a **reference**: it lists every available field, its effect, and where to configure it in the dashboard. See [Applications](/en/guide/applications) for the multi-application concept.
:::

## Email notifications

Three independent switches control the emails sent on each transaction status change. Dashboard: **Settings → Settings**.

| Field | Type | Default | Effect |
|-------|------|--------|-------|
| `transaction_emails` | boolean | `false` | On every status change (`success`, `failed`, `pending`, `cancelled`), a recap email is sent to the **merchant account email**. Generates noise — useful for low-volume merchants. |
| `payment_emails` | boolean | `false` | For each **successful payment** only, a short email is sent to the merchant. Quieter than `transaction_emails`. Ignored for payouts. |
| `client_receipt` | boolean | `false` | After a successful payment (type=payment), a **receipt** is sent to the customer (uses the email collected at transaction creation). Ignored if the customer has no email. |

::: warning
The three flags are independent: to notify the merchant on every successful transaction AND send a receipt to the customer, enable `payment_emails` AND `client_receipt`.
:::

## Support contacts (visible on checkout)

Shown on the hosted checkout page and in the email receipt sent to the customer. Dashboard: **Settings → Settings**.

| Field | Type | Effect |
|-------|------|-------|
| `support_email` | string | Clickable email address in the receipt and on the checkout page (`mailto:`). |
| `support_phone` | string | Phone number shown in plain text in the receipt and the checkout. |

If both are empty, **no support block** is shown on the customer side.

## Routing and orchestration

Configurable from **Payments → Settings → Routing**. See [Selection strategy](/en/routage/introduction#selection-strategy) for the full logic.

| Field | Type | Values | Effect |
|-------|------|---------|-------|
| `routing_strategy` | string | `custom` (default), `auto` | `custom`: Zayono follows the stored rule exactly. `auto`: Zayono picks the best (primary, fallback) in real time based on a weighted success/latency/cost score. |

## Automatic currency conversion

Configurable from **Payments → Settings → Currency conversion**.

| Field | Type | Default | Effect |
|-------|------|--------|-------|
| `currency_conversion` | boolean | `false` | Enables automatic conversion: if the declared currency differs from the operator currency, the amount is converted via Zayono rates before billing. Applies to **payments** AND **payouts**. |
| `correction_rate` | number (%) | `2.0` | Margin added to the exchange rate to absorb fluctuations. For example, a base rate of 600 XOF/USD with `correction_rate=2` gives an effective 612 XOF/USD. Range 0–100. |

See [Supported currencies](/en/taux-change/devises) for the list of covered pairs.

## Checkout appearance

Configurable from **Payments → Settings → Appearance**.

| Field | Type | Values | Effect |
|-------|------|---------|-------|
| `checkout_template` | string | `default` (default), `abidjan`, `cotonou` | Template applied to checkout sessions without an explicit `template` at initialization time. See [Checkout — Templates](/en/checkout/introduction#checkout-page-templates). |
| `checkout_primary_color` | string (hex) | `null` | Hexadecimal code `#RRGGBB`. Replaces the Zayono primary blue with your brand colour across all three templates. `null` = default Zayono colour. The settings page checks WCAG contrast live. |

## Application identity

Configurable from **Settings → Information**. These fields are **direct columns** on the `applications` table (not in `settings`), but they affect customer-side rendering.

| Field | Type | Effect |
|-------|------|-------|
| `name` | string | Brand name shown to the customer on the checkout page and in the receipt subject/body. |
| `description` | string | Internal description (not shown to the customer). |
| `app_icon` | string (URL) | Icon shown to customers on the checkout and in the email receipt. Upload via `POST /merchant/settings/icon`. |
| `website` | string | Public merchant site URL. Exposed in the `GET /v1/checkout/{token}` response under `data.merchant.website` for integrations that host their own checkout; **not shown** by the three default Zayono templates. |

## JSON summary

Here is the full shape of the `settings` block once every field is configured:

```json
{
  "transaction_emails": true,
  "payment_emails": true,
  "client_receipt": true,
  "support_email": "support@your-store.com",
  "support_phone": "+229 90 11 22 33",
  "routing_strategy": "auto",
  "currency_conversion": true,
  "correction_rate": 2.0,
  "checkout_template": "abidjan",
  "checkout_primary_color": "#10B981",
  "app_icon": "https://cdn.zayono.com/icons/app-xyz.png",
  "website": "https://your-store.com"
}
```

::: info
All fields are **optional**. A new account starts with `settings = {}` and each component falls back to its default behaviour until a field is set.
:::
