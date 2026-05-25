# Authentification

L'API Zayono utilise des **cles API** pour authentifier les requetes. Chaque cle est associee a une **application** (et non au compte marchand parent) et a un environnement specifique. Voir [Applications](/guide/applications) si vous gerez plusieurs produits depuis le meme compte.

## Format des cles

Les cles API suivent le format :

```
zyn_{environnement}_{32 caracteres alphanumeriques}
```

| Prefixe | Environnement | Usage |
|---------|---------------|-------|
| `zyn_test_` | Sandbox | Developpement et tests |
| `zyn_live_` | Production | Transactions reelles |

## Utilisation

Incluez votre cle API dans l'en-tete `Authorization` de chaque requete :

```
Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

::: code-group
```bash [cURL]
curl https://backend.zayono.com/api/v1/methods \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/methods', {
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
})
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->get('https://backend.zayono.com/api/v1/methods');
```
:::

## Types de cles

| Type | Description |
|------|-------------|
| `secret` | Cle secrete pour les appels serveur-a-serveur. **Ne jamais exposer cote client.** |
| `public` | Cle publique pour les operations cote client (usage limite). |

## Gestion des cles

Vous pouvez gerer vos cles API depuis le dashboard Zayono :

- **Creer** une nouvelle cle (la cle complete n'est affichee qu'une seule fois)
- **Desactiver** une cle existante
- **Supprimer** une cle
- **Definir une expiration** optionnelle

## Securite

::: danger Important
- Ne commitez **jamais** vos cles API dans votre code source
- Utilisez des **variables d'environnement** pour stocker vos cles
- Utilisez les cles `zyn_test_` pour le developpement et `zyn_live_` pour la production
- En cas de compromission, desactivez immediatement la cle depuis le dashboard
:::

## Erreurs d'authentification

Si la cle est invalide, expiree ou manquante, l'API retourne :

```json
{
  "message": "Invalid or missing API key.",
  "data": null,
  "errors": null
}
```

**Code HTTP :** `401 Unauthorized`
