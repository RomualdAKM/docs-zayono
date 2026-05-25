# Node.js / TypeScript SDK <span class="zd-tag stable">Stable</span>

Official Node.js SDK, TypeScript-first. Works in ESM + CJS, Bun and Deno compatible.

- **Package**: [`@zayono/sdk`](https://www.npmjs.com/package/@zayono/sdk) on npm
- **Source**: [github.com/zayono/zayono-node](https://github.com/zayono/zayono-node)
- **License**: MIT
- **Node**: 18+
- **Modules**: ESM + CJS
- **Types**: TypeScript declarations included

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
  // baseUrl: 'https://backend.zayono.com/api/v1', // default
  // timeout: 30_000, // ms, default: 30s
  // maxRetries: 3,   // default: 3
})
```

## Initialize a payment

```ts
const payment = await zayono.payments.create({
  amount: 5000,
  currency: 'XOF',
  description: 'Premium T-shirt',
  return_url: 'https://your-site.com/success',
  customer: {
    email: 'customer@example.com',
    first_name: 'John',
    last_name: 'Doe',
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

The SDK is fully typed — your IDE auto-completes every field and flags invalid types at compile time.

## Verify a payment

```ts
const payment = await zayono.payments.retrieve('019e5eaf-cb99-7351-a6d5-c219e28534db')

if (payment.status === 'success') {
  // Payment confirmed. Fulfil the order.
}
```

## Initialize a payout

```ts
const payout = await zayono.payouts.create({
  amount: 10000,
  currency: 'XOF',
  operator: 'mtn_bj',
  description: 'Refund for order ORD-12345',
  recipient: {
    phone: '+22961000000',
    first_name: 'Adele',
    last_name: 'Akpovi',
  },
})
```

## Verify a webhook signature

Express + raw body parser:

```ts
import express from 'express'
import { Zayono } from '@zayono/sdk'

const app = express()
const zayono = new Zayono({ apiKey: process.env.ZAYONO_API_KEY! })

// IMPORTANT: read the RAW body, not parsed JSON.
// The signature is computed on the byte-for-byte raw payload.
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

::: warning Payment / payout listing not exposed on v1
The `GET /v1/payments` (and `GET /v1/payouts`) endpoint is not yet exposed on the API key surface. Only unit methods (`retrieve`, `verify`) are available. Pagination will be added to the SDK once those endpoints are exposed. In the meantime, check transaction history from the [Zayono dashboard](https://app.zayono.com).
:::

For **customers**, `GET /v1/customers` is exposed — async iteration, the SDK paginates automatically:

```ts
for await (const customer of zayono.customers.list({ country: 'BJ' })) {
  console.log(customer.id)
}
```

## Error handling

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
    // 422 — err.errors is a Record<string, string[]>
    console.error(err.errors)
  } else if (err instanceof ZayonoAuthenticationError) {
    // 401 — revoked or invalid key
  } else if (err instanceof ZayonoRateLimitError) {
    // 429 — err.retryAfter (in seconds)
  }
}
```

## Compatibility

| Runtime | Status |
|---|---|
| Node.js 18+ | Supported |
| Node.js 20 LTS | Recommended |
| Bun 1.0+ | Supported |
| Deno 1.40+ | Supported (via npm: spec) |
| Cloudflare Workers | Supported (native fetch) |
| Vercel Edge | Supported |

The SDK uses native `fetch` when available, with `node-fetch` as a fallback.

## Full reference

- [`Zayono`](https://github.com/zayono/zayono-node/blob/main/docs/Zayono.md) — main client
- [`PaymentsResource`](https://github.com/zayono/zayono-node/blob/main/docs/PaymentsResource.md)
- [`PayoutsResource`](https://github.com/zayono/zayono-node/blob/main/docs/PayoutsResource.md)
- [`CustomersResource`](https://github.com/zayono/zayono-node/blob/main/docs/CustomersResource.md)
- [`WebhooksHelper`](https://github.com/zayono/zayono-node/blob/main/docs/WebhooksHelper.md)
- [Types](https://github.com/zayono/zayono-node/blob/main/src/types.ts)
