# Node.js / TypeScript SDK <span class="zd-tag stable">Stable</span>

SDK Node.js officiel, TypeScript-first. Marche en ESM + CJS, compatible Bun et Deno.

- **Package** : [`@zayono/sdk`](https://www.npmjs.com/package/@zayono/sdk) sur npm
- **Source** : [github.com/RomualdAKM/sdks-zayono](https://github.com/RomualdAKM/sdks-zayono/tree/main/zayono-node)
- **License** : MIT
- **Node** : 18+
- **Modules** : ESM + CJS
- **Types** : déclarations TypeScript incluses

## Installation

::: code-group

```bash [npm]
npm install @zayono/sdk
```

```bash [pnpm]
pnpm add @zayono/sdk
```

```bash [yarn]
yarn add @zayono/sdk
```

```bash [bun]
bun add @zayono/sdk
```

:::

## Configuration

```ts
import { Zayono } from '@zayono/sdk'

const zayono = new Zayono({
  apiKey: process.env.ZAYONO_API_KEY!,
  // baseUrl: 'https://backend.zayono.com/api/v1', // défaut
  // timeout: 30_000, // ms, défaut: 30s
  // maxRetries: 3,   // défaut: 3
})
```

## Initialiser un paiement

```ts
const payment = await zayono.payments.create({
  amount: 5000,
  currency: 'XOF',
  description: 'T-shirt premium',
  return_url: 'https://votre-site.com/success',
  customer: {
    email: 'customer@example.com',
    first_name: 'Jean',
    last_name: 'Dupont',
    phone: '+22990123456',
  },
  operator: 'mtn_bj',
  metadata: {
    order_id: 'ORD-12345',
  },
})

console.log(payment.checkout_url)
// → https://app.zayono.com/checkout/abc123...
```

Le SDK est entièrement typé — votre IDE vous propose l'auto-complétion sur tous les champs et signale les types invalides à la compilation.

## Vérifier un paiement

```ts
const payment = await zayono.payments.retrieve('019e5eaf-cb99-7351-a6d5-c219e28534db')

if (payment.status === 'success') {
  // Le paiement est confirmé. Livrez la commande.
}
```

## Initialiser un transfert

```ts
const payout = await zayono.payouts.create({
  amount: 10000,
  currency: 'XOF',
  operator: 'mtn_bj',
  description: 'Remboursement commande ORD-12345',
  recipient: {
    phone: '+22961000000',
    first_name: 'Adèle',
    last_name: 'Akpovi',
  },
})
```

## Vérifier une signature webhook

Express + raw body parser :

```ts
import express from 'express'
import { Zayono } from '@zayono/sdk'

const app = express()
const zayono = new Zayono({ apiKey: process.env.ZAYONO_API_KEY! })

// IMPORTANT: lire le body RAW, pas du JSON parsé.
// La signature est calculée sur le payload brut byte-à-byte.
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.header('x-zayono-signature') ?? ''
  const isValid = zayono.webhooks.verify(
    req.body,
    signature,
    process.env.ZAYONO_WEBHOOK_SECRET!,
  )

  if (!isValid) return res.status(401).send('Invalid signature')

  const event = JSON.parse(req.body.toString())
  switch (event.event) {
    case 'payment.successful': /* ... */ break
    case 'payment.failed':    /* ... */ break
  }

  res.status(200).end()
})
```

## Pagination

::: warning Listing paiements / payouts non exposé sur v1
L'endpoint `GET /v1/payments` (et `GET /v1/payouts`) n'est pas encore exposé sur la surface API key. Seules les méthodes unitaires (`retrieve`, `verify`) sont disponibles. La pagination sera ajoutée au SDK quand ces endpoints seront exposés. En attendant, consultez l'historique depuis le [dashboard Zayono](https://app.zayono.com).
:::

Pour les **clients**, `GET /v1/customers` est exposé — itération asynchrone, le SDK pagine automatiquement :

```ts
for await (const customer of zayono.customers.list({ country: 'BJ' })) {
  console.log(customer.id)
}
```

## Gestion des erreurs

```ts
import {
  ZayonoValidationError,
  ZayonoAuthenticationError,
  ZayonoRateLimitError,
} from '@zayono/sdk'

try {
  const payment = await zayono.payments.create({ /* ... */ })
} catch (err) {
  if (err instanceof ZayonoValidationError) {
    // 422 — err.errors est un Record<string, string[]>
    console.error(err.errors)
  } else if (err instanceof ZayonoAuthenticationError) {
    // 401 — clé révoquée ou invalide
  } else if (err instanceof ZayonoRateLimitError) {
    // 429 — err.retryAfter (en secondes)
  }
}
```

## Compatibilité

| Runtime | Statut |
|---|---|
| Node.js 18+ | ✅ Supporté |
| Node.js 20 LTS | ✅ Recommandé |
| Bun 1.0+ | ✅ Supporté |
| Deno 1.40+ | ✅ Supporté (via npm: spec) |
| Cloudflare Workers | ✅ Supporté (fetch natif) |
| Vercel Edge | ✅ Supporté |

Le SDK utilise `fetch` natif quand disponible, sinon `node-fetch` en fallback.

## Référence complète

- [`Zayono`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-node/docs/Zayono.md) — client principal
- [`PaymentsResource`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-node/docs/PaymentsResource.md)
- [`PayoutsResource`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-node/docs/PayoutsResource.md)
- [`CustomersResource`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-node/docs/CustomersResource.md)
- [`WebhooksHelper`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-node/docs/WebhooksHelper.md)
- [Types](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-node/src/types.ts)
