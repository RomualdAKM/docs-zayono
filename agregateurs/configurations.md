# Configurations d'agregateur

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

## Agregateurs disponibles

<ApiEndpoint method="GET" path="/v1/aggregators/available" />

Liste tous les agregateurs supportes avec les champs de credentials requis.

```bash
curl https://backend.zayono.com/api/v1/aggregators/available \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Lister vos configurations

<ApiEndpoint method="GET" path="/v1/aggregator-configs" />

Retourne toutes vos configurations d'agregateurs (les credentials sont masquees).

```bash
curl https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Ajouter une configuration

<ApiEndpoint method="POST" path="/v1/aggregator-configs" />

<ParamTable :params="[
  { name: 'aggregator_code', type: 'string', required: true, description: 'Code de l agregateur (pawapay, fedapay, etc.)' },
  { name: 'credentials', type: 'object', required: true, description: 'Credentials specifiques a l agregateur' },
  { name: 'is_active', type: 'boolean', required: false, description: 'Activer/desactiver (defaut: true)' },
]" />

::: tip Environnement
L'environnement n'est plus dans le payload. Il est determine **automatiquement** par la cle API utilisee :

- Cle `zyn_test_xxx` → configuration cree en sandbox.
- Cle `zyn_live_xxx` → configuration cree en live.

Pour configurer la meme passerelle en sandbox **et** en live, faites simplement deux appels avec les deux cles API.
:::

Les champs dans `credentials` varient selon l'agregateur :

| Agregateur | Champs requis |
|-----------|---------------|
| `pawapay` | `api_key` |
| `fedapay` | `secret_key`, `public_key` |
| `feexpay` | `shop_id`, `api_token` |
| `kkiapay` | `public_key`, `private_key`, `secret_key` |
| `ipay_money` | `private_key` |
| `paydunya` | `master_key`, `private_key`, `token` |
| `hub2_bj`, `hub2_ci`, `hub2_sn`, `hub2_tg`, `hub2_ml`, `hub2_bf`, `hub2_cm` | `api_key`, `merchant_id` |

::: tip Hub2 — un code par pays
Hub2 est un meta-PSP avec un compte distinct par pays. Voir [Configurer Hub2](/agregateurs/hub2) pour le pas-a-pas multi-pays.
:::

### Exemple (PawaPay)

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "aggregator_code": "pawapay",
    "credentials": {
      "api_key": "votre_cle_api_pawapay_sandbox"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/aggregator-configs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    aggregator_code: 'pawapay',
    credentials: {
      api_key: 'votre_cle_api_pawapay_sandbox',
    },
  }),
})
```
:::

### Exemple (FedaPay)

```bash
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "aggregator_code": "fedapay",
    "credentials": {
      "secret_key": "sk_sandbox_xxxxx",
      "public_key": "pk_sandbox_xxxxx"
    }
  }'
