# Demarrage rapide

Ce guide vous accompagne pour effectuer votre premier paiement avec l'API Zayono en quelques minutes.

## Etape 1 : Creer un compte

Inscrivez-vous sur le [dashboard Zayono](https://dashboard.zayono.com) pour obtenir votre compte marchand.

## Etape 2 : Configurer un agregateur

Dans votre dashboard, allez dans **Agregateurs** et configurez au moins un agregateur en mode **sandbox**. Par exemple, ajoutez vos cles API PawaPay de test.

## Etape 3 : Creer des regles de routage

Configurez une regle de routage pour associer un operateur (ex: `mtn_bj`) a votre agregateur configure. Cela indique a Zayono comment traiter les paiements pour cet operateur.

## Etape 4 : Obtenir votre cle API

Dans **Cles API**, creez une cle de type `secret` en environnement `sandbox`. Vous obtiendrez une cle au format :

```
zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

::: warning Attention
La cle complete n'est affichee qu'une seule fois a la creation. Copiez-la et conservez-la en securite.
:::

## Etape 5 : Initialiser un paiement

Effectuez votre premier appel API :

::: code-group
```bash [cURL]
curl -X POST https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "XOF",
    "description": "Commande #1234",
    "return_url": "https://votre-site.com/retour",
    "customer": {
      "email": "client@example.com",
      "first_name": "Jean",
      "last_name": "Dupont",
      "phone": "+22990000000"
    },
    "operator": "mtn_bj"
  }'
```

```javascript [JavaScript]
const response = await fetch('https://backend.zayono.com/api/v1/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 1000,
    currency: 'XOF',
    description: 'Commande #1234',
    return_url: 'https://votre-site.com/retour',
    customer: {
      email: 'client@example.com',
      first_name: 'Jean',
      last_name: 'Dupont',
      phone: '+22990000000',
    },
    operator: 'mtn_bj',
  }),
})

const data = await response.json()
console.log(data)
```

```php [PHP]
$response = Http::withToken('zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    ->post('https://backend.zayono.com/api/v1/payments/initialize', [
        'amount' => 1000,
        'currency' => 'XOF',
        'description' => 'Commande #1234',
        'return_url' => 'https://votre-site.com/retour',
        'customer' => [
            'email' => 'client@example.com',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'phone' => '+22990000000',
        ],
        'operator' => 'mtn_bj',
    ]);

$data = $response->json();
```
:::

**Reponse (201 Created) :**

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 1000,
    "currency": "XOF",
    "checkout_url": null,
    "return_url": "https://votre-site.com/retour",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

## Etape 6 : Verifier le statut

Verifiez le statut du paiement en utilisant l'identifiant retourne :

::: code-group
```bash [cURL]
curl https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify \
  -H "Authorization: Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```javascript [JavaScript]
const response = await fetch(
  'https://backend.zayono.com/api/v1/payments/9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8/verify',
  {
    headers: {
      'Authorization': 'Bearer zyn_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  }
)

const data = await response.json()
console.log(data.data.status) // "success", "pending", "failed"
```
:::

## Etape 7 : Recevoir les webhooks

Configurez un endpoint webhook pour recevoir les notifications en temps reel. Consultez la section [Webhooks](/webhooks/introduction) pour plus de details.

## Prochaines etapes

- [Authentification](/guide/authentification) - Comprendre le systeme de cles API
- [Environnements](/guide/environnements) - Sandbox vs Production
- [Transferts](/transferts/introduction) - Envoyer de l'argent
- [Checkout](/checkout/introduction) - Page de paiement hebergee
