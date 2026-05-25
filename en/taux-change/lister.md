# List exchange rates

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/exchange-rates" />

Retrieves the list of available exchange rates.

## Query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `currency_from` | `string` | Filter by source currency |
| `currency_to` | `string` | Filter by target currency |
| `page` | `integer` | Page number |
| `per_page` | `integer` | Results per page (max 100) |

## Example

::: code-group
```bash [cURL]
curl "https://backend.zayono.com/api/v1/exchange-rates?currency_from=XOF" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/exchange-rates?currency_from=XOF',
  {
    headers: {
      'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  }
)
```
:::

## Response — 200 OK

```json
{
  "message": "Exchange rates retrieved.",
  "data": [
    {
      "id": "...",
      "currency_from": "XOF",
      "currency_to": "XAF",
      "rate": 1.0000,
      "source": "fixed_peg",
      "last_synced_at": null,
      "updated_at": "2025-05-15T00:00:00+00:00"
    },
    {
      "id": "...",
      "currency_from": "USD",
      "currency_to": "GHS",
      "rate": 12.4831,
      "source": "api:open_er_api",
      "last_synced_at": "2026-05-20T18:00:00+00:00",
      "updated_at": "2026-05-20T18:00:14+00:00"
    }
  ],
  "errors": null
}
```

## Source and refresh

The `source` field indicates where the rate comes from:

| Source | Behaviour |
|--------|--------------|
| `fixed_peg` | **Regulated** rate (EUR↔XOF/XAF = 655.957). Never changes, never overwritten by the cron. |
| `manual_override` | Lock set by an admin. Never changes, never overwritten by the cron. |
| `manual` | Default-shipped value. **May** be overwritten by the next cron run. |
| `api:<provider>` | Rate written by the refresh cron (`fx:refresh`, every 6h). |

The `last_synced_at` field is `null` until an external source has written the row. Otherwise it carries the timestamp asserted by the provider — useful to detect staleness. Beyond **24h**, treat the rate as **stale** and raise an alert on the application side.
