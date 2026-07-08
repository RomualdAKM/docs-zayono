# Available methods

List of payment methods supported by Zayono. The `code` field is what you pass in the `operator` parameter when initializing a payment, or what you find in webhook payloads.

::: tip Fetch the live list
The `GET /v1/operators` endpoint returns the up-to-date list of methods enabled on your account, based on your routing configuration and the current environment (sandbox / live). The catalogue below reflects the operators implemented platform-side — actual availability depends on the aggregators connected to your account.
:::

## Mobile Money

### West Africa — UEMOA zone (XOF)

| Method | Code | Country |
|---|---|---|
| MTN Mobile Money | `mtn_bj` | BJ |
| Moov Money | `moov_bj` | BJ |
| Celtiis | `celtiis_bj` | BJ |
| MTN Mobile Money CI | `mtn_ci` | CI |
| Orange Money CI | `orange_ci` | CI |
| Moov Money CI | `moov_ci` | CI |
| Orange Money Senegal | `orange_sn` | SN |
| Free Money Senegal | `free_sn` | SN |
| Expresso Senegal | `expresso_sn` | SN |
| Wizall Senegal | `wizall_sn` | SN |
| E-Money Senegal | `emoney_sn` | SN |
| MTN Togo | `mtn_tg` | TG |
| Moov Togo | `moov_tg` | TG |
| T-Money / Mixx by Yas Togo | `tmoney_tg` | TG |
| Airtel Money Niger | `airtel_ne` | NE |
| MTN Niger | `mtn_ne` | NE |
| Moov Niger | `moov_ne` | NE |
| ZamaniCash Niger | `zamani_ne` | NE |
| Orange Money Mali | `orange_ml` | ML |
| Moov Mali | `moov_ml` | ML |
| Mobicash Mali | `mobicash_ml` | ML |
| Orange Money Burkina | `orange_bf` | BF |
| Moov Burkina | `moov_bf` | BF |
| MTN Burkina | `mtn_bf` | BF |
| Onatel / Telmob Burkina | `onatel_bf` | BF |

### Central Africa — CEMAC zone (XAF)

| Method | Code | Country |
|---|---|---|
| MTN Cameroon | `mtn_cm` | CM |
| Orange Money Cameroon | `orange_cm` | CM |
| MTN Congo | `mtn_cg` | CG |
| Airtel Congo | `airtel_cg` | CG |
| Airtel Money Gabon | `airtel_ga` | GA |

### West Africa (other currencies)

| Method | Code | Currency | Country |
|---|---|---|---|
| MTN MoMo Guinea | `mtn_gn` | GNF | GN |
| Orange Money Guinea | `orange_gn` | GNF | GN |
| MTN Ghana | `mtn_gh` | GHS | GH |
| AirtelTigo Ghana | `airteltigo_gh` | GHS | GH |
| Telecel Cash Ghana | `vodafone_gh` | GHS | GH |
| MTN MoMo Nigeria | `mtn_ng` | NGN | NG |
| Airtel Money Nigeria | `airtel_ng` | NGN | NG |
| Orange Money Sierra Leone | `orange_sl` | SLE | SL |

### East Africa

| Method | Code | Currency | Country |
|---|---|---|---|
| M-Pesa Kenya | `mpesa_ke` | KES | KE |
| MTN Uganda | `mtn_ug` | UGX | UG |
| Airtel Uganda | `airtel_ug` | UGX | UG |
| Vodacom M-Pesa Tanzania | `vodacom_tz` | TZS | TZ |
| Airtel Money Tanzania | `airtel_tz` | TZS | TZ |
| Tigo Pesa Tanzania | `tigo_tz` | TZS | TZ |
| Halotel Tanzania | `halotel_tz` | TZS | TZ |
| MTN Rwanda | `mtn_rw` | RWF | RW |
| Airtel Rwanda | `airtel_rw` | RWF | RW |
| M-Pesa Ethiopia | `mpesa_et` | ETB | ET |

### Central Africa / DRC

| Method | Code | Currency | Country |
|---|---|---|---|
| Vodacom M-Pesa DRC | `vodacom_cd` | CDF | CD |
| Airtel Money DRC | `airtel_cd` | CDF | CD |
| Orange Money DRC | `orange_cd` | CDF | CD |

