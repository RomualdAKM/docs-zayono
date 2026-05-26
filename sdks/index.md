# SDKs officiels

Zayono publie des SDKs maintenus pour les 4 langages les plus utilisés en intégration paiement. Ils encapsulent l'authentification, les retries automatiques, la pagination, la vérification de signature webhook, et exposent une API typée idiomatique au langage hôte.

<Cards>
  <Card
    title="PHP SDK"
    description="Composer · PHP 8.1+ · Guzzle 7 · PSR-18"
    icon="/icons/php.svg"
    href="/sdks/php"
    badge="stable"
  />
  <Card
    title="Laravel SDK"
    description="Wrapper opinionated du SDK PHP : service provider, facade, config publishable."
    icon="/icons/laravel.svg"
    href="/sdks/laravel"
    badge="soon"
  />
  <Card
    title="Node.js / TypeScript SDK"
    description="TypeScript natif · ESM + CJS · Node 18+ · Bun + Deno compatibles"
    icon="/icons/node.svg"
    href="/sdks/node"
    badge="stable"
  />
  <Card
    title="Python SDK"
    description="PyPI · Python 3.9+ · type hints complets · httpx"
    icon="/icons/python.svg"
    href="/sdks/python"
    badge="stable"
  />
</Cards>

## Conventions communes

Tous les SDKs Zayono partagent les conventions suivantes — apprenez-les une fois, utilisez-les partout :

### Authentification

Toutes les requêtes utilisent une clé API au format `zyn_test_...` (sandbox) ou `zyn_live_...` (live), passée en header `Authorization: Bearer <clé>`. Voir [Authentification](/introduction/authentification).

### Idempotency

Toutes les requêtes mutatives (POST / PATCH / DELETE) acceptent un header `Idempotency-Key`. Les SDKs le génèrent automatiquement si vous ne le fournissez pas. Voir [Idempotence](/introduction/format-reponses).

### Retries

Échecs réseau / 5xx / 429 sont retried automatiquement avec backoff exponentiel (3 tentatives par défaut, 250ms → 1s → 4s). Configurable par client.

### Pagination

Les endpoints liste (`/payments`, `/payouts`, `/customers`) retournent une enveloppe paginée :

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

Tous les SDKs exposent un itérateur asynchrone qui traverse les pages automatiquement.

### Erreurs

Les SDKs lèvent une exception typée par classe d'erreur :

- `AuthenticationException` — clé invalide ou révoquée
- `ValidationException` — champs invalides (`errors` détaille champ par champ)
- `RateLimitException` — limite de débit dépassée
- `ResourceNotFoundException` — 404
- `ServerException` — 5xx (déjà retried)
- `NetworkException` — connexion impossible / timeout

Voir [Gestion des erreurs](/introduction/erreurs).

### Webhooks

Chaque SDK expose un helper `verifyWebhook(payload, signature, secret)` qui valide la signature HMAC-SHA256 du body brut et retourne `true`/`false`. Voir [Vérification de signature](/introduction/webhooks#verification-de-signature).

## Distribution

| Langage | Package manager | Repo |
|---|---|---|
| PHP | [`packagist.org/packages/zayono/zayono-php`](https://packagist.org/packages/zayono/zayono-php) | [github.com/zayono/zayono-php](https://github.com/zayono/zayono-php) |
| Laravel | [`packagist.org/packages/zayono/zayono-laravel`](https://packagist.org/packages/zayono/zayono-laravel) | [github.com/zayono/zayono-laravel](https://github.com/zayono/zayono-laravel) |
| Node.js | [`npmjs.com/package/@zayono/sdk`](https://www.npmjs.com/package/@zayono/sdk) | [github.com/zayono/zayono-node](https://github.com/zayono/zayono-node) |
| Python | [`pypi.org/project/zayono`](https://pypi.org/project/zayono) | [github.com/zayono/zayono-python](https://github.com/zayono/zayono-python) |

## Versioning

Tous les SDKs suivent [SemVer](https://semver.org/lang/fr/) :

- **Majeur** (1.x → 2.x) : breaking changes documentés dans le [Changelog](https://github.com/zayono)
- **Mineur** (1.0 → 1.1) : nouvelles features rétro-compatibles
- **Patch** (1.0.0 → 1.0.1) : bugfixes

L'API Zayono elle-même est versionnée via le préfixe `/api/v1`. Une bump de version API majeure (`/v2`) déclenche un major bump des SDKs.

## Roadmap

| SDK | Version actuelle | Prochaines features |
|---|---|---|
| PHP | 1.0.0 | Async via ReactPHP, support PSR-14 events |
| Laravel | 1.0.0 | Artisan commands, queue jobs auto-dispatchés |
| Node.js | 1.0.0 | Streaming responses, WebSocket subscriptions |
| Python | 1.0.0 | Async via `asyncio` natif, Django middleware |
