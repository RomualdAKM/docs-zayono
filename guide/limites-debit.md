# Limites de debit

L'API Zayono applique des limites de debit (rate limiting) pour garantir la stabilite et l'equite d'utilisation.

## Limites par defaut

| Type de requete | Limite | Scope |
|-----------------|--------|-------|
| Endpoints API (cle API) | **120 requetes / minute** | Par cle API |
| Authentification (login) | **10 requetes / minute** | Par adresse IP |
| Checkout (processing) | **10 requetes / minute** | Par adresse IP |
| Webhooks entrants | **100 requetes / minute** | Par adresse IP |

## Reponse en cas de depassement

Quand la limite est atteinte, l'API retourne :

**Code HTTP :** `429 Too Many Requests`

```json
{
  "message": "Too Many Attempts.",
  "data": null,
  "errors": null
}
```

## Bonnes pratiques

### Backoff exponentiel

En cas de reponse 429, attendez avant de retenter :

```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options)

    if (response.status !== 429) {
      return response
    }

    // Backoff exponentiel : 1s, 2s, 4s
    const delay = Math.pow(2, attempt) * 1000
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  throw new Error('Rate limit exceeded after retries')
}
```

### Optimisez vos appels

- **Evitez le polling excessif** : utilisez les [webhooks](/webhooks/introduction) pour etre notifie des changements de statut
- **Mettez en cache** les reponses qui changent rarement (methodes, operateurs, taux de change)
- **Regroupez les operations** quand c'est possible (ex: regles de routage en masse)
