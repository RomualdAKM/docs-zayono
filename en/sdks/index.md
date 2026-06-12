# Official SDKs

Zayono publishes maintained SDKs for the 4 most-used languages in payment integration. They wrap authentication, automatic retries, pagination, webhook signature verification, and expose a typed API idiomatic to the host language.

<Cards>
  <Card
    title="PHP SDK"
    description="Composer · PHP 8.1+ · Guzzle 7 · PSR-18"
    icon="/icons/php.svg"
    href="/en/sdks/php"
    badge="stable"
  />
  <Card
    title="Laravel SDK"
    description="Opinionated wrapper around the PHP SDK: service provider, facade, publishable config."
    icon="/icons/laravel.svg"
    href="/en/sdks/laravel"
    badge="soon"
  />
  <Card
    title="Node.js / TypeScript SDK"
    description="Native TypeScript · ESM + CJS · Node 18+ · Bun + Deno compatible"
    icon="/icons/node.svg"
    href="/en/sdks/node"
    badge="stable"
  />
  <Card
    title="Python SDK"
    description="PyPI · Python 3.9+ · full type hints · httpx"
    icon="/icons/python.svg"
    href="/en/sdks/python"
    badge="stable"
  />
</Cards>

## Shared conventions

All Zayono SDKs share the following conventions — learn them once, use them everywhere:

### Authentication

Every request uses an API key in the `zyn_test_...` (sandbox) or `zyn_live_...` (live) format, passed in the `Authorization: Bearer <key>` header. See [Authentication](/en/introduction/authentification).

### Idempotency

All mutating requests (POST / PATCH / DELETE) accept an `Idempotency-Key` header. The SDKs generate one automatically if you don't supply it. See [Idempotency](/en/introduction/format-reponses).

### Retries

Network failures / 5xx / 429 are retried automatically with exponential backoff (3 attempts by default, 250ms → 1s → 4s). Configurable per client.

### Pagination

List endpoints (`/payments`, `/payouts`, `/customers`) return a paginated envelope:

```json
{
  "data": [/* ... */],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 142,
    "last_page": 10
  }
}
```

Every SDK exposes an async iterator that walks through the pages automatically.

### Errors

The SDKs throw a typed exception per error class:

- `AuthenticationException` — invalid or revoked key
- `ValidationException` — invalid fields (`errors` details field by field)
- `RateLimitException` — rate limit exceeded
- `ResourceNotFoundException` — 404
- `ServerException` — 5xx (already retried)
- `NetworkException` — connection failure / timeout

See [Error handling](/en/introduction/erreurs).

### Webhooks

Each SDK exposes a `verifyWebhook(payload, signature, secret)` helper that validates the HMAC-SHA256 signature of the raw body and returns `true`/`false`. See [Signature verification](/en/introduction/webhooks#verification-de-signature).

## Distribution

| Language | Package manager | Repo |
|---|---|---|
| PHP | [`packagist.org/packages/zayono/zayono-php`](https://packagist.org/packages/zayono/zayono-php) | [github.com/RomualdAKM/zayono-php](https://github.com/RomualdAKM/zayono-php) |
| Laravel | `zayono/zayono-laravel` (not yet published) | [github.com/RomualdAKM/sdks-zayono](https://github.com/RomualdAKM/sdks-zayono) |
| Node.js | [`npmjs.com/package/@zayono/sdk`](https://www.npmjs.com/package/@zayono/sdk) | [github.com/RomualdAKM/sdks-zayono](https://github.com/RomualdAKM/sdks-zayono/tree/main/zayono-node) |
| Python | [`pypi.org/project/zayono`](https://pypi.org/project/zayono) | [github.com/RomualdAKM/sdks-zayono](https://github.com/RomualdAKM/sdks-zayono/tree/main/zayono-python) |

## Versioning

Every SDK follows [SemVer](https://semver.org):

- **Major** (1.x → 2.x): breaking changes documented in the [Changelog](https://github.com/RomualdAKM/sdks-zayono/releases)
- **Minor** (1.0 → 1.1) : new backward-compatible features
- **Patch** (1.0.0 → 1.0.1): bugfixes

The Zayono API itself is versioned via the `/api/v1` prefix. A major API version bump (`/v2`) triggers a major SDK bump.

## Roadmap

| SDK | Current version | Upcoming features |
|---|---|---|
| PHP | 1.0.0 | Async via ReactPHP, PSR-14 event support |
| Laravel | upcoming | Artisan commands, auto-dispatched queue jobs |
| Node.js | 1.0.0 | Streaming responses, WebSocket subscriptions |
| Python | 1.0.0 | Async via native `asyncio`, Django middleware |
