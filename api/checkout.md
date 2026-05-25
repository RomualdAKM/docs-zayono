# Checkout

L'API Checkout crée une **session de paiement hébergée** : Zayono génère une URL `https://app.zayono.com/checkout/{token}` vers laquelle vous redirigez le client. Sur cette page, le client choisit lui-même l'opérateur, saisit son numéro, valide l'OTP — vous n'avez pas à orchestrer le flux côté backend.

- **Base URL** : `https://backend.zayono.com/api/v1`
- **Auth** : `Authorization: Bearer zyn_test_...` ou `Bearer zyn_live_...`
- **Expiration** : 30 minutes après création (`expires_at`).

::: tip Checkout vs `POST /v1/payments/initialize`

| | `POST /v1/checkout/initialize` | `POST /v1/payments/initialize` |
|---|---|---|
| Page hébergée | Oui (Zayono branded, `app_icon`, `primary_color`) | Non — vous gérez l'UI |
| Choix de l'opérateur | Côté client (sur la page Zayono) | Côté serveur (vous l'imposez via `operator`) |
| Templates | 3 disponibles (`default`, `abidjan`, `cotonou`) | N/A |
| Multi-opérateurs / FX | Oui, automatique | Une seule méthode imposée |
| Statut | `expires_at` après 30 min ; URL réutilisable | Transaction simple |
| Cas d'usage | E-commerce, panier checkout, lien de paiement | Backoffice, abonnements pré-orchestrés |

:::

## Créer une session de checkout

<ApiEndpoint method="POST" path="/v1/checkout/initialize" />

Crée une `CheckoutSession` et renvoie une `checkout_url` que vous donnez au client.

### En-têtes

| En-tête | Requis | Description |
|---|---|---|
| `Authorization` | Oui | `Bearer zyn_test_...` ou `Bearer zyn_live_...` |
| `Content-Type` | Oui | `application/json` |

### Paramètres

<ParamTable :params="[
  { name: 'amount', type: 'number', required: true, description: 'Montant entre 1 et 10 000 000 dans la devise déclarée.' },
  { name: 'currency', type: 'string (ISO 4217)', required: true, description: 'Code 3 lettres. Limité aux devises opérateur natives (XOF, XAF, GHS, KES, NGN, ZAR, USD, EUR, …) — pas de FX exotique sur le checkout.' },
  { name: 'return_url', type: 'string (URL)', required: true, description: 'URL où renvoyer le client après un paiement réussi (max 500).' },
  { name: 'cancel_url', type: 'string (URL)', required: false, description: 'URL où renvoyer le client en cas d’annulation / échec (max 500).' },
  { name: 'customer_email', type: 'string (email)', required: false, description: 'Email pré-rempli sur la page de checkout (max 255). Sert aussi à l’envoi de reçu.' },
  { name: 'customer_phone', type: 'string', required: false, description: 'Téléphone pré-rempli (E.164, 8 à 15 chiffres).' },
  { name: 'description', type: 'string', required: false, description: 'Affichée sur la page de paiement (max 255).' },
  { name: 'template', type: 'string', required: false, description: 'Variante visuelle : `default`, `abidjan` ou `cotonou`. Par défaut : valeur de `application.settings.checkout_template`, sinon `default`.' },
  { name: 'metadata', type: 'object', required: false, description: 'Objet libre persisté en JSON ; renvoyé dans les webhooks issus de cette session.' },
]" />

### Exemple

::: code-group

```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/checkout/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "description": "T-shirt premium",
    "return_url": "https://example.com/merci",
    "cancel_url": "https://example.com/panier",
    "customer_email": "jean@example.com",
    "template": "abidjan",
    "metadata": { "order_id": "ORD-2025-001" }
  }'
```

```js [Node.js]
const res = await fetch('https://backend.zayono.com/api/v1/checkout/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'XOF',
    description: 'T-shirt premium',
    return_url: 'https://example.com/merci',
    cancel_url: 'https://example.com/panier',
    customer_email: 'jean@example.com',
    template: 'abidjan',
  }),
})
const { data } = await res.json()
window.location.href = data.checkout_url
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->post('https://backend.zayono.com/api/v1/checkout/initialize', [
        'amount' => 5000,
        'currency' => 'XOF',
        'description' => 'T-shirt premium',
        'return_url' => 'https://example.com/merci',
        'cancel_url' => 'https://example.com/panier',
        'customer_email' => 'jean@example.com',
        'template' => 'abidjan',
    ]);

return redirect($response['data']['checkout_url']);
```

```python [Python]
import requests

response = requests.post(
    "https://backend.zayono.com/api/v1/checkout/initialize",
    headers={"Authorization": "Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
    json={
        "amount": 5000,
        "currency": "XOF",
        "description": "T-shirt premium",
        "return_url": "https://example.com/merci",
        "customer_email": "jean@example.com",
    },
)
checkout_url = response.json()["data"]["checkout_url"]
```

:::

### Réponses

#### 201 — Session créée

```json
{
  "message": "Checkout session created successfully.",
  "data": {
    "checkout_url": "https://app.zayono.com/checkout/4f5c8e9a...d2b1",
    "session_token": "4f5c8e9a...d2b1",
    "expires_at": "2026-05-25T11:00:00+00:00"
  },
  "errors": null
}
```

#### 403 — Application ou marchand suspendu

```json
{ "message": "Application is inactive.", "data": null, "errors": null }
```

#### 422 — Validation

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "return_url": ["A return URL is required for redirection after payment."]
  }
}
```

---

## Templates

Le paramètre `template` change l'apparence de la page hébergée :

| Code | Style |
|---|---|
| `default` | Stripe-like, neutre, blanc/noir. |
| `abidjan` | Couleurs chaleureuses (vert/jaune), inspiré de la Côte d'Ivoire. |
| `cotonou` | Cyan / orange, inspiré du Bénin. |

Voir [Templates de checkout](/checkout/templates) pour les rendus visuels.

---

## Endpoints publics côté client

Les endpoints suivants (préfixe `/api/checkout/{token}` sans `/v1`) sont consommés par la page de checkout elle-même — **vous n'avez pas à les appeler côté serveur**. Ils sont documentés ici pour transparence et debug.

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/checkout/{token}` | Récupère la session pour affichage (opérateurs disponibles, FX, branding). Public, no-auth. Cache-Control `private, no-store`. |
| `POST` | `/checkout/{token}/process` | Lance le paiement après choix opérateur + numéro. Throttle 10/min/IP. |
| `GET` | `/checkout/{token}/status` | Polling du statut courant (toutes les 0.5 s côté SPA). Throttle 120/min/IP. |
| `POST` | `/checkout/{token}/resend-otp` | Re-demande l'OTP au PSP (Hub2 Orange uniquement aujourd'hui). Throttle 3/min/IP. |
| `POST` | `/checkout/{token}/email-receipt` | Envoie le reçu par mail. **Ne peut être envoyé qu'à l'email saisi à la création** (anti-relais). Throttle 3/min/IP. |
| `GET` | `/checkout/{token}/receipt.pdf` | Téléchargement du reçu. Throttle 30/min/IP. |

::: warning Sécurité du token
Le `session_token` est l'identifiant de session — toute personne qui l'a peut consulter (et déclencher le paiement) sur la session. Ne pas le journaliser, ne pas le mettre dans une URL partageable hors flux légitime.
:::
