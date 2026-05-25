# Gerer les endpoints webhook

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

Gerez vos endpoints webhook via l'API pour recevoir les notifications de transactions.

## Creer un endpoint

<ApiEndpoint method="POST" path="/v1/webhook-endpoints" />

<ParamTable :params="[
  { name: 'url', type: 'string', required: true, description: 'URL HTTPS de votre endpoint (max 2048 caracteres)' },
  { name: 'events', type: 'array', required: true, description: 'Liste des evenements a ecouter (minimum 1)' },
]" />

**Evenements valides :** `payment.initialized`, `payment.successful`, `payment.failed`, `payout.initialized`, `payout.successful`, `payout.failed`

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://votre-site.com/webhooks/zayono",
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
    url: 'https://votre-site.com/webhooks/zayono',
    events: ['payment.successful', 'payment.failed', 'payout.successful'],
  }),
})
```
:::

### Reponse — 201 Created

```json
{
  "message": "Webhook endpoint created successfully.",
  "data": {
    "id": "d4e5f6a7-b8c9-0123-defg-456789012345",
    "url": "https://votre-site.com/webhooks/zayono",
    "events": ["payment.successful", "payment.failed", "payout.successful"],
    "secret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "is_active": true,
    "created_at": "2025-05-15T09:00:00+00:00"
  },
  "errors": null
}
```

::: warning Attention
Le champ `secret` n'est affiche qu'a la **creation**. Sauvegardez-le immediatement. Il ne sera plus visible ensuite.
:::

---

## Lister les endpoints

<ApiEndpoint method="GET" path="/v1/webhook-endpoints" />

```bash
curl https://backend.zayono.com/api/v1/webhook-endpoints \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Recuperer un endpoint

<ApiEndpoint method="GET" path="/v1/webhook-endpoints/{id}" />

Le `secret` est masque dans la reponse (ex: `************abc123`).

---

## Supprimer un endpoint

<ApiEndpoint method="DELETE" path="/v1/webhook-endpoints/{id}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/webhook-endpoints/d4e5f6a7-b8c9-0123-defg-456789012345 \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Regenerer le secret

<ApiEndpoint method="POST" path="/v1/webhook-endpoints/{id}/regenerate-secret" />

Genere un nouveau secret pour l'endpoint. L'ancien secret est immediatement invalide.

```bash
curl -X POST https://backend.zayono.com/api/v1/webhook-endpoints/d4e5f6a7-b8c9-0123-defg-456789012345/regenerate-secret \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Reponse — 200 OK

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
Apres regeneration, mettez a jour le secret dans votre application immediatement. Les webhooks signes avec l'ancien secret seront rejetes.
:::
