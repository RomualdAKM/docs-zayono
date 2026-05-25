# Applications et architecture multi-application

Chaque **compte marchand** Zayono peut heberger **plusieurs applications**. Une application represente un produit, une boutique ou un point d'integration distinct — chacune avec sa propre configuration, ses propres cles API et ses propres ressources.

## Pourquoi plusieurs applications ?

- **Isoler les environnements business** : une appli pour votre boutique e-commerce, une autre pour votre app mobile, une troisieme pour vos factures B2B. Chaque appli a ses statistiques, ses reglages de checkout et ses webhooks dedies.
- **Configurations differentes** : un produit peut router MTN BJ vers PawaPay, un autre vers FedaPay. Une appli peut activer la conversion automatique de devises, une autre non. Une appli peut imposer le template `abidjan`, une autre `cotonou`.
- **Cloisonner les credentials** : chaque application a ses propres cles d'agregateur, ses propres webhook endpoints, sa propre charte (logo, couleur de marque, coordonnees de support).

## Ressources scopees par application

Toutes les ressources business sont **rattachees a une application**, pas au compte marchand directement :

| Ressource | Scope |
|-----------|-------|
| Cles API | Par application |
| Regles de routage | Par application + environnement |
| Configurations agregateurs | Par application + environnement |
| Endpoints webhook | Par application |
| Transactions (paiements, transferts) | Par application |
| Clients | Par application |
| Sessions de checkout | Par application |
| Reglages applicatifs (template, couleurs, conversion, notifications, etc.) | Par application |

Une transaction effectuee avec une cle API de l'application A n'apparait que dans les listings de l'application A, n'est facturee qu'avec les `fee_percent` de l'application A, et ne declenche que les webhooks configures sur l'application A.

## Identification de l'application

Pour l'**API publique** (toutes les routes `/v1/*`), l'identification est **implicite via la cle API**. Chaque cle est rattachee a une et une seule application — il n'y a donc rien a passer en plus dans la requete :

```bash
# Cette cle pointe vers l'application "boutique-en-ligne"
curl https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_<cle de l'application boutique-en-ligne>" \
  -d '{ ... }'
```

Si vous gerez plusieurs applications, **stockez une cle distincte par application** cote integrateur (par exemple dans des variables d'environnement separees), et appelez l'API avec la cle correspondant au flux concerne.

::: tip
Vous pouvez generer autant de cles que vous voulez par application (sandbox et live separes). Une cle peut etre desactivee a tout moment depuis le dashboard sans impacter les autres applications.
:::

## Liste des applications

Le tableau de bord expose la liste de vos applications dans le menu **Applications**. Vous pouvez :

- **Creer** une nouvelle application (nom, description, environnements actives)
- **Renommer** ou **decrire** une application
- **Desactiver** une application : ses cles API rejettent immediatement toute requete avec un `403`. Pratique en cas de fuite de credentials sans perdre l'historique des transactions.
- **Telecharger une icone** (affichee aux clients sur la page de checkout et dans les recus email)

## Ce qui reste au niveau du compte marchand

Trois informations restent attachees au compte parent et partagees par toutes ses applications :

- **Email et mot de passe** du compte
- **Nom de la societe** (raison sociale legale)
- **Commission Zayono** (`zayono_fee_percent`, definie par l'administrateur)

Tout le reste — y compris les emails de notification, les coordonnees de support du checkout, la strategie de routage et la conversion de devises — est configurable **par application**.
