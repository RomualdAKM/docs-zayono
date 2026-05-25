# WooCommerce plugin <span class="zd-tag stable">Stable</span>

The official Zayono WooCommerce plugin lets you accept Mobile Money + cards through the native WooCommerce checkout, with no coding.

- **WordPress.org**: [`wordpress.org/plugins/zayono`](https://wordpress.org/plugins/zayono/)
- **Source**: [github.com/zayono/zayono-woocommerce](https://github.com/zayono/zayono-woocommerce)
- **License**: GPL-2.0
- **WordPress**: 5.8+
- **WooCommerce**: 6.0+
- **PHP**: 8.1+

## Installation

### From the WordPress admin

1. **Plugins → Add** → search for "Zayono"
2. Click "Install now" → "Activate"

### Manually

```bash
# Download the latest release
wget https://github.com/zayono/zayono-woocommerce/releases/latest/download/zayono-woocommerce.zip

# Unzip into the plugins folder
unzip zayono-woocommerce.zip -d wp-content/plugins/
```

Then activate from **Plugins → Installed Plugins**.

## Configuration

1. **WooCommerce → Settings → Payments** → enable "Zayono"
2. Click "Configure"
3. Fill in:
   - **Sandbox API key** (`zyn_test_...`) — copied from [app.zayono.com → Developers → API keys](https://app.zayono.com/developers/api-keys)
   - **Live API key** (`zyn_live_...`) — when you move to production
   - **Webhook secret** — copied from [app.zayono.com → Developers → Webhooks](https://app.zayono.com/developers/webhooks) after creating an endpoint
   - **Mode**: Sandbox (test) or Live (production)
4. Save.

## Webhook configuration

On [app.zayono.com → Developers → Webhooks](https://app.zayono.com/developers/webhooks):

1. Click "Add a webhook"
2. **URL**:
   ```
   https://your-store.com/?wc-api=zayono_webhook
   ```
3. **Events**: tick at least `payment.successful` and `payment.failed`
4. Click "Create", copy the **secret** (shown once) and paste it into the WooCommerce config.

## Customer flow

1. The customer adds products to the basket and goes to the WooCommerce checkout
2. They pick "Zayono" as the payment method
3. Click "Order" → redirect to the Zayono hosted page
4. The customer picks their operator (MTN, Orange, Moov, etc.), enters their number, confirms
5. On success → redirect to the WooCommerce confirmation page + the order moves to `processing`
6. On failure → redirect to the WooCommerce basket with the error message

The final status is updated automatically via webhook — you have **nothing to do**.

## Supported currencies

The plugin detects the WooCommerce currency and forwards it to Zayono. Supported currencies:

- **XOF** (Benin, Togo, Senegal, Mali, Côte d'Ivoire, Burkina Faso, Niger, Guinea-Bissau)
- **XAF** (Cameroon, Chad, Congo, Gabon, CAR, Equatorial Guinea)
- **GHS** (Ghana)
- **KES** (Kenya)
- **NGN** (Nigeria)
- **ZAR** (South Africa)
- **USD**, **EUR** (international cards via Stripe / Coinbase)

If the WooCommerce currency matches no available operator, Zayono will show "No payment method available" — enable a compatible gateway from your dashboard.

## Sandbox testing

1. Configure the plugin in "Sandbox" mode
2. Create a test order (amount ≥ 200 XOF — PayDunya sandbox minimum)
3. At checkout, use:
   - **MTN BJ Sandbox**: `+22961000000`
   - **Orange CI Sandbox**: `+22507000000`
   - Other test numbers: see [Test numbers](/en/paiements/testing)

Sandbox transactions are visible on [app.zayono.com → Transactions](https://app.zayono.com/payments/transactions) in sandbox mode.

## Customisation

### Payment method title

```php
add_filter('zayono_payment_method_title', function ($title) {
    return 'Pay with Mobile Money';
});
```

### Description under the title

```php
add_filter('zayono_payment_method_description', function ($desc) {
    return 'MTN, Orange, Moov, Wave, M-Pesa and more.';
});
```

### Restrict by country

```php
add_filter('zayono_supported_countries', function () {
    return ['BJ', 'CI', 'SN', 'TG']; // UEMOA only
});
```

## Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| "Zayono" doesn't show at checkout | WooCommerce currency not supported | Check the currency (XOF by default) |
| Webhook never received | Wrong webhook URL | URL must be exactly `?wc-api=zayono_webhook` |
| Invalid signature in logs | Webhook secret out of sync | Regenerate the secret on the Zayono dashboard + paste again in WC |
| Payment stays "Pending" | Webhook blocked by firewall | Whitelist `backend.zayono.com` (IP shown on the dashboard) |
| 500 at checkout | Cache plugin too aggressive | Disable cache on `/?wc-api=*` |

PHP logs: `wp-content/plugins/zayono-woocommerce/debug.log` (if `WP_DEBUG_LOG=true`).

Zayono API logs: [app.zayono.com → Developers → API logs](https://app.zayono.com/developers/logs).

## Support

- Bug or request: [GitHub Issues](https://github.com/zayono/zayono-woocommerce/issues)
- Sales contact: support@zayono.com
