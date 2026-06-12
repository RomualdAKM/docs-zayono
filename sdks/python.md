# Python SDK <span class="zd-tag stable">Stable</span>

SDK Python officiel. Type hints complets, support sync + async (asyncio), compatible Django / Flask / FastAPI.

- **Package** : [`zayono`](https://pypi.org/project/zayono) sur PyPI
- **Source** : [github.com/RomualdAKM/sdks-zayono](https://github.com/RomualdAKM/sdks-zayono/tree/main/zayono-python)
- **License** : MIT
- **Python** : 3.9+
- **HTTP** : httpx (sync + async)

## Installation

```bash
pip install zayono
```

Ou avec [Poetry](https://python-poetry.org/) :

```bash
poetry add zayono
```

## Configuration

```python
import os
from zayono import Zayono

client = Zayono(api_key=os.environ["ZAYONO_API_KEY"])
```

Options avancées :

```python
client = Zayono(
    api_key=os.environ["ZAYONO_API_KEY"],
    base_url="https://backend.zayono.com/api/v1",  # défaut
    timeout=30.0,                                   # secondes, défaut 30
    max_retries=3,                                  # défaut 3
)
```

## Initialiser un paiement

```python
payment = client.payments.create(
    amount=5000,
    currency="XOF",
    description="T-shirt premium",
    return_url="https://votre-site.com/success",
    customer={
        "email": "customer@example.com",
        "first_name": "Jean",
        "last_name": "Dupont",
        "phone": "+22990123456",
    },
    operator="mtn_bj",
    metadata={"order_id": "ORD-12345"},
)

print(payment["checkout_url"])
# → https://app.zayono.com/checkout/abc123...
```

## Vérifier un paiement

```python
payment = client.payments.retrieve("019e5eaf-cb99-7351-a6d5-c219e28534db")

if payment["status"] == "success":
    # Le paiement est confirmé. Livrez la commande.
    pass
```

## Initialiser un transfert

```python
payout = client.payouts.create(
    amount=10000,
    currency="XOF",
    operator="mtn_bj",
    description="Versement commande ORD-12345",
    recipient={
        "phone": "+22961000000",
        "first_name": "Adèle",
        "last_name": "Akpovi",
    },
)
```

::: warning Remboursements
Les remboursements seront ajoutés au SDK quand l'endpoint `/v1/payments/{id}/refunds` sera exposé sur la surface API key. Pour l'instant, utilisez le dashboard.
:::

## Vérifier une signature webhook

### Django

```python
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from zayono import Zayono
import json
import os

client = Zayono(api_key=os.environ["ZAYONO_API_KEY"])

@csrf_exempt
@require_POST
def webhook(request):
    signature = request.META.get("HTTP_X_ZAYONO_SIGNATURE", "")
    if not client.webhooks.verify(
        request.body, signature, os.environ["ZAYONO_WEBHOOK_SECRET"]
    ):
        return HttpResponseBadRequest("Invalid signature")

    event = json.loads(request.body)
    # ... traiter l'événement
    return HttpResponse(status=200)
```

### FastAPI

```python
from fastapi import FastAPI, Request, HTTPException
from zayono import Zayono
import os

app = FastAPI()
client = Zayono(api_key=os.environ["ZAYONO_API_KEY"])

@app.post("/webhook")
async def webhook(request: Request):
    body = await request.body()  # bytes RAW, pas request.json()
    signature = request.headers.get("x-zayono-signature", "")
    if not client.webhooks.verify(
        body, signature, os.environ["ZAYONO_WEBHOOK_SECRET"]
    ):
        raise HTTPException(401, "Invalid signature")

    event = await request.json()
    # ... traiter l'événement
    return {"received": True}
```

## Mode asynchrone

Pour les frameworks async (FastAPI, Starlette, etc.) le SDK expose un client `asyncio` natif :

```python
import asyncio
from zayono import AsyncZayono

async def main():
    async with AsyncZayono(api_key="zyn_test_xxxxx") as client:
        payment = await client.payments.create(
            amount=5000,
            currency="XOF",
            description="Test",
            return_url="https://example.com/success",
            customer={
                "email": "c@example.com",
                "first_name": "Test",
                "last_name": "User",
            },
            operator="mtn_bj",
        )
        print(payment["checkout_url"])

asyncio.run(main())
```

## Pagination

::: warning Listing paiements / payouts non exposé sur v1
L'endpoint `GET /v1/payments` (et `GET /v1/payouts`) n'est pas encore exposé sur la surface API key. Seules les méthodes unitaires (`retrieve`, `verify`) sont disponibles. La pagination sera ajoutée au SDK quand ces endpoints seront exposés. En attendant, consultez l'historique depuis le [dashboard Zayono](https://app.zayono.com).
:::

Pour les **clients**, `GET /v1/customers` est exposé — itérateur sync, pagine automatiquement :

```python
for customer in client.customers.list(country="BJ"):
    print(customer["id"])
```

Version async :

```python
async for customer in client.customers.list(country="BJ"):
    print(customer["id"])
```

## Gestion des erreurs

```python
from zayono.exceptions import (
    ValidationError, AuthenticationError, RateLimitError,
)

try:
    payment = client.payments.create(amount=-1, currency="XOF", ...)
except ValidationError as e:
    # 422 — e.errors est un dict {field: [messages]}
    for field, msgs in e.errors.items():
        print(f"{field}: {', '.join(msgs)}")
except AuthenticationError:
    # 401
    pass
except RateLimitError as e:
    # 429 — e.retry_after en secondes
    pass
```

## Type hints

Le SDK est typé inline (`py.typed`). Les ressources retournent des `dict`, et `zayono.types` expose des `TypedDict` pour annoter vos fonctions. mypy + pyright + Pylance détectent les erreurs avant runtime :

```python
from zayono.types import Payment

def process(p: Payment) -> None:
    if p["status"] == "success":
        ...
```

`PaymentStatus` est un `Literal["initiated", "pending", "success", "failed", "cancelled", "refunded"]`, utilisable pour annoter vos propres signatures.

## Compatibilité

| Version Python | Statut |
|---|---|
| 3.9 | ✅ Supporté |
| 3.10 | ✅ Recommandé |
| 3.11 | ✅ Recommandé |
| 3.12 | ✅ Recommandé |
| 3.13 | ✅ Supporté |

## Référence complète

- [`Zayono`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/src/zayono/client.py) — client sync
- [`AsyncZayono`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/src/zayono/async_client.py) — client async
- [`payments`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/docs/payments.md)
- [`payouts`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/docs/payouts.md)
- [`customers`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/docs/customers.md)
- [`webhooks`](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/docs/webhooks.md)
- [Types](https://github.com/RomualdAKM/sdks-zayono/blob/main/zayono-python/src/zayono/types.py)
