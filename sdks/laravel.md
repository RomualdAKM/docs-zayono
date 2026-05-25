# Laravel SDK <span class="zd-tag soon">Bientôt</span>

Le wrapper Laravel officiel (`zayono/zayono-laravel`) — avec service provider, facade, config publishable, middleware webhook et events Laravel — **n'est pas encore publié**. Sa sortie est planifiée mais aucun package Composer correspondant n'existe à ce jour.

::: tip Comment intégrer Zayono dans Laravel aujourd'hui ?
Utilisez le [SDK PHP](/sdks/php) directement. Il marche parfaitement avec Laravel — vous perdez seulement le sucre syntaxique (facade, auto-discovery, queue jobs pré-câblés).
:::

## Workaround : SDK PHP dans Laravel

Installez le SDK PHP :

```bash
composer require zayono/zayono-php
```

Ajoutez votre clé API au `.env` :

```dotenv
ZAYONO_API_KEY=zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZAYONO_WEBHOOK_SECRET=
```

Bindez le client comme singleton dans `AppServiceProvider` :

```php
use Zayono\Zayono;

public function register(): void
{
    $this->app->singleton(Zayono::class, fn () => new Zayono(
        apiKey: config('services.zayono.api_key'),
    ));
}
```

Et dans `config/services.php` :

```php
'zayono' => [
    'api_key' => env('ZAYONO_API_KEY'),
    'webhook_secret' => env('ZAYONO_WEBHOOK_SECRET'),
],
```

Vous pouvez ensuite injecter `Zayono` dans vos controllers :

```php
use Zayono\Zayono;

class OrderController extends Controller
{
    public function pay(Zayono $zayono, Request $request)
    {
        $payment = $zayono->payments->create([
            'amount' => 5000,
            'currency' => 'XOF',
            'description' => 'T-shirt premium',
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

## Webhooks : vérification manuelle dans Laravel

Sans middleware dédié, vérifiez la signature à la main :

```php
use Illuminate\Http\Request;
use Zayono\Zayono;

Route::post('/webhook/zayono', function (Request $request, Zayono $zayono) {
    $payload = $request->getContent(); // body raw
    $signature = $request->header('x-zayono-signature', '');

    if (!$zayono->webhooks->verify($payload, $signature, config('services.zayono.webhook_secret'))) {
        return response('Invalid signature', 401);
    }

    $event = json_decode($payload, true);

    match ($event['event']) {
        'payment.successful' => /* Confirmer la commande */ null,
        'payment.failed' => /* Logger l'échec */ null,
        default => null,
    };

    return response()->noContent();
});
```

::: warning Body raw obligatoire
La signature HMAC est calculée sur le payload brut byte-à-byte. Utilisez `$request->getContent()` et **non** `$request->all()` ou `$request->json()`.
:::

## Roadmap

Le SDK Laravel (`zayono/zayono-laravel`) apportera :

- Service provider + auto-discovery
- Facade `Zayono::payments()->create(...)`
- Config publishable (`config/zayono.php`)
- Middleware `zayono.webhook` qui vérifie automatiquement la signature
- Events Laravel auto-dispatchés (`PaymentSuccessful`, `PaymentFailed`, etc.)
- Queue jobs pré-câblés avec retry intelligent
- Artisan commands (`zayono:ping`, `zayono:aggregators`, `zayono:test-payment`)
- Modèles Eloquent optionnels (`ZayonoPayment`, `ZayonoPayout`)

Suivez la sortie sur le [Changelog](/ressources/changelog) ou via les annonces sur le [dashboard](https://app.zayono.com).
