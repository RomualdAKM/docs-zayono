# Exchange rates

L'API Exchange rates expose les **taux de change** que Zayono utilise pour la conversion automatique entre devises (par ex. un marchand qui facture en XOF et reçoit un paiement en EUR via Stripe). Les taux sont en **lecture seule** côté v1 — leur mise à jour est gérée par les super-admins depuis le dashboard d'administration.

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Auth** : `Authorization: Bearer zyn_test_...` ou `Bearer zyn_live_...`

::: info Mise à jour
La création / mise à jour des taux passe par les routes admin (`POST /api/admin/exchange-rates`, `POST /api/admin/exchange-rates/bulk-update`) — non documentées ici car réservées à l'équipe Zayono. Pour la configuration côté marchand, voir [Taux de change — Lister](/taux-change/lister).
:::

---

## Lister les taux

<ApiEndpoint method="GET" path="/v1/exchange-rates" />

Renvoie une liste paginée des taux **actifs** (`is_active = true`), triés par `currency_from` puis `currency_to`.

### Query

<ParamTable :params="[
  { name: 'currency_from', type: 'string (ISO 4217)', required: false, description: 'Filtre par devise source (insensible à la casse).' },
  { name: 'currency_to', type: 'string (ISO 4217)', required: false, description: 'Filtre par devise cible.' },
  { name: 'per_page', type: 'integer', required: false, description: 'Défaut 20.' },
  { name: 'page', type: 'integer', required: false, description: 'Page courante.' },
]" />

```bash
curl "https://backend.zayono.com/api/v1/exchange-rates?currency_from=XOF" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Réponse (le contenu de `data` est une enveloppe Laravel `Paginator` standard) :

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

## Convertir un montant

<ApiEndpoint method="POST" path="/v1/exchange-rates/convert" />

Convertit un montant entre deux devises en utilisant la stratégie interne : taux direct si disponible, sinon taux inverse, sinon pivot via USD.

### Paramètres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant à convertir (minimum 0.01).' },
  { name: 'from', type: 'string (ISO 4217)', required: true, description: 'Devise source (3 lettres).' },
  { name: 'to', type: 'string (ISO 4217)', required: true, description: 'Devise cible. Doit être différente de `from`.' },
]" />

### Exemple

```bash
curl -X POST https://backend.zayono.com/api/v1/exchange-rates/convert \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{ "amount": 5000, "from": "XOF", "to": "EUR" }'
```

### Réponse — 200 OK

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

Le champ `method` renseigne sur le chemin emprunté :

| Méthode | Description |
|---|---|
| `direct` | Un taux `from → to` existe directement. |
| `inverse` | Seul le taux inverse existait ; calcul via `1 / rate`. |
| `pivot_usd` | Pivot via USD (`from → USD → to`). |
| `peg` | Paire à parité fixe (XOF↔XAF, XOF↔EUR à 655.957). |

### Réponse — 422

```json
{ "message": "No exchange rate path between XOF and JPY.", "data": null, "errors": null }
```

---

## Lister les devises supportées

<ApiEndpoint method="GET" path="/v1/currencies" />

Renvoie la liste des devises **couvertes** par au moins un opérateur ou un taux FX actif. Utile pour pré-remplir un select côté frontend.

```bash
curl https://backend.zayono.com/api/v1/currencies \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Réponse :

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

## Voir aussi

- [Convertir entre devises](/taux-change/convertir) — exemples d'intégration côté caisse.
- [Devises supportées](/taux-change/devises) — pegs fixes (XOF↔XAF, XOF↔EUR), précisions par devise.
