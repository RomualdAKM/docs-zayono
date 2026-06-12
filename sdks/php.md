# PHP SDK <span class="zd-tag stable">Stable</span>

SDK PHP officiel pour intégrer Zayono dans n'importe quelle application PHP moderne. Encapsule l'authentification, les retries, la pagination et la vérification de signature webhook.

- **Package** : [`zayono/zayono-php`](https://packagist.org/packages/zayono/zayono-php) sur Packagist
- **Source** : [github.com/RomualdAKM/zayono-php](https://github.com/RomualdAKM/zayono-php)
- **License** : MIT
- **PHP** : 8.1+
- **HTTP** : Guzzle 7 (PSR-18, swappable)

## Installation

```bash
composer require zayono/zayono-php
```

## Configuration

```php
use Zayono\Zayono;

$zayono = new Zayono('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
```

Pour customiser le client HTTP, la base URL, ou les retries :

```php
$zayono = new Zayono(
    apiKey: 'zyn_test_xxxxx',
    baseUrl: 'https://backend.zayono.com/api/v1', // défaut
    timeout: 30, // secondes, défaut: 30
    maxRetries: 3, // défaut: 3
);
```

## Initialiser un paiement

```php
$payment = $zayono->payments->create([
    'amount' => 5000,
    'currency' => 'XOF',
    'description' => 'T-shirt premium',
    'return_url' => 'https://votre-site.com/success',
    'customer' => [
        'email' => 'customer@example.com',
        'first_name' => 'Jean',
        'last_name' => 'Dupont',
        'phone' => '+22990123456',
    ],
    'operator' => 'mtn_bj',
    'metadata' => [
        'order_id' => 'ORD-12345',
    ],
]);

echo $payment['checkout_url'];
// → https://app.zayono.com/checkout/abc123...
```

## Vérifier un paiement

```php
$payment = $zayono->payments->retrieve('019e5eaf-cb99-7351-a6d5-c219e28534db');

if ($payment['status'] === 'success') {
    // Le paiement est confirmé. Livrez la commande.
}
```

## Initialiser un transfert

```php
$payout = $zayono->payouts->create([
    'amount' => 10000,
    'currency' => 'XOF',
    'operator' => 'mtn_bj',
    'description' => 'Versement commande ORD-12345',
    'recipient' => [
        'phone' => '+22961000000',
        'first_name' => 'Adèle',
        'last_name' => 'Akpovi',
    ],
]);
```

::: warning Remboursements
Les remboursements seront ajoutés au SDK quand l'endpoint `/v1/payments/{id}/refunds` sera exposé sur la surface API key. Pour l'instant, utilisez le dashboard.
:::

## Vérifier une signature webhook

Dans votre endpoint webhook (`POST /webhook` par exemple) :

```php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_ZAYONO_SIGNATURE'] ?? '';

if (!$zayono->webhooks->verify($payload, $signature, 'votre_secret_webhook')) {
    http_response_code(401);
    exit('Invalid signature');
}

$event = json_decode($payload, true);

match ($event['event']) {
    'payment.successful' => handlePaymentSuccess($event['data']),
    'payment.failed' => handlePaymentFailure($event['data']),
    default => null,
};
```

## Pagination

::: warning Listing paiements / payouts non exposé sur v1
L'endpoint `GET /v1/payments` (et `GET /v1/payouts`) n'est pas encore exposé sur la surface API key. Seules les méthodes unitaires (`retrieve`, `verify`) sont disponibles. La pagination sera ajoutée au SDK quand ces endpoints seront exposés. En attendant, consultez l'historique depuis le [dashboard Zayono](https://app.zayono.com).
:::

Pour les **clients**, l'endpoint `GET /v1/customers` est exposé et le SDK pagine automatiquement :

```php
foreach ($zayono->customers->list(['country' => 'BJ']) as $customer) {
    echo $customer['id'] . PHP_EOL;
}
```

## Gestion des erreurs

```php
use Zayono\Exceptions\{ValidationException, AuthenticationException, RateLimitException};

try {
    $payment = $zayono->payments->create([/* ... */]);
} catch (ValidationException $e) {
    // 422 — champs invalides
    foreach ($e->errors as $field => $messages) {
        echo "$field: " . implode(', ', $messages) . PHP_EOL;
    }
} catch (AuthenticationException $e) {
    // 401 — clé révoquée ou invalide
} catch (RateLimitException $e) {
    // 429 — limite dépassée. $e->retryAfter contient le délai conseillé.
}
```

## Logging + observabilité

Le SDK supporte un logger PSR-3 :

```php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('zayono');
$log->pushHandler(new StreamHandler('zayono.log'));

$zayono = new Zayono('zyn_test_xxxxx', logger: $log);
```

Toutes les requêtes / réponses / retries sont loggés au niveau `info`. Les erreurs en `warning`.

## Référence complète

- [Zayono](https://github.com/RomualdAKM/zayono-php/blob/main/docs/Zayono.md) — client principal
- [PaymentsResource](https://github.com/RomualdAKM/zayono-php/blob/main/docs/PaymentsResource.md)
- [PayoutsResource](https://github.com/RomualdAKM/zayono-php/blob/main/docs/PayoutsResource.md)
- [CustomersResource](https://github.com/RomualdAKM/zayono-php/blob/main/docs/CustomersResource.md)
- [WebhooksHelper](https://github.com/RomualdAKM/zayono-php/blob/main/docs/WebhooksHelper.md)
- [Exceptions](https://github.com/RomualdAKM/zayono-php/blob/main/docs/Exceptions.md)
