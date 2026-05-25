# Idempotence

L'idempotence vous permet de **rejouer une requete en toute securite** sans risquer de creer des doublons. C'est particulierement important pour les operations financieres.

## Principe

Si une requete echoue a cause d'un probleme reseau, vous pouvez la renvoyer avec la meme cle d'idempotence. Zayono detectera qu'il s'agit d'un doublon et retournera la transaction originale au lieu d'en creer une nouvelle.

## Utilisation

Ajoutez l'en-tete `X-Idempotency-Key` avec un UUID v4 unique :

```bash
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{ ... }'
```

## Regles

| Regle | Detail |
|-------|--------|
| **Format** | UUID v4 valide uniquement |
| **Scope** | Par marchand + par environnement + par type de transaction |
| **Unicite** | Une cle differente par operation distincte |
| **Rejeu** | Meme cle = retourne la transaction existante |

## Exemple de rejeu

Premiere requete (cree la transaction) :

```json
// POST /v1/payments/initialize
// X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
// → 201 Created

{
  "message": "Payment initialized successfully.",
  "data": { "id": "abc-123", "status": "initiated", ... }
}
```

Meme requete rejouee (retourne la transaction existante) :

```json
// POST /v1/payments/initialize
// X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
// → 200 OK

{
  "message": "Payment already initialized.",
  "data": { "id": "abc-123", "status": "initiated", ... }
}
```

## Erreur de format

Si la cle n'est pas un UUID valide :

```json
{
  "message": "X-Idempotency-Key must be a valid UUID.",
  "data": null,
  "errors": null
}
```

**Code HTTP :** `400 Bad Request`

::: tip Conseil
Generez un nouvel UUID pour chaque operation distincte. Reutilisez le meme UUID uniquement pour rejouer une requete echouee.
:::
