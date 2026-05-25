# Exchange rates

The Exchange rates API exposes the **exchange rates** that Zayono uses for automatic conversion between currencies (for instance, a merchant who bills in XOF and receives a payment in EUR through Stripe). Rates are **read-only** on v1 — their updates are managed by super-admins from the admin dashboard.

- **Base URL**: `https://backend.zayono.com/api/v1`
- **Auth**: `Authorization: Bearer zyn_test_...` or `Bearer zyn_live_...`

::: info Updates
Creating and updating rates goes through the admin routes (`POST /api/admin/exchange-rates`, `POST /api/admin/exchange-rates/bulk-update`) — not documented here as they are reserved for the Zayono team. For the merchant-side configuration, see [Exchange rates — List](/en/taux-change/lister).
:::

---

## List rates

<ApiEndpoint method="GET" path="/v1/exchange-rates" />

Returns a paginated list of **active** rates (`is_active = true`), sorted by `currency_from` then `currency_to`.

### Query

<ParamTable :params="[
  { name: 'currency_from', type: 'string (ISO 4217)', required: false, description: 'Filter by source currency (case-insensitive).' },
  { name: 'currency_to', type: 'string (ISO 4217)', required: false, description: 'Filter by target currency.' },
  { name: 'per_page', type: 'integer', required: false, description: 'Default 20.' },
  { name: 'page', type: 'integer', required: false, description: 'Current page.' },
]" />

```bash
curl "https://backend.zayono.com/api/v1/exchange-rates?currency_from=XOF" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Response (the `data` content is a standard Laravel `Paginator` envelope):

```json
{
  "message": "Exchange rates retrieved.",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "...",
        "currency_from": "XOF",
        "currency_to": "EUR",
        "rate": "0.001524",
        "is_active": true,
        "updated_at": "2026-05-25T06:00:00+00:00"
      }
    ],
    "per_page": 20,
    "total": 7,
    "last_page": 1
  },
  "errors": null
}
```

---

## Convert an amount

<ApiEndpoint method="POST" path="/v1/exchange-rates/convert" />

Converts an amount between two currencies using the internal strategy: direct rate if available, otherwise inverse rate, otherwise pivot through USD.

### Parameters

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Amount to convert (minimum 0.01).' },
  { name: 'from', type: 'string (ISO 4217)', required: true, description: 'Source currency (3 letters).' },
  { name: 'to', type: 'string (ISO 4217)', required: true, description: 'Target currency. Must differ from `from`.' },
]" />

### Example

```bash
curl -X POST https://backend.zayono.com/api/v1/exchange-rates/convert \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 5000, "from": "XOF", "to": "EUR" }'
```

### Response — 200 OK

```json
{
  "message": "Conversion calculated.",
  "data": {
    "original_amount": 5000,
    "converted_amount": 7.62,
    "rate": 0.001524,
    "from": "XOF",
    "to": "EUR",
    "method": "direct"
  },
  "errors": null
}
```

The `method` field tells you which path was taken:

| Method | Description |
|---|---|
| `direct` | A `from → to` rate exists directly. |
| `inverse` | Only the inverse rate existed; computed via `1 / rate`. |
| `pivot_usd` | Pivoted through USD (`from → USD → to`). |
| `peg` | Fixed-parity pair (XOF↔XAF, XOF↔EUR at 655.957). |

### Response — 422

```json
{ "message": "No exchange rate path between XOF and JPY.", "data": null, "errors": null }
```

---

## List supported currencies

<ApiEndpoint method="GET" path="/v1/currencies" />

Returns the list of currencies **covered** by at least one operator or one active FX rate. Useful to pre-fill a select on the frontend.

```bash
curl https://backend.zayono.com/api/v1/currencies \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Response:

```json
{
  "message": "Supported currencies retrieved.",
  "data": {
    "currencies": ["XOF", "XAF", "GHS", "KES", "NGN", "ZAR", "USD", "EUR", "GBP"],
    "count": 9
  },
  "errors": null
}
```

---

## See also

- [Convert between currencies](/en/taux-change/convertir) — integration examples on the checkout side.
- [Supported currencies](/en/taux-change/devises) — fixed pegs (XOF↔XAF, XOF↔EUR), precision per currency.
