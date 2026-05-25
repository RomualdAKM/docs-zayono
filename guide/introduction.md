# Introduction

Zayono est une **plateforme d'agregation de paiements mobile money** concue pour l'Afrique. Elle fournit une API REST unique permettant aux marchands d'accepter des paiements et d'envoyer des transferts via plusieurs operateurs et agregateurs de paiement.

## Comment ca fonctionne

```
Votre Application → API Zayono → Agregateur → Operateur Mobile Money
                                  (PawaPay)    (MTN Mobile Money)
                                  (FedaPay)    (Orange Money)
                                  (FeexPay)    (Moov Money)
                                  (KKiaPay)    (...)
                                  (iPay Money)
                                  (PayDunya)
```

Au lieu d'integrer chaque agregateur individuellement, vous n'avez qu'une seule API a integrer. Zayono s'occupe du routage vers le bon agregateur selon l'operateur, le pays et vos regles de priorite.

## Concepts cles

| Concept | Description |
|---------|-------------|
| **Paiement** | Collecter de l'argent aupres d'un client (mobile money vers marchand) |
| **Transfert (Payout)** | Envoyer de l'argent a un beneficiaire (marchand vers mobile money) |
| **Checkout** | Page de paiement hebergee par Zayono |
| **Operateur** | Service mobile money (MTN, Orange, Moov, etc.) |
| **Agregateur** | Passerelle de paiement (PawaPay, FedaPay, etc.) |
| **Routage** | Regles definissant quel agregateur utiliser pour chaque operateur |

## URL de base

Toutes les requetes API utilisent l'URL de base suivante :

```
https://backend.zayono.com/api/v1/
```

## Prochaines etapes

- [Demarrage rapide](/guide/demarrage-rapide) - Faites votre premier paiement en 5 minutes
- [Authentification](/guide/authentification) - Configurez vos cles API
- [Paiements](/paiements/introduction) - Apprenez a collecter des paiements
