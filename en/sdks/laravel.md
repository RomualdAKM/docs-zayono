# Laravel SDK <span class="zd-tag soon">Coming soon</span>

The official Laravel wrapper (`zayono/zayono-laravel`) — with service provider, facade, publishable config, webhook middleware and Laravel events — **is not yet published**. Its release is planned but no corresponding Composer package exists today.

::: tip How do I integrate Zayono in Laravel today?
Use the [PHP SDK](/en/sdks/php) directly. It works perfectly with Laravel — you only lose the syntactic sugar (facade, auto-discovery, pre-wired queue jobs).
:::

## Workaround: PHP SDK inside Laravel

Install the PHP SDK:

```bash
composer require zayono/zayono-php
```

Add your API key to `.env`:

```dotenv
ZAYONO_API_KEY=zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZAYONO_WEBHOOK_SECRET=
```

Bind the client as a singleton in `AppServiceProvider`:

```php
use Zayono\Zayono;

public function register(): void
{
    $this->app->singleton(Zayono::class, fn () => new Zayono(
        apiKey: config('services.zayono.api_key'),
    ));
}
```

And in `config/services.php`:

```php
'zayono' => [
    'api_key' => env('ZAYONO_API_KEY'),
    'webhook_secret' => env('ZAYONO_WEBHOOK_SECRET'),
],
```

You can then inject `Zayono` in your controllers:

```php
use Zayono\Zayono;

class OrderController extends Controller
{
    public function pay(Zayono $zayono, Request $request)
    {
        $payment = $zayono->payments->create([
            'amount' => 5000,
            'currency' => 'XOF',
            'description' => 'Premium T-shirt',
            'return_url' => route('orders.success'),
            'customer' => [
                'email' => $request->user()->email,
                'first_name' => $request->user()->first_name,
                'last_name' => $request->user()->last_name,
                'phone' => $request->user()->phone,
            ],
            'operator' => 'mtn_bj',
        ]);

        return redirect($payment->checkout_url);
    }
}
```

## Webhooks: manual verification in Laravel

Without a dedicated middleware, verify the signature manually:

```php
use Illuminate\Http\Request;
use Zayono\Zayono;

Route::post('/webhook/zayono', function (Request $request, Zayono $zayono) {
    $payload = $request->getContent(); // raw body
    $signature = $request->header('x-zayono-signature', '');

    if (!$zayono->webhooks->verify($payload, $signature, config('services.zayono.webhook_secret'))) {
        return response('Invalid signature', 401);
    }

    $event = json_decode($payload, true);

    match ($event['event']) {
        'payment.successful' => /* Fulfil the order */ null,
        'payment.failed' => /* Log the failure */ null,
        default => null,
    };

    return response()->noContent();
});
```

::: warning Raw body required
The HMAC signature is computed on the byte-for-byte raw payload. Use `$request->getContent()` and **not** `$request->all()` or `$request->json()`.
:::

## Roadmap

The Laravel SDK (`zayono/zayono-laravel`) will ship:

- Service provider + auto-discovery
- Facade `Zayono::payments()->create(...)`
- Publishable config (`config/zayono.php`)
- `zayono.webhook` middleware that auto-verifies signature
- Auto-dispatched Laravel events (`PaymentSuccessful`, `PaymentFailed`, etc.)
- Pre-wired queue jobs with smart retry
- Artisan commands (`zayono:ping`, `zayono:aggregators`, `zayono:test-payment`)
- Optional Eloquent models (`ZayonoPayment`, `ZayonoPayout`)

Follow the release on the [Changelog](https://github.com/zayono) or via dashboard announcements at [app.zayono.com](https://app.zayono.com).
