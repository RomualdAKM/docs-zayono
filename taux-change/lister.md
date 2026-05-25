# Lister les taux de change

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/exchange-rates" />

Recupere la liste des taux de change disponibles.

## Parametres de requete

| Parametre | Type | Description |
|-----------|------|-------------|
| `currency_from` | `string` | Filtrer par devise source |
| `currency_to` | `string` | Filtrer par devise cible |
| `page` | `integer` | Numero de page |
| `per_page` | `integer` | Resultats par page (max 100) |

## Exemple

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

## Reponse — 200 OK

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

## Provenance et rafraichissement

Le champ `source` indique d'ou vient le taux :

| Source | Comportement |
|--------|--------------|
| `fixed_peg` | Taux **regule** (EUR↔XOF/XAF = 655.957). Ne change jamais, jamais reecrit par le cron. |
| `manual_override` | Lock pose par un admin. Ne change jamais, jamais reecrit par le cron. |
| `manual` | Valeur shippee par defaut. **Peut** etre reecrite par le prochain cron. |
| `api:<provider>` | Taux ecrit par le cron de rafraichissement (`fx:refresh`, toutes les 6h). |

Le champ `last_synced_at` est `null` tant qu'aucune source externe n'a ecrit la ligne. Sinon il porte le timestamp asserte par le fournisseur — utile pour detecter la stagnation. Au dela de **24h**, considerez le taux comme **obsolete** et levez une alerte cote application.