### Southern Africa

| Method | Code | Currency | Country |
|---|---|---|---|
| MTN Zambia | `mtn_zm` | ZMW | ZM |
| Airtel Zambia | `airtel_zm` | ZMW | ZM |
| Zamtel Zambia | `zamtel_zm` | ZMW | ZM |
| Airtel Money Malawi | `airtel_mw` | MWK | MW |
| TNM Mpamba Malawi | `tnm_mw` | MWK | MW |
| Movitel Mozambique | `movitel_mz` | MZN | MZ |
| Vodacom M-Pesa Mozambique | `vodacom_mz` | MZN | MZ |
| M-Pesa Lesotho | `mpesa_ls` | LSL | LS |

## Wallets

Payment apps with their own checkout UX (external hosted page, QR scan, etc.). Distinct from traditional Mobile Money operators.

| Method | Code | Currency | Country |
|---|---|---|---|
| Wave Côte d'Ivoire | `wave_ci` | XOF | CI |
| Wave Senegal | `wave_sn` | XOF | SN |
| Djamo Côte d'Ivoire | `djamo_ci` | XOF | CI |
| Djamo Senegal | `djamo_sn` | XOF | SN |

## Cards

| Method | Code | Currency | Country |
|---|---|---|---|
| Card — Nigeria | `card_ng` | NGN | NG |
| Card — Ghana | `card_gh` | GHS | GH |
| Card — Kenya | `card_ke` | KES | KE |
| Card — South Africa | `card_za` | ZAR | ZA |
| Card — Cameroon | `card_cm` | XAF | CM |
| Card — Côte d'Ivoire | `card_ci` | XOF | CI |
| USD Card — Nigeria | `card_usd_ng` | USD | NG |
| USD Card — Kenya | `card_usd_ke` | USD | KE |
| International card | `card` | * | XX |

::: tip International card
The `card` code is for non-African card payments (via Stripe). Currency is open — Stripe accepts any currency and settles in yours.
:::

## Bank transfer

| Method | Code | Currency | Country |
|---|---|---|---|
| Bank Transfer Nigeria | `bank_ng` | NGN | NG |
| Bank Transfer Ghana | `bank_gh` | GHS | GH |
| Bank Account Debit — Nigeria | `bank_debit_ng` | NGN | NG |

## USSD / QR (Nigeria)

Nigeria-specific methods exposed via Paystack.

| Method | Code | Currency | Country |
|---|---|---|---|
| USSD — Nigeria | `ussd_ng` | NGN | NG |
| QR — Nigeria | `qr_ng` | NGN | NG |
| EFT — South Africa | `eft_za` | ZAR | ZA |

## Crypto

The customer pays in crypto, you price and settle in a **fiat reference currency** (XOF, XAF, NGN, GHS, USD or EUR). The customer picks the crypto on the hosted page.

| Method | Code | Reference currency | Country |
|---|---|---|---|
| Crypto — XAF reference (BEAC) | `crypto_xaf` | XAF | CM |
| Crypto — XOF reference (UEMOA) | `crypto_xof` | XOF | CI |
| Crypto — NGN reference | `crypto_ngn` | NGN | NG |
| Crypto — GHS reference | `crypto_ghs` | GHS | GH |
| Crypto — USD reference | `crypto_usd` | USD | International |
| Crypto — EUR reference | `crypto_eur` | EUR | International |
| Multi-asset crypto (Cryptomus) | `crypto_global` | * | International |

::: tip `crypto_global` vs `crypto_*`
- `crypto_*` (with a currency) → routed via Coinbase Commerce or NOWPayments, priced in the local currency, live-converted to crypto on the payment page. NOWPayments covers 300+ cryptos (BTC, ETH, USDT on all chains, SOL, TON…) on `crypto_usd`, `crypto_eur` and `crypto_ngn`.
- `crypto_global` → routed via Cryptomus, the merchant passes the target crypto and amount directly.
:::

## Catalogue evolution

New methods are added regularly. To stay up to date:

- Use the `GET /v1/operators` endpoint, which reflects the actual state of your account
- Follow announcements on [status.zayono.com](https://status.zayono.com)
- Configure your routing in the dashboard to enable / disable methods per environment
