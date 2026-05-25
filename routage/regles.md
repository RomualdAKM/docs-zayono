# Regles de routage

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

## Creer une regle

<ApiEndpoint method="POST" path="/v1/routing-rules" />

<ParamTable :params="[
  { name: 'operator', type: 'string', required: true, description: 'Code operateur (ex: mtn_bj, orange_ci)' },
  { name: 'aggregator_code', type: 'string', required: true, description: 'Code de l agregateur (ex: pawapay, fedapay)' },
  { name: 'environment', type: 'string', required: true, description: 'sandbox ou live' },
  { name: 'priority', type: 'integer', required: true, description: 'Priorite (1-100, 1 = plus haute)' },
  { name: 'fallback_aggregator', type: 'string', required: false, description: 'Agregateur de secours (doit differer du principal)' },
  { name: 'fee_percent', type: 'number', required: false, description: 'Frais en % appliques a cette methode specifique (operateur+agregateur). Si > 0, automatiquement ajoutes au montant que le client paie. Optionnel, 0-50.' },
]" />

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/routing-rules \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "operator": "mtn_bj",
    "aggregator_code": "pawapay",
    "environment": "sandbox",
    "priority": 1,
    "fallback_aggregator": "fedapay",
    "fee_percent": 2.5
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/routing-rules', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    operator: 'mtn_bj',
    aggregator_code: 'pawapay',
    environment: 'sandbox',
    priority: 1,
    fallback_aggregator: 'fedapay',
    fee_percent: 2.5,
  }),
})
```
:::

---

## Lister les regles

<ApiEndpoint method="GET" path="/v1/routing-rules" />

```bash
curl https://backend.zayono.com/api/v1/routing-rules \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Recuperer une regle

<ApiEndpoint method="GET" path="/v1/routing-rules/{id}" />

---

## Modifier une regle

<ApiEndpoint method="PUT" path="/v1/routing-rules/{id}" />

Parametre modifiables : `priority`, `fallback_aggregator`, `fee_percent`, `is_active`.

---

## Supprimer une regle

<ApiEndpoint method="DELETE" path="/v1/routing-rules/{id}" />

---

## Import en masse

<ApiEndpoint method="POST" path="/v1/routing-rules/bulk" />

Creez jusqu'a **50 regles** en une seule requete. Le comportement est un upsert : si une regle existe deja pour le meme operateur/agregateur/environnement, elle est mise a jour.

```bash
curl -X POST https://backend.zayono.com/api/v1/routing-rules/bulk \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {
        "operator": "mtn_bj",
        "aggregator_code": "pawapay",
        "environment": "sandbox",
        "priority": 1
      },
      {
        "operator": "moov_bj",
        "aggregator_code": "fedapay",
        "environment": "sandbox",
        "priority": 1
      }
    ]
  }'
```

---

## Comportement du `fee_percent`

Le `fee_percent` est configure **par methode** — c'est-a-dire par couple operateur×agregateur. Vous pouvez donc avoir des frais differents pour la meme methode selon l'agregateur utilise. Exemples :

- MTN Money Benin via FedaPay = 2 %
- MTN Money Benin via PawaPay = 1,5 %
- Orange Money CI via PawaPay = 1 %

Lors d'un paiement entrant (collecte) :

- Si `fee_percent` est nul ou egal a 0 → le client paie exactement le `amount` initial, et le marchand absorbe les frais reels de l'agregateur.
- Si `fee_percent > 0` → le montant est **automatiquement augmente** : le client est debite de `amount × (1 + fee_percent/100)`. Le marchand recoit l'`amount` net.

Exemple : pour un paiement de **1 000 XOF** via une methode configuree a **2 %**, le client est debite de **1 020 XOF**.

::: tip
Pour les transferts sortants (payouts), le `fee_percent` configure ici **n'est pas** ajoute au montant envoye au destinataire — l'agregateur deduit ses propres frais du portefeuille du marchand. Le champ reste utile cote dashboard pour declarer une marge interne.
:::

### Conversion automatique de devises

Si vous activez la **conversion automatique de devises** dans les reglages de votre application (Paiements → Reglages → Conversion de devises), Zayono convertit automatiquement le montant de la transaction dans la devise de reglement de l'operateur, dans **les deux sens** :

- **Paiements** : le client paie dans la devise que vous declarez (ex: USD), Zayono convertit en devise operateur (ex: XOF) avant facturation.
- **Transferts** : vous specifiez le montant a envoyer dans votre devise (ex: USD), Zayono convertit dans la devise du destinataire (ex: XOF) avant l'execution.

Le taux applique est le taux Zayono multiplie par `1 + correction_rate/100` (le `correction_rate` est un pourcentage de marge configurable, par defaut 2 % pour absorber les fluctuations). Voir [Devises supportees](/taux-change/devises) pour la liste complete des paires disponibles.

---

## Operateurs disponibles

<ApiEndpoint method="GET" path="/v1/routing/operators" />

Retourne tous les operateurs avec leurs agregateurs supportes.

---

## Agregateurs pour un operateur

<ApiEndpoint method="GET" path="/v1/routing/operators/{operator}/aggregators" />

Retourne les agregateurs disponibles pour un operateur specifique.

```bash
curl https://backend.zayono.com/api/v1/routing/operators/mtn_bj/aggregators \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```
