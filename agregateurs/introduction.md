# Agregateurs

Les agregateurs sont les **passerelles de paiement** qui traitent vos transactions aupres des operateurs mobile money. Zayono supporte plusieurs agregateurs, et chaque marchand configure **ses propres credentials** pour chacun.

## Agregateurs supportes

| Code | Nom | Capabilites | Credentials requises |
|------|-----|-------------|---------------------|
| `pawapay` | PawaPay | Paiement + Transfert | `api_key` |
| `fedapay` | FedaPay | Paiement + Transfert | `secret_key`, `public_key` |
| `feexpay` | FeexPay | Paiement + Transfert | `shop_id`, `api_token` |
| `kkiapay` | KKiaPay | Paiement + Transfert | `public_key`, `private_key`, `secret_key` |
| `ipay_money` | iPay Money | **Paiement uniquement** | `private_key` |
| `paydunya` | PayDunya | Paiement + Transfert | `master_key`, `private_key`, `token` |
| `hub2_bj`, `hub2_ci`, `hub2_sn`, `hub2_tg`, `hub2_ml`, `hub2_bf`, `hub2_cm` | Hub2 | Paiement + Transfert | `api_key`, `merchant_id` (par pays) |

::: info Hub2 — un code par pays
Hub2 est un **meta-PSP pan-africain** : chaque pays couvert a son propre tableau de bord Hub2 et **ses propres credentials**. Zayono expose donc un `aggregator_code` distinct par pays (`hub2_bj`, `hub2_ci`, …) plutot qu'un seul code global. Vous configurez un code Hub2 par pays ou vous voulez encaisser. Voir [Configurer Hub2](/agregateurs/hub2) pour la marche a suivre detaillee.
:::

::: tip Capabilites
- **Paiement** : collecte de fonds depuis le mobile money du client (in).
- **Transfert** : envoi de fonds vers le mobile money d'un beneficiaire (out).

`iPay Money` ne supporte **pas** les transferts sortants. Toute tentative de payout vers cet agregateur sera rejetee. Configurez un autre agregateur pour les transferts si vous operez au Benin ou au Niger.
:::

Les capabilites de chaque agregateur sont exposees dynamiquement via `GET /v1/aggregators/available` (champ `capabilities`).

## Gestion decentralisee

Chaque marchand configure ses **propres credentials** pour chaque agregateur. Il n'y a pas de credentials globales partagees. Cela signifie que :

- Les revenus sont verses **directement** sur le compte de l'agregateur du marchand
- Chaque marchand peut utiliser **des agregateurs differents**
- Les credentials sont chiffrees avec **AES-256** en base de donnees

## Configuration par environnement

Vous devez configurer vos credentials **separement** pour le sandbox et le live :

- Credentials sandbox : utilisees pour les tests (cles de test de l'agregateur)
- Credentials live : utilisees en production (cles de production de l'agregateur)

## Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/v1/aggregators/available` | Agregateurs disponibles |
| `GET` | `/v1/aggregator-configs` | Vos configurations |
| `POST` | `/v1/aggregator-configs` | Ajouter une configuration |
| `GET` | `/v1/aggregator-configs/{code}` | Recuperer une config |
| `DELETE` | `/v1/aggregator-configs/{code}` | Supprimer une config |
| `POST` | `/v1/aggregator-configs/{code}/test` | Tester la connexion |
