# Devises supportees

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
</script>

<ApiEndpoint method="GET" path="/v1/currencies" />

Retourne la liste de toutes les devises supportees par Zayono.

## Exemple

```bash
curl https://backend.zayono.com/api/v1/currencies \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Devises de reglement operateur (15)

Les devises ci-dessous correspondent aux devises dans lesquelles les operateurs Mobile Money supportes reglent les transactions. Toute transaction est en fin de compte facturee dans l'une d'elles ; les conversions automatiques de devises (voir [Conversion](/taux-change/convertir)) traduisent les autres vers ces 15 cibles.

| Code | Nom | Pays |
|------|-----|------|
| `XOF` | Franc CFA BCEAO | Benin, Cote d'Ivoire, Senegal, Togo, Mali, Niger, Burkina Faso |
| `XAF` | Franc CFA BEAC | Cameroun, Congo, Tchad, Centrafrique, Gabon, Guinee equatoriale |
| `GHS` | Cedi ghaneen | Ghana |
| `KES` | Shilling kenyan | Kenya |
| `UGX` | Shilling ougandais | Ouganda |
| `TZS` | Shilling tanzanien | Tanzanie |
| `RWF` | Franc rwandais | Rwanda |
| `ZMW` | Kwacha zambien | Zambie |
| `CDF` | Franc congolais | Republique democratique du Congo |
| `NGN` | Naira nigerian | Nigeria |
| `SLE` | Leone sierra-leonais | Sierra Leone |
| `MWK` | Kwacha malawite | Malawi |
| `MZN` | Metical mozambicain | Mozambique |
| `LSL` | Loti lesothien | Lesotho |
| `ETB` | Birr ethiopien | Ethiopie |

## Devises sources acceptees a l'initialisation

A l'initialisation d'un paiement ou d'un transfert, le champ `currency` accepte les 15 devises ci-dessus **ainsi que** toutes les devises pour lesquelles Zayono dispose d'un taux de change (typiquement `USD` et `EUR`). Si la devise declaree differe de celle de l'operateur ET que la conversion automatique est activee dans les reglages de l'application, le montant est converti avant facturation. Sinon, l'API retourne `422` (devise non supportee).

::: tip
Les taux Zayono couvrent toutes les paires `USD → devise operateur` et `EUR → devise operateur` (cette derniere via le pivot `EUR → USD`). Les paires inverses (`devise operateur → USD`) sont derivees automatiquement.
:::
