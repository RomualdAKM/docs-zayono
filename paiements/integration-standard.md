# Checkout - Page de paiement hebergee

<script setup>
import ApiEndpoint from '../.vitepress/theme/components/ApiEndpoint.vue'
import ParamTable from '../.vitepress/theme/components/ParamTable.vue'
</script>

Le checkout heberge vous permet de rediriger vos clients vers une **page de paiement securisee** geree par Zayono, sans avoir a construire votre propre interface de paiement.

## Flux

```
1. Votre serveur                    2. Redirection         3. Paiement
   POST /v1/checkout/initialize  →  Client redirige   →  Client choisit
   ← checkout_url                    vers checkout_url     l'operateur et paie
                                                              ↓
4. Retour                                              5. Webhook
   Client redirige vers return_url                        → Votre serveur
```

## Initialiser une session

<ApiEndpoint method="POST" path="/v1/checkout/initialize" />

Cree une session de checkout et retourne une URL vers laquelle rediriger votre client.

### En-tetes

| En-tete | Requis | Description |
|---------|--------|-------------|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |
| `Content-Type` | Oui | `application/json` |

### Parametres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant du paiement en unite principale de la devise, pas en centimes (ex: 5000 = 5000 XOF ; 50.99 = 50.99 USD). Minimum : 1, maximum : 10 000 000.' },
  { name: 'currency', type: 'string', required: true, description: 'Code devise ISO 4217 (ex: XOF, XAF, GHS, KES)' },
  { name: 'return_url', type: 'string', required: true, description: 'URL de redirection apres paiement reussi (max 500)' },
  { name: 'cancel_url', type: 'string', required: false, description: 'URL de redirection en cas d annulation (max 500)' },
  { name: 'customer_phone', type: 'string', required: false, description: 'Numero de telephone du client au format international (pre-rempli sur la page)' },
  { name: 'customer_email', type: 'string', required: false, description: 'Email du client (pre-rempli)' },
  { name: 'description', type: 'string', required: false, description: 'Description affichee sur la page de paiement (max 255)' },
  { name: 'metadata', type: 'object', required: false, description: 'Donnees personnalisees attachees a la transaction' },
  { name: 'template', type: 'string', required: false, description: 'Apparence de la page : default, abidjan (mobile-first) ou cotonou (desktop 2-col). Si omis, utilise le template configure par defaut sur votre compte.' },
]" />

### Exemple

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/checkout/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 15000,
    "currency": "XOF",
    "return_url": "https://votre-site.com/merci",
    "cancel_url": "https://votre-site.com/annule",
    "customer_email": "client@example.com",
    "description": "Pack Premium",
    "metadata": {
      "order_id": "ORD-789"
    }
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/checkout/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 15000,
    currency: 'XOF',
    return_url: 'https://votre-site.com/merci',
    cancel_url: 'https://votre-site.com/annule',
    customer_email: 'client@example.com',
    description: 'Pack Premium',
    metadata: {
      order_id: 'ORD-789',
    },
  }),
})

const data = await response.json()
// Redirigez le client vers data.data.checkout_url
window.location.href = data.data.checkout_url
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->post('https://backend.zayono.com/api/v1/checkout/initialize', [
        'amount' => 15000,
        'currency' => 'XOF',
        'return_url' => 'https://votre-site.com/merci',
        'cancel_url' => 'https://votre-site.com/annule',
        'customer_email' => 'client@example.com',
        'description' => 'Pack Premium',
        'metadata' => ['order_id' => 'ORD-789'],
    ]);

// Redirigez le client
return redirect($response->json('data.checkout_url'));
```
:::

### Reponse — 201 Created

```json
{
  "message": "Checkout session created successfully.",
  "data": {
    "checkout_url": "https://app.zayono.com/checkout/a1b2c3d4e5f6...",
    "session_token": "a1b2c3d4e5f6...",
    "expires_at": "2025-05-15T11:00:00+00:00"
  },
  "errors": null
}
```

## Templates de page de checkout

Trois apparences sont disponibles pour la page hebergee. Vous pouvez :

- soit imposer un template par session via le parametre `template` ci-dessus,
- soit definir un **template par defaut** dans votre tableau de bord (Paiements → Reglages → Apparence) qui s'applique a toutes les sessions sans `template`.

| Code | Style | Quand l'utiliser |
|------|-------|------------------|
| `default` | Layout equilibre, fonctionne sur mobile et desktop | Choix prudent si vous ne savez pas |
| `abidjan` | **Mobile-first**, layout pleine hauteur, montant en avant, CTA fixe en bas | Vos clients paient majoritairement depuis un telephone |
| `cotonou` | **Desktop-first**, 2 colonnes (recap a gauche, formulaire a droite) | Vos clients paient depuis un ordinateur (e-commerce classique) |

## Personnalisation des couleurs

Vous pouvez remplacer la couleur primaire des boutons et accents par celle de votre marque depuis Paiements → Reglages → Apparence → **Couleurs de votre marque**. La couleur est :

- stockee sous forme de code hexadecimal `#RRGGBB`,
- appliquee aux **trois templates** de checkout (`default`, `abidjan`, `cotonou`),
- injectee comme variable CSS (`--checkout-primary`) sur la page hebergee, sans recompilation cote serveur.

La page de configuration calcule en direct le **ratio de contraste WCAG** avec le texte blanc des boutons. Si le contraste est faible (< 4,5 : 1), un avertissement s'affiche pour vous prevenir que les boutons risquent d'etre difficiles a lire — la sauvegarde reste autorisee pour ne pas brider votre charte, mais le message reste visible. Laissez le champ vide pour revenir au bleu Zayono par defaut.

L'API expose la couleur configuree dans la reponse `GET /v1/checkout/{token}` sous `data.merchant.branding.primary_color` (ou `null` si non configuree), au cas ou vous construisez vous-meme une integration personnalisee.

## Frais de transaction

Si la methode choisie par le client a un `fee_percent` configure dans vos regles de routage, le montant facture au client est **automatiquement** augmente. Par exemple, sur un paiement de 1 000 XOF via une methode configuree a 2 %, le client paie 1 020 XOF. La page de checkout affiche le detail (Sous-total / Frais / Total) avant la confirmation. Voir depuis votre tableau de bord (Méthodes) pour le detail.

## Expiration

Les sessions de checkout expirent apres **30 minutes**. Passe ce delai :

- La page de checkout affiche un message d'expiration
- L'API retourne `410 Gone` si vous tentez d'interroger la session
- Vous devez creer une nouvelle session

## Apres le paiement

Une fois le paiement effectue :

1. Le client est redirige vers votre `return_url`
2. Un [webhook](/introduction/webhooks) est envoye a vos endpoints configures
3. Vous pouvez verifier le statut via `GET /v1/payments/{id}/verify`

::: warning Important
Ne vous fiez pas uniquement a la redirection pour confirmer le paiement. Utilisez toujours les webhooks ou l'endpoint de verification pour confirmer le statut cote serveur.
:::
