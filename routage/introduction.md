# Routage

Le systeme de routage de Zayono permet de definir **quel agregateur** doit etre utilise pour traiter les paiements de chaque operateur.

## Principe

Quand un paiement est initie avec un operateur (ex: `mtn_bj`), Zayono consulte vos regles de routage pour determiner :

1. Quel **agregateur** utiliser (ex: PawaPay, FedaPay)
2. Quel **agregateur de secours** utiliser en cas d'echec
3. Quel **pourcentage de frais** ajouter au montant facture au client (le marchand recoit l'`amount` net)

```
Paiement MTN BJ
      ↓
Regle: mtn_bj → pawapay (priorite 1, fallback: fedapay)
      ↓
Essai PawaPay → Echec ?
      ↓              ↓
   Succes        Essai FedaPay
```

## Configuration par environnement

Les regles de routage sont configurees **separement** pour le sandbox et le live :

- Regles sandbox : utilisees avec les cles `zyn_test_...`
- Regles live : utilisees avec les cles `zyn_live_...`

## Priorite

Chaque regle a une **priorite** (1-100, 1 = plus haute). Si plusieurs regles existent pour un meme operateur, celle avec la plus haute priorite est utilisee.

## Strategie de selection

Le champ `routing_strategy` dans les reglages de votre application (Paiements → Reglages → Aiguillage) controle **comment** Zayono choisit l'agregateur a chaque transaction :

### `custom` — vous decidez (par defaut)

L'agregateur principal et l'agregateur de secours sont exactement ceux que vous avez configures dans la regle de routage. Aucune logique automatique ne les modifie. Choisissez cette strategie si vous voulez un controle total et previsible.

### `auto` — Zayono optimise en temps reel

A chaque transaction, Zayono note les agregateurs connectes et capables de servir l'operateur demande, puis selectionne automatiquement le **meilleur duo (principal, secours)** selon un score pondere :

- **50 % taux de succes** sur les 7 derniers jours pour ce (application × operateur × environnement × type)
- **30 % latence moyenne** des appels reussis (plus c'est rapide, mieux c'est)
- **20 % cout** (le `fee_percent` que vous avez declare)

Le calcul est **mis en cache pendant 15 minutes** par tuple pour rester negligeable a l'echelle d'une transaction. Si un agregateur a moins de 5 tentatives dans la fenetre (cold start), Zayono retombe sur un ordre alphabetique deterministe le temps que les donnees s'accumulent.

La regle stockee n'est **pas** modifiee — Zayono ne fait que surcharger en memoire le couple (principal, secours) au moment d'executer la transaction. Si vous repassez en `custom`, votre configuration manuelle reprend immediatement.

::: tip
Activer `auto` ne dispense pas d'avoir une regle de routage : Zayono ne peut piocher que parmi les agregateurs **connectes a l'application** ET **listes comme compatibles** avec l'operateur dans la configuration interne. La regle declare aussi le `fee_percent` qui alimente le score.
:::

## Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/v1/routing-rules` | Lister vos regles |
| `POST` | `/v1/routing-rules` | Creer une regle |
| `GET` | `/v1/routing-rules/{id}` | Recuperer une regle |
| `PUT` | `/v1/routing-rules/{id}` | Modifier une regle |
| `DELETE` | `/v1/routing-rules/{id}` | Supprimer une regle |
| `POST` | `/v1/routing-rules/bulk` | Creer des regles en masse |
| `GET` | `/v1/routing/operators` | Operateurs disponibles |
| `GET` | `/v1/routing/operators/{op}/aggregators` | Agregateurs pour un operateur |

Consultez la page [Regles de routage](/routage/regles) pour la reference complete.
