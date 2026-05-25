# Operateurs par pays

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/operators" />

Retourne la liste des operateurs mobile money disponibles. Filtrable par pays.

## Parametres de requete

| Parametre | Type | Description |
|-----------|------|-------------|
| `country` | `string` | Filtrer par code pays ISO (ex: `BJ`, `CI`) |

## Exemple

```bash
curl "https://backend.zayono.com/api/v1/operators?country=BJ" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Operateurs supportes

### Benin (BJ) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_bj` | MTN Mobile Money | pawapay, fedapay, feexpay, kkiapay, ipay_money, paydunya, hub2_bj |
| `moov_bj` | Moov Money | pawapay, fedapay, feexpay, kkiapay, paydunya, hub2_bj |
| `celtiis_bj` | Celtiis | fedapay, kkiapay, hub2_bj |

### Cote d'Ivoire (CI) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_ci` | MTN Mobile Money CI | pawapay, fedapay, kkiapay, paydunya, hub2_ci |
| `orange_ci` | Orange Money CI | pawapay, paydunya, hub2_ci |
| `moov_ci` | Moov Money CI | kkiapay, paydunya, hub2_ci |
| `wave_ci` | Wave CI | pawapay, paydunya, hub2_ci |

### Senegal (SN) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `orange_sn` | Orange Money Senegal | pawapay, kkiapay, paydunya, hub2_sn |
| `wave_sn` | Wave Senegal | pawapay, paydunya, hub2_sn |
| `free_sn` | Free Money Senegal | fedapay, kkiapay, paydunya, hub2_sn |

### Togo (TG) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_tg` | MTN Togo | feexpay, kkiapay, hub2_tg |
| `moov_tg` | Moov Togo | fedapay, feexpay, kkiapay, paydunya, hub2_tg |
| `tmoney_tg` | T-Money Togo | kkiapay, paydunya, hub2_tg |

### Niger (NE) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `airtel_ne` | Airtel Money Niger | fedapay |
| `mtn_ne` | MTN Niger | kkiapay, ipay_money |
| `moov_ne` | Moov Niger | kkiapay |

### Mali (ML) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `orange_ml` | Orange Money Mali | paydunya, hub2_ml |
| `moov_ml` | Moov Mali | paydunya |
| `mobicash_ml` | Mobicash Mali (Sotelma/Malitel) | hub2_ml |

### Burkina Faso (BF) — XOF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `orange_bf` | Orange Money Burkina | feexpay, paydunya, hub2_bf |
| `moov_bf` | Moov Money Burkina | pawapay, paydunya, hub2_bf |
| `mtn_bf` | MTN Mobile Money Burkina | pawapay, hub2_bf |

### Cameroun (CM) — XAF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_cm` | MTN Cameroun | pawapay, paydunya, hub2_cm |
| `orange_cm` | Orange Money Cameroun | pawapay, hub2_cm |

### Ghana (GH) — GHS

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_gh` | MTN Ghana | pawapay |

### Kenya (KE) — KES

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mpesa_ke` | M-Pesa Kenya | pawapay |

### Ouganda (UG) — UGX

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_ug` | MTN Uganda | pawapay |

### Tanzanie (TZ) — TZS

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `vodacom_tz` | Vodacom M-Pesa Tanzania | pawapay |

### Rwanda (RW) — RWF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_rw` | MTN Rwanda | pawapay |

### Zambie (ZM) — ZMW

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_zm` | MTN Zambia | pawapay |

### Congo (CG) — XAF

| Code | Nom | Agregateurs |
|------|-----|-------------|
| `mtn_cg` | MTN Congo | feexpay |
