# Méthodes disponibles

Liste des méthodes de paiement supportées par Zayono. Le champ `code` est ce que vous passez dans le paramètre `operator` lors de l'initialisation d'un paiement, ou ce que vous retrouvez dans les webhooks.

::: tip Récupérer la liste en temps réel
L'endpoint `GET /v1/operators` retourne la liste à jour des méthodes activées sur votre compte, en fonction de votre configuration de routage et de l'environnement (sandbox / live).
:::

## Mobile Money

| Méthode | Code | Devise | Pays |
|---|---|---|---|
| MTN Mobile Money Bénin | `mtn_bj` | XOF | BJ |
| Moov Money Bénin | `moov_bj` | XOF | BJ |
| Celtiis Cash Bénin | `celtiis_bj` | XOF | BJ |
| Orange Money Côte d'Ivoire | `orange_ci` | XOF | CI |
| MTN Mobile Money Côte d'Ivoire | `mtn_ci` | XOF | CI |
| Moov Money Côte d'Ivoire | `moov_ci` | XOF | CI |
| Wave Côte d'Ivoire | `wave_ci` | XOF | CI |
| Orange Money Sénégal | `orange_sn` | XOF | SN |
| Free Money Sénégal | `free_sn` | XOF | SN |
| Wave Sénégal | `wave_sn` | XOF | SN |
| Expresso Sénégal | `expresso_sn` | XOF | SN |
| Orange Money Mali | `orange_ml` | XOF | ML |
| Moov Money Mali | `moov_ml` | XOF | ML |
| Orange Money Burkina Faso | `orange_bf` | XOF | BF |
| Moov Money Burkina Faso | `moov_bf` | XOF | BF |
| Orange Money Niger | `orange_ne` | XOF | NE |
| Moov Money Togo | `moov_tg` | XOF | TG |
| T-Money Togo | `tmoney_tg` | XOF | TG |
| Yas Togo | `yas_tg` | XOF | TG |
| MTN Mobile Money Cameroun | `mtn_cm` | XAF | CM |
| Orange Money Cameroun | `orange_cm` | XAF | CM |
| Airtel Money Gabon | `airtel_ga` | XAF | GA |
| Moov Money Gabon | `moov_ga` | XAF | GA |
| MTN Mobile Money Congo | `mtn_cg` | XAF | CG |
| Airtel Money Congo | `airtel_cg` | XAF | CG |
| Orange Money RDC | `orange_cd` | CDF | CD |
| Airtel Money RDC | `airtel_cd` | CDF | CD |
| Vodacom M-Pesa RDC | `mpesa_cd` | CDF | CD |
| MTN Mobile Money Guinée | `mtn_gn` | GNF | GN |
| Orange Money Guinée | `orange_gn` | GNF | GN |
| MTN Mobile Money Ghana | `mtn_gh` | GHS | GH |
| AirtelTigo Ghana | `airteltigo_gh` | GHS | GH |
| Vodafone Cash Ghana | `vodafone_gh` | GHS | GH |
| Safaricom M-Pesa Kenya | `mpesa_ke` | KES | KE |
| Airtel Money Kenya | `airtel_ke` | KES | KE |
| MTN Mobile Money Ouganda | `mtn_ug` | UGX | UG |
| Airtel Money Ouganda | `airtel_ug` | UGX | UG |
| Vodacom M-Pesa Tanzanie | `mpesa_tz` | TZS | TZ |
| Tigo Pesa Tanzanie | `tigo_tz` | TZS | TZ |
| Airtel Money Tanzanie | `airtel_tz` | TZS | TZ |
| MTN Mobile Money Rwanda | `mtn_rw` | RWF | RW |
| Airtel Money Rwanda | `airtel_rw` | RWF | RW |
| MTN Mobile Money Zambie | `mtn_zm` | ZMW | ZM |
| Airtel Money Zambie | `airtel_zm` | ZMW | ZM |

## Cartes bancaires

| Méthode | Code | Devises | Couverture |
|---|---|---|---|
| Carte Visa / Mastercard XOF | `card_xof` | XOF | Zone UEMOA |
| Carte Visa / Mastercard XAF | `card_xaf` | XAF | Zone CEMAC |
| Carte Visa / Mastercard NGN | `card_ngn` | NGN | Nigeria |
| Carte Visa / Mastercard GHS | `card_ghs` | GHS | Ghana |
| Carte Visa / Mastercard KES | `card_kes` | KES | Kenya |
| Carte Visa / Mastercard ZAR | `card_zar` | ZAR | Afrique du Sud |
| Carte Visa / Mastercard USD | `card_usd` | USD | International |
| Carte Visa / Mastercard EUR | `card_eur` | EUR | International |

## Virement bancaire

| Méthode | Code | Devise | Couverture |
|---|---|---|---|
| Virement bancaire Nigeria | `bank_transfer_ng` | NGN | NG |
| Virement bancaire Ghana | `bank_transfer_gh` | GHS | GH |
| Virement bancaire Kenya | `bank_transfer_ke` | KES | KE |
| Virement bancaire Afrique du Sud | `bank_transfer_za` | ZAR | ZA |

## Crypto-monnaies

| Méthode | Code | Devises de règlement | Devises de facturation |
|---|---|---|---|
| Crypto (BTC, ETH, USDC, USDT…) | `crypto` | BTC, ETH, USDC, USDT, DAI | USD, EUR, GBP, XOF, XAF, NGN, ZAR |

Les paiements crypto vous permettent de **facturer en monnaie fiat** (votre devise locale) tandis que le client paie en crypto-monnaie de son choix. Le règlement se fait en crypto sur votre wallet, ou en fiat sur votre compte Zayono selon votre configuration.

## Évolution du catalogue

De nouvelles méthodes sont ajoutées régulièrement. Pour rester à jour :

- Consultez l'endpoint `GET /v1/operators` qui reflète l'état réel de votre compte
- Suivez les annonces sur [status.zayono.com](https://status.zayono.com)
- Configurez vos routes dans le tableau de bord pour activer / désactiver les méthodes par environnement
