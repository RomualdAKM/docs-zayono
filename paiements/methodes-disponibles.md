# Méthodes disponibles

Liste des méthodes de paiement supportées par Zayono. Le champ `code` est ce que vous passez dans le paramètre `operator` lors de l'initialisation d'un paiement, ou ce que vous retrouvez dans les webhooks.

::: tip Récupérer la liste en temps réel
L'endpoint `GET /v1/operators` retourne la liste à jour des méthodes activées sur votre compte, en fonction de votre configuration de routage et de l'environnement (sandbox / live). Le catalogue ci-dessous reflète les opérateurs implémentés côté plateforme — l'activation effective dépend des agrégateurs connectés à votre compte.
:::

## Mobile Money

### Afrique de l'Ouest — zone UEMOA (XOF)

| Méthode | Code | Pays |
|---|---|---|
| MTN Mobile Money | `mtn_bj` | BJ |
| Moov Money | `moov_bj` | BJ |
| Celtiis | `celtiis_bj` | BJ |
| MTN Mobile Money CI | `mtn_ci` | CI |
| Orange Money CI | `orange_ci` | CI |
| Moov Money CI | `moov_ci` | CI |
| Orange Money Sénégal | `orange_sn` | SN |
| Free Money Sénégal | `free_sn` | SN |
| Expresso Sénégal | `expresso_sn` | SN |
| Wizall Sénégal | `wizall_sn` | SN |
| E-Money Sénégal | `emoney_sn` | SN |
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

### Afrique centrale — zone CEMAC (XAF)

| Méthode | Code | Pays |
|---|---|---|
| MTN Cameroun | `mtn_cm` | CM |
| Orange Money Cameroun | `orange_cm` | CM |
| MTN Congo | `mtn_cg` | CG |
| Airtel Congo | `airtel_cg` | CG |
| Airtel Money Gabon | `airtel_ga` | GA |

### Afrique de l'Ouest (autres devises)

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| MTN MoMo Guinée | `mtn_gn` | GNF | GN |
| Orange Money Guinée | `orange_gn` | GNF | GN |
| MTN Ghana | `mtn_gh` | GHS | GH |
| AirtelTigo Ghana | `airteltigo_gh` | GHS | GH |
| Telecel Cash Ghana | `vodafone_gh` | GHS | GH |
| MTN MoMo Nigeria | `mtn_ng` | NGN | NG |
| Airtel Money Nigeria | `airtel_ng` | NGN | NG |
| Orange Money Sierra Leone | `orange_sl` | SLE | SL |

### Afrique de l'Est

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| M-Pesa Kenya | `mpesa_ke` | KES | KE |
| MTN Uganda | `mtn_ug` | UGX | UG |
| Airtel Uganda | `airtel_ug` | UGX | UG |
| Vodacom M-Pesa Tanzanie | `vodacom_tz` | TZS | TZ |
| Airtel Money Tanzanie | `airtel_tz` | TZS | TZ |
| Tigo Pesa Tanzanie | `tigo_tz` | TZS | TZ |
| Halotel Tanzanie | `halotel_tz` | TZS | TZ |
| MTN Rwanda | `mtn_rw` | RWF | RW |
| Airtel Rwanda | `airtel_rw` | RWF | RW |
| M-Pesa Éthiopie | `mpesa_et` | ETB | ET |

### Afrique centrale / RDC

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| Vodacom M-Pesa RDC | `vodacom_cd` | CDF | CD |
| Airtel Money RDC | `airtel_cd` | CDF | CD |
| Orange Money RDC | `orange_cd` | CDF | CD |

### Afrique australe

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| MTN Zambie | `mtn_zm` | ZMW | ZM |
| Airtel Zambie | `airtel_zm` | ZMW | ZM |
| Zamtel Zambie | `zamtel_zm` | ZMW | ZM |
| Airtel Money Malawi | `airtel_mw` | MWK | MW |
| TNM Mpamba Malawi | `tnm_mw` | MWK | MW |
| Movitel Mozambique | `movitel_mz` | MZN | MZ |
| Vodacom M-Pesa Mozambique | `vodacom_mz` | MZN | MZ |
| M-Pesa Lesotho | `mpesa_ls` | LSL | LS |

