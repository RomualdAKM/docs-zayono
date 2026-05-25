# Environnements

Zayono propose deux environnements distincts pour vous permettre de developper et tester en toute securite avant de passer en production.

## Sandbox vs Live

| | Sandbox | Live |
|---|---------|------|
| **Prefixe cle** | `zyn_test_` | `zyn_live_` |
| **Argent reel** | Non | Oui |
| **Agregateurs** | Credentials de test | Credentials de production |
| **Usage** | Developpement, tests | Production |

## Comment ca fonctionne

L'environnement est **determine automatiquement** par la cle API utilisee :

- Cle `zyn_test_...` → environnement **sandbox**
- Cle `zyn_live_...` → environnement **live**

Vous n'avez pas besoin de specifier l'environnement manuellement. Il suffit d'utiliser la bonne cle.

## Isolation des donnees

Les environnements sont **completement isoles** :

- Les transactions sandbox ne sont pas visibles en live et inversement
- Les regles de routage sont configurees separement par environnement
- Les configurations d'agregateurs sont separees (cles sandbox vs live)
- Les cles d'idempotence sont scopees par environnement

## Configuration sandbox

Pour utiliser le sandbox :

1. Creez une cle API de type `secret` en environnement `sandbox`
2. Configurez vos agregateurs avec leurs **credentials de test**
3. Creez des regles de routage en environnement `sandbox`
4. Utilisez la cle `zyn_test_...` pour vos appels API

::: tip Conseil
Commencez toujours par le sandbox pour valider votre integration avant de passer en production.
:::

## Passer en production

Quand votre integration fonctionne en sandbox :

1. Configurez vos agregateurs avec les **credentials de production**
2. Creez des regles de routage en environnement `live`
3. Creez une cle API en environnement `live`
4. Remplacez `zyn_test_...` par `zyn_live_...` dans votre application
