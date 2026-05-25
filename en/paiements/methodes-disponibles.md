# Available methods

List of payment methods supported by Zayono. The `code` field is what you pass in the `operator` parameter when initializing a payment, or what you find in webhooks.

::: tip Fetch the live list
The `GET /v1/operators` endpoint returns the up-to-date list of methods enabled on your account, based on your routing configuration and the current environment (sandbox / live).
:::

## Mobile Money

| Method | Code | Currency | Country |
|---|---|---|---|
| MTN Mobile Money Benin | `mtn_bj` | XOF | BJ |
| Moov Money Benin | `moov_bj` | XOF | BJ |
| Celtiis Cash Benin | `celtiis_bj` | XOF | BJ |
| Orange Money Côte d'Ivoire | `orange_ci` | XOF | CI |
| MTN Mobile Money Côte d'Ivoire | `mtn_ci` | XOF | CI |
| Moov Money Côte d'Ivoire | `moov_ci` | XOF | CI |
| Wave Côte d'Ivoire | `wave_ci` | XOF | CI |
| Orange Money Senegal | `orange_sn` | XOF | SN |
| Free Money Senegal | `free_sn` | XOF | SN |
| Wave Senegal | `wave_sn` | XOF | SN |
| Expresso Senegal | `expresso_sn` | XOF | SN |
| Orange Money Mali | `orange_ml` | XOF | ML |
| Moov Money Mali | `moov_ml` | XOF | ML |
| Orange Money Burkina Faso | `orange_bf` | XOF | BF |
| Moov Money Burkina Faso | `moov_bf` | XOF | BF |
| Orange Money Niger | `orange_ne` | XOF | NE |
| Moov Money Togo | `moov_tg` | XOF | TG |
| T-Money Togo | `tmoney_tg` | XOF | TG |
| Yas Togo | `yas_tg` | XOF | TG |
| MTN Mobile Money Cameroon | `mtn_cm` | XAF | CM |
| Orange Money Cameroon | `orange_cm` | XAF | CM |
| Airtel Money Gabon | `airtel_ga` | XAF | GA |
| Moov Money Gabon | `moov_ga` | XAF | GA |
| MTN Mobile Money Congo | `mtn_cg` | XAF | CG |
| Airtel Money Congo | `airtel_cg` | XAF | CG |
| Orange Money DRC | `orange_cd` | CDF | CD |
| Airtel Money DRC | `airtel_cd` | CDF | CD |
| Vodacom M-Pesa DRC | `mpesa_cd` | CDF | CD |
| MTN Mobile Money Guinea | `mtn_gn` | GNF | GN |
| Orange Money Guinea | `orange_gn` | GNF | GN |
| MTN Mobile Money Ghana | `mtn_gh` | GHS | GH |
| AirtelTigo Ghana | `airteltigo_gh` | GHS | GH |
| Vodafone Cash Ghana | `vodafone_gh` | GHS | GH |
| Safaricom M-Pesa Kenya | `mpesa_ke` | KES | KE |
| Airtel Money Kenya | `airtel_ke` | KES | KE |
| MTN Mobile Money Uganda | `mtn_ug` | UGX | UG |
| Airtel Money Uganda | `airtel_ug` | UGX | UG |
| Vodacom M-Pesa Tanzania | `mpesa_tz` | TZS | TZ |
| Tigo Pesa Tanzania | `tigo_tz` | TZS | TZ |
| Airtel Money Tanzania | `airtel_tz` | TZS | TZ |
| MTN Mobile Money Rwanda | `mtn_rw` | RWF | RW |
| Airtel Money Rwanda | `airtel_rw` | RWF | RW |
| MTN Mobile Money Zambia | `mtn_zm` | ZMW | ZM |
| Airtel Money Zambia | `airtel_zm` | ZMW | ZM |

## Cards

| Method | Code | Currencies | Coverage |
|---|---|---|---|
| Visa / Mastercard XOF | `card_xof` | XOF | UEMOA zone |
| Visa / Mastercard XAF | `card_xaf` | XAF | CEMAC zone |
| Visa / Mastercard NGN | `card_ngn` | NGN | Nigeria |
| Visa / Mastercard GHS | `card_ghs` | GHS | Ghana |
| Visa / Mastercard KES | `card_kes` | KES | Kenya |
| Visa / Mastercard ZAR | `card_zar` | ZAR | South Africa |
| Visa / Mastercard USD | `card_usd` | USD | International |
| Visa / Mastercard EUR | `card_eur` | EUR | International |

## Bank transfer

| Method | Code | Currency | Coverage |
|---|---|---|---|
| Bank Transfer Nigeria | `bank_transfer_ng` | NGN | NG |
| Bank Transfer Ghana | `bank_transfer_gh` | GHS | GH |
| Bank Transfer Kenya | `bank_transfer_ke` | KES | KE |
| Bank Transfer South Africa | `bank_transfer_za` | ZAR | ZA |

## Crypto

| Method | Code | Settlement currencies | Pricing currencies |
|---|---|---|---|
| Crypto (BTC, ETH, USDC, USDT…) | `crypto` | BTC, ETH, USDC, USDT, DAI | USD, EUR, GBP, XOF, XAF, NGN, ZAR |

Crypto payments let you **price in fiat currency** (your local currency) while the customer pays in the crypto of their choice. Settlement happens in crypto on your wallet, or in fiat on your Zayono account depending on your configuration.

## Catalogue evolution

New methods are added regularly. To stay up to date:

- Use the `GET /v1/operators` endpoint, which reflects the actual state of your account
- Follow announcements on [status.zayono.com](https://status.zayono.com)
- Configure your routing in the dashboard to enable / disable methods per environment