## Wallets

Apps de paiement avec leur propre UX de checkout (page hébergée externe, scan QR, etc.). Distincts des opérateurs Mobile Money classiques.

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| Wave Côte d'Ivoire | `wave_ci` | XOF | CI |
| Wave Sénégal | `wave_sn` | XOF | SN |
| Djamo Côte d'Ivoire | `djamo_ci` | XOF | CI |
| Djamo Sénégal | `djamo_sn` | XOF | SN |

## Cartes bancaires

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| Carte bancaire — Nigeria | `card_ng` | NGN | NG |
| Carte bancaire — Ghana | `card_gh` | GHS | GH |
| Carte bancaire — Kenya | `card_ke` | KES | KE |
| Carte bancaire — Afrique du Sud | `card_za` | ZAR | ZA |
| Carte bancaire — Cameroun | `card_cm` | XAF | CM |
| Carte bancaire — Côte d'Ivoire | `card_ci` | XOF | CI |
| Carte bancaire USD — Nigeria | `card_usd_ng` | USD | NG |
| Carte bancaire USD — Kenya | `card_usd_ke` | USD | KE |
| Carte bancaire internationale | `card` | * | XX |

::: tip Carte internationale
Le code `card` correspond aux paiements par carte hors Afrique (via Stripe). La devise est libre — Stripe accepte toute devise et règle dans la vôtre.
:::

## Virement bancaire

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| Virement bancaire Nigeria | `bank_ng` | NGN | NG |
| Virement bancaire Ghana | `bank_gh` | GHS | GH |
| Débit de compte bancaire — Nigeria | `bank_debit_ng` | NGN | NG |

## USSD / QR (Nigeria)

Méthodes spécifiques au marché nigérian, exposées par Paystack.

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| USSD — Nigeria | `ussd_ng` | NGN | NG |
| QR code — Nigeria | `qr_ng` | NGN | NG |
| EFT bancaire — Afrique du Sud | `eft_za` | ZAR | ZA |

## Crypto

Le client paie en crypto, vous facturez et êtes réglé dans une **devise de référence fiat** (XOF, XAF, NGN, GHS, USD ou EUR). Le client choisit la crypto sur la page hébergée.

| Méthode | Code | Devise de référence | Pays |
|---|---|---|---|
| Crypto — référence XAF (BEAC) | `crypto_xaf` | XAF | CM |
| Crypto — référence XOF (UEMOA) | `crypto_xof` | XOF | CI |
| Crypto — référence NGN | `crypto_ngn` | NGN | NG |
| Crypto — référence GHS | `crypto_ghs` | GHS | GH |
| Crypto — référence USD | `crypto_usd` | USD | International |
| Crypto — référence EUR | `crypto_eur` | EUR | International |
| Crypto multi-actifs (Cryptomus) | `crypto_global` | * | International |

::: tip `crypto_global` vs `crypto_*`
- `crypto_*` (avec devise) → routage via Coinbase Commerce ou NOWPayments, prix affiché dans la devise locale, conversion live en crypto sur la page de paiement. NOWPayments couvre 300+ cryptos (BTC, ETH, USDT toutes chaînes, SOL, TON…) sur `crypto_usd`, `crypto_eur` et `crypto_ngn`.
- `crypto_global` → routage via Cryptomus, le marchand transmet directement la crypto et le montant attendus.
:::

## Évolution du catalogue

De nouvelles méthodes sont ajoutées régulièrement. Pour rester à jour :

- Consultez l'endpoint `GET /v1/operators` qui reflète l'état réel de votre compte
- Suivez les annonces sur [status.zayono.com](https://status.zayono.com)
- Configurez vos routes dans le tableau de bord pour activer / désactiver les méthodes par environnement
