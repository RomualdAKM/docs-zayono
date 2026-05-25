# Manage webhook endpoints

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../../.vitepress/theme/components/ParamTable.vue'
</script>

Manage your webhook endpoints via the API to receive transaction notifications.

## Create an endpoint

<ApiEndpoint method="POST" path="/v1/webhook-endpoints" />

<ParamTable :params="[
  { name: 'url', type: 'string', required: true, description: 'HTTPS URL of your endpoint (max 2048 characters)' },
  { name: 'events', type: 'array', required: true, description: 'List of events to listen for (minimum 1)' },
]" />

**Valid events:** `payment.initialized`, `payment.successful`, `payment.failed`, `payout.initialized`, `payout.successful`, `payout.failed`

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/webhooks/zayono",
    "events": ["payment.successful", "payment.failed", "payout.successful"]
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/webhook-endpoints', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://your-site.com/webhooks/zayono',
    events: ['payment.successful', 'payment.failed', 'payout.successful'],
  }),
})
```
:::

### Response — 201 Created

```json
{
  "message": "Webhook endpoint created successfully.",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-defg-456789012345",
    "url": "https://your-site.com/webhooks/zayono",
    "events": ["payment.successful", "payment.failed", "payout.successful"],
    "secret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "is_active": true,
    "created_at": "2025-05-15T09:00:00+00:00"
  },
  "errors": null
}
```

::: warning Heads up
The `secret` field is only shown at **creation** time. Save it immediately — it won't be visible again.
:::

---

## List endpoints

<ApiEndpoint method="GET" path="/v1/webhook-endpoints" />

```bash
curl https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Retrieve an endpoint

<ApiEndpoint method="GET" path="/v1/webhook-endpoints/{id}" />

The `secret` is masked in the response (e.g. `************abc123`).

---

## Delete an endpoint

<ApiEndpoint method="DELETE" path="/v1/webhook-endpoints/{id}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/webhook-endpoints/d4e5f6a7-b8c9-0123-defg-456789012345 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Regenerate the secret

<ApiEndpoint method="POST" path="/v1/webhook-endpoints/{id}/regenerate-secret" />

Generates a new secret for the endpoint. The previous secret is immediately invalidated.

```bash
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints/d4e5f6a7-b8c9-0123-defg-456789012345/regenerate-secret \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Response — 200 OK

```json
{
  "message": "Webhook secret regenerated successfully.",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-defg-456789012345",
    "secret": "whsec_yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
  },
  "errors": null
}
```

::: danger Important
After regeneration, update the secret in your application immediately. Webhooks signed with the old secret will be rejected.
:::
