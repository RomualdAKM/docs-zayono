# Limites techniques

Reference des limites et contraintes de l'API Zayono.

## Limites de debit (Rate Limiting)

| Scope | Limite | Par |
|-------|--------|-----|
| Endpoints API | 120 requetes/min | Cle API |
| Authentification | 10 requetes/min | Adresse IP |
| Checkout (process) | 10 requetes/min | Adresse IP |
| Webhooks entrants | 100 requetes/min | Adresse IP |

## Limites de contenu

| Element | Limite |
|---------|--------|
| Taille du corps de requete | 1 Mo |
| Pagination `per_page` max | 100 |
| Regles de routage par bulk | 50 |
| Description | 255 caracteres |
| URL (return_url, cancel_url) | 500 caracteres |
| URL webhook | 2048 caracteres |
| Nom de cle API | 255 caracteres |
| Description de cle API | 500 caracteres |
| Metadata (nombre de cles) | Pas de limite stricte |

## Limites de session

| Element | Limite |
|---------|--------|
| Expiration session checkout | 30 minutes |
| Expiration cle API | Configurable (optionnel) |

## Limites de validation

| Element | Contrainte |
|---------|------------|
| Montant minimum | 1 |
| Devise | 3 caracteres ISO 4217 |
| Code pays | 2 caracteres ISO 3166-1 |
| Telephone | 8-15 chiffres |
| Cle API format | `zyn_(live\|test)_[a-zA-Z0-9]{32}` |
| Idempotency Key | UUID v4 valide |
| Priorite routage | 1-100 |
| Frais marchand | 0-50% |

## Webhooks

| Element | Valeur |
|---------|--------|
| Tentatives de livraison | 3 max |
| Timeout par tentative | 30 secondes |
| Evenements supportes | 6 |
| Methode de signature | HMAC-SHA256 |

## Agregateurs

| Element | Valeur |
|---------|--------|
| Agregateurs supportes | 6 |
| Chiffrement credentials | AES-256 |
| Credentials par agregateur/env | 1 max |