```

### Reponse — 201 Created

A la creation, Zayono renvoie en clair, **une seule fois**, le `webhook_secret` et la `webhook_url` uniques pour cette configuration. Conservez-les soigneusement.

Le champ `webhook_auto_registered` indique si Zayono a pu **enregistrer automatiquement** l'URL sur le tableau de bord de l'agregateur (FedaPay uniquement aujourd'hui). Quand `true`, vous n'avez rien a faire cote agregateur — l'URL est deja en place.

```json
{
  "message": "Aggregator configuration saved.",
  "data": {
    "id": "8c1d2e3f-...",
    "aggregator_code": "pawapay",
    "environment": "sandbox",
    "is_active": true,
    "credentials": { "api_key": "abcd****wxyz" },
    "configured_at": "2025-05-15T11:00:00+00:00",
    "methods_created": 11,
    "webhook_url": "https://backend.zayono.com/api/api/webhooks/ho_abc123def456",
    "webhook_secret": "ih_<id>_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "webhook_auto_registered": false,
    "external_webhook_id": null
  },
  "errors": null
}
```

::: warning A copier immediatement
Le `webhook_secret` n'apparait **qu'a la creation**. Conservez-le en lieu sur, vous ne pourrez plus le consulter ensuite. Si vous le perdez, regenerez-le (voir plus bas).

L'URL `webhook_url` est a renseigner cote agregateur a la place de tout webhook generique. Chaque configuration a sa propre URL, ce qui isole vos webhooks de ceux des autres marchands.
:::

::: info A quoi sert exactement le `webhook_secret` ?
Le secret est destine aux **agregateurs qui acceptent une cle de signature webhook personnalisee** (Stripe, PayPal et autres a venir).

Pour les agregateurs **Mobile Money actuels** (FedaPay, KKiaPay, PawaPay, PayDunya, iPay Money, FeexPay), **vous n'avez rien a coller cote agregateur** — ils n'offrent pas de champ "secret personnalise" et signent leurs webhooks avec leur propre cle (votre `secret_key`, `master_key`, `private_key`, etc. deja fournie dans `credentials`). Zayono verifie automatiquement la signature avec cette meme cle.

Pourquoi conserver le `webhook_secret` quand meme ? Pour le futur :
- agregateurs supportant une signature custom que vous integrerez plus tard,
- canal de verification alternatif,
- trace cryptographique unique par config en cas d'audit.
:::

### Strategie d'enregistrement du webhook par agregateur

Zayono cherche toujours a vous epargner la configuration manuelle quand l'agregateur le permet. Trois niveaux d'automatisation existent selon les API disponibles :

| Agregateur | Strategie | Action requise cote tableau de bord |
|------------|-----------|--------------------------------------|
| **FedaPay** | Auto via API `/v1/webhooks` | Aucune. Zayono enregistre l'URL automatiquement a la connexion (et la supprime a la deconnexion). |
| **FeexPay** | Per-request `callback_url` | Aucune en theorie — Zayono injecte l'URL a chaque collect/payout. Vous pouvez quand meme renseigner une URL globale en backup. |
| **iPay Money** | Per-request `callback_url` | Aucune en theorie. URL injectee a chaque collect. |
| **PayDunya** | Per-request pour payout, manuel pour collect | Pour les **collects**, coller la `webhook_url` dans l'IPN URL du tableau de bord PayDunya. Les payouts utilisent l'URL per-request. |
| **PawaPay** | Manuel | Coller la `webhook_url` dans **Settings → Webhooks** de votre dashboard PawaPay. |
| **KKiaPay** | Manuel | Coller la `webhook_url` dans **Reglages → Notifications** de votre dashboard KKiaPay. |
| **Hub2 (par pays)** | Manuel | Coller la `webhook_url` dans **Settings → Webhooks** du dashboard Hub2 **du pays concerne**. Une URL par pays — ne pas reutiliser entre `hub2_ci`, `hub2_sn`, etc. |

::: tip URL toujours visible
Quelle que soit la strategie, **la `webhook_url` et le `webhook_secret` sont toujours affiches** dans le detail de la passerelle. Vous pouvez ainsi configurer un endpoint supplementaire vous-meme, ou prendre la main si une auto-configuration echoue silencieusement.
:::

::: warning Best-effort
L'auto-enregistrement chez FedaPay est en **best-effort** : si l'appel echoue (rate limit, scope manquant, indisponibilite API), Zayono enregistre la configuration localement sans bloquer et vous laisse coller l'URL a la main. Aucune erreur n'est remontee dans ce cas — le badge "Webhook configure automatiquement" apparait uniquement si l'operation a reussi.
:::

---

## Recuperer une configuration

<ApiEndpoint method="GET" path="/v1/aggregator-configs/{aggregator}" />

```bash
curl https://backend.zayono.com/api/v1/aggregator-configs/pawapay \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

::: tip Note
Les credentials sont masquees dans la reponse pour des raisons de securite.
:::

---

## Supprimer une configuration

<ApiEndpoint method="DELETE" path="/v1/aggregator-configs/{aggregator}" />

```bash
curl -X DELETE https://backend.zayono.com/api/v1/aggregator-configs/pawapay \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

La suppression desactive aussi automatiquement toutes les **methodes** liees a cette configuration.

---

## Regenerer l'URL et le secret webhook

<ApiEndpoint method="POST" path="/v1/aggregator-configs/{aggregator}/regenerate-webhook" />

Genere une **nouvelle** `webhook_url` (token unique) et un **nouveau** `webhook_secret` pour cette configuration. L'ancien couple est immediatement invalide — les notifications signees avec l'ancien secret seront rejetees.

```bash
curl -X POST https://backend.zayono.com/api/v1/aggregator-configs/pawapay/regenerate-webhook \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Reponse — 200 OK

```json
{
  "message": "Webhook channel rotated.",
  "data": {
    "webhook_url": "https://backend.zayono.com/api/api/webhooks/ho_yyy456abc789",
    "webhook_secret": "ih_<id>_yyyyyyyyyyyyyyyyyyyyyyyyyyyy"
  },
  "errors": null
}
```

::: danger A faire dans la foulee
Apres regeneration, mettez immediatement a jour la `webhook_url` **et** le `webhook_secret` dans le tableau de bord de l'agregateur concerne. Sans cela, plus aucune notification entrante ne sera acceptee tant que l'agregateur n'utilise pas le nouveau secret.
:::
