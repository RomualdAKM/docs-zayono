# PHP SDK <span class="zd-tag stable">Stable</span>

Official PHP SDK to integrate Zayono in any modern PHP application. Wraps authentication, retries, pagination and webhook signature verification.

- **Package**: [`zayono/zayono-php`](https://packagist.org/packages/zayono/zayono-php) on Packagist
- **Source**: [github.com/zayono/zayono-php](https://github.com/zayono/zayono-php)
- **License**: MIT
- **PHP**: 8.1+
- **HTTP**: Guzzle 7 (PSR-18, swappable)

## Installation

```bash
composer require zayono/zayono-php
```

## Configuration

```php
use Zayono\Zayono;

$zayono = new Zayono('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
```

To customise the HTTP client, base URL or retries:

```php
$zayono = new Zayono(
    apiKey: 'zyn_test_xxxxx',
    baseUrl: 'https://backend.zayono.com/api/v1', // default
    timeout: 30, // seconds, default: 30
    maxRetries: 3, // default: 3
);
```

## Initialize a payment

```php
$payment = $zayono->payments->create([
    'amount' => 5000,
    'currency' => 'XOF',
    'description' => 'Premium T-shirt',
    'return_url' => 'https://your-site.com/success',
    'customer' => [
        'email' => 'customer@example.com',
        'first_name' => 'John',
        'last_name' => 'Doe',
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

## Verify a payment

```php
$payment = $zayono->payments->retrieve('019e5eaf-cb99-7351-a6d5-c219e28534db');

if ($payment['status'] === 'success') {
    // Payment confirmed. Fulfil the order.
}
```

## Initialize a payout

```php
$payout = $zayono->payouts->create([
    'amount' => 10000,
    'currency' => 'XOF',
    'operator' => 'mtn_bj',
    'description' => 'Payout for order ORD-12345',
    'recipient' => [
        'phone' => '+22961000000',
        'first_name' => 'Adele',
        'last_name' => 'Akpovi',
    ],
]);
```

::: warning Refunds
Refunds will be added to the SDK once the `/v1/payments/{id}/refunds` endpoint is exposed on the API key surface. For now, use the dashboard.
:::

## Verify a webhook signature

In your webhook endpoint (e.g. `POST /webhook`):

```php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_ZAYONO_SIGNATURE'] ?? '';

if (!$zayono->webhooks->verify($payload, $signature, 'your_webhook_secret')) {
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

::: warning Payment / payout listing not exposed on v1
The `GET /v1/payments` (and `GET /v1/payouts`) endpoint is not yet exposed on the API key surface. Only unit methods (`retrieve`, `verify`) are available. Pagination will be added to the SDK once those endpoints are exposed. In the meantime, check transaction history from the [Zayono dashboard](https://app.zayono.com).
:::

For **customers**, `GET /v1/customers` is exposed and the SDK paginates automatically:

```php
foreach ($zayono->customers->list(['country' => 'BJ']) as $customer) {
    echo $customer['id'] . PHP_EOL;
}
```

## Error handling

```php
use Zayono\Exceptions\{ValidationException, AuthenticationException, RateLimitException};

try {
    $payment = $zayono->payments->create([/* ... */]);
} catch (ValidationException $e) {
    // 422 — invalid fields
    foreach ($e->errors as $field => $messages) {
        echo "$field: " . implode(', ', $messages) . PHP_EOL;
    }
} catch (AuthenticationException $e) {
    // 401 — revoked or invalid key
} catch (RateLimitException $e) {
    // 429 — limit exceeded. $e->retryAfter holds the advised delay.
}
```

## Logging + observability

The SDK supports a PSR-3 logger:

```php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('zayono');
$log->pushHandler(new StreamHandler('zayono.log'));

$zayono = new Zayono('zyn_test_xxxxx', logger: $log);
```

All requests / responses / retries are logged at `info` level. Errors at `warning`.

## Full reference

- [Zayono](https://github.com/zayono/zayono-php/blob/main/docs/Zayono.md) — main client
- [PaymentsService](https://github.com/zayono/zayono-php/blob/main/docs/PaymentsService.md)
- [PayoutsService](https://github.com/zayono/zayono-php/blob/main/docs/PayoutsService.md)
- [CustomersService](https://github.com/zayono/zayono-php/blob/main/docs/CustomersService.md)
- [WebhooksHelper](https://github.com/zayono/zayono-php/blob/main/docs/WebhooksHelper.md)
- [Exceptions](https://github.com/zayono/zayono-php/blob/main/docs/Exceptions.md)
