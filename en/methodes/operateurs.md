# Operators by country

<script setup>
import ApiEndpoint from '../../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/operators" />

Returns the list of available mobile money operators. Filterable by country.

## Query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `country` | `string` | Filter by ISO country code (e.g. `BJ`, `CI`) |

## Example

```bash
curl "https://backend.zayono.com/api/v1/operators?country=BJ" \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Supported operators

### Benin (BJ) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_bj` | MTN Mobile Money | pawapay, fedapay, feexpay, kkiapay, ipay_money, paydunya, hub2_bj |
| `moov_bj` | Moov Money | pawapay, fedapay, feexpay, kkiapay, paydunya, hub2_bj |
| `celtiis_bj` | Celtiis | fedapay, kkiapay, hub2_bj |

### Côte d'Ivoire (CI) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_ci` | MTN Mobile Money CI | pawapay, fedapay, kkiapay, paydunya, hub2_ci |
| `orange_ci` | Orange Money CI | pawapay, paydunya, hub2_ci |
| `moov_ci` | Moov Money CI | kkiapay, paydunya, hub2_ci |
| `wave_ci` | Wave CI | pawapay, paydunya, hub2_ci |

### Senegal (SN) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `orange_sn` | Orange Money Senegal | pawapay, kkiapay, paydunya, hub2_sn |
| `wave_sn` | Wave Senegal | pawapay, paydunya, hub2_sn |
| `free_sn` | Free Money Senegal | fedapay, kkiapay, paydunya, hub2_sn |

### Togo (TG) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_tg` | MTN Togo | feexpay, kkiapay, hub2_tg |
| `moov_tg` | Moov Togo | fedapay, feexpay, kkiapay, paydunya, hub2_tg |
| `tmoney_tg` | T-Money Togo | kkiapay, paydunya, hub2_tg |

### Niger (NE) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `airtel_ne` | Airtel Money Niger | fedapay |
| `mtn_ne` | MTN Niger | kkiapay, ipay_money |
| `moov_ne` | Moov Niger | kkiapay |

### Mali (ML) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `orange_ml` | Orange Money Mali | paydunya, hub2_ml |
| `moov_ml` | Moov Mali | paydunya |
| `mobicash_ml` | Mobicash Mali (Sotelma/Malitel) | hub2_ml |

### Burkina Faso (BF) — XOF

| Code | Name | Aggregators |
|------|-----|-------------|
| `orange_bf` | Orange Money Burkina | feexpay, paydunya, hub2_bf |
| `moov_bf` | Moov Money Burkina | pawapay, paydunya, hub2_bf |
| `mtn_bf` | MTN Mobile Money Burkina | pawapay, hub2_bf |

### Cameroon (CM) — XAF

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_cm` | MTN Cameroon | pawapay, paydunya, hub2_cm |
| `orange_cm` | Orange Money Cameroon | pawapay, hub2_cm |

### Ghana (GH) — GHS

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_gh` | MTN Ghana | pawapay |

### Kenya (KE) — KES

| Code | Name | Aggregators |
|------|-----|-------------|
| `mpesa_ke` | M-Pesa Kenya | pawapay |

### Uganda (UG) — UGX

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_ug` | MTN Uganda | pawapay |

### Tanzania (TZ) — TZS

| Code | Name | Aggregators |
|------|-----|-------------|
| `vodacom_tz` | Vodacom M-Pesa Tanzania | pawapay |

### Rwanda (RW) — RWF

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_rw` | MTN Rwanda | pawapay |

### Zambia (ZM) — ZMW

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_zm` | MTN Zambia | pawapay |

### Congo (CG) — XAF

| Code | Name | Aggregators |
|------|-----|-------------|
| `mtn_cg` | MTN Congo | feexpay |
