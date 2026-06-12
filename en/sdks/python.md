# Python SDK <span class="zd-tag stable">Stable</span>

Official Python SDK. Full type hints, sync + async (asyncio) support, Django / Flask / FastAPI compatible.

- **Package**: [`zayono`](https://pypi.org/project/zayono) on PyPI
- **Source**: [github.com/zayono/zayono-python](https://github.com/zayono/zayono-python)
- **License**: MIT
- **Python**: 3.9+
- **HTTP**: httpx (sync + async)

## Installation

```bash
pip install zayono
```

Or with [Poetry](https://python-poetry.org/):

```bash
poetry add zayono
```

## Configuration

```python
import os
from zayono import Zayono

client = Zayono(api_key=os.environ["ZAYONO_API_KEY"])
```

Advanced options:

```python
client = Zayono(
    api_key=os.environ["ZAYONO_API_KEY"],
    base_url="https://backend.zayono.com/api/v1",  # default
    timeout=30.0,                                   # seconds, default 30
    max_retries=3,                                  # default 3
)
```

## Initialize a payment

```python
payment = client.payments.create(
    amount=5000,
    currency="XOF",
    description="Premium T-shirt",
    return_url="https://your-site.com/success",
    customer={
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+22990123456",
    },
    operator="mtn_bj",
    metadata={"order_id": "ORD-12345"},
)

print(payment["checkout_url"])
# → https://app.zayono.com/checkout/abc123...
```

## Verify a payment

```python
payment = client.payments.retrieve("019e5eaf-cb99-7351-a6d5-c219e28534db")

if payment["status"] == "success":
    # Payment confirmed. Fulfil the order.
    pass
```

## Initialize a payout

```python
payout = client.payouts.create(
    amount=10000,
    currency="XOF",
    operator="mtn_bj",
    description="Payout for order ORD-12345",
    recipient={
        "phone": "+22961000000",
        "first_name": "Adele",
        "last_name": "Akpovi",
    },
)
```

::: warning Refunds
Refunds will be added to the SDK once the `/v1/payments/{id}/refunds` endpoint is exposed on the API key surface. For now, use the dashboard.
:::

## Verify a webhook signature

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
    # ... process the event
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
    body = await request.body()  # RAW bytes, not request.json()
    signature = request.headers.get("x-zayono-signature", "")
    if not client.webhooks.verify(
        body, signature, os.environ["ZAYONO_WEBHOOK_SECRET"]
    ):
        raise HTTPException(401, "Invalid signature")

    event = await request.json()
    # ... process the event
    return {"received": True}
```

## Async mode

For async frameworks (FastAPI, Starlette, etc.) the SDK exposes a native `asyncio` client:

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

::: warning Payment / payout listing not exposed on v1
The `GET /v1/payments` (and `GET /v1/payouts`) endpoint is not yet exposed on the API key surface. Only unit methods (`retrieve`, `verify`) are available. Pagination will be added to the SDK once those endpoints are exposed. In the meantime, check transaction history from the [Zayono dashboard](https://app.zayono.com).
:::

For **customers**, `GET /v1/customers` is exposed — sync iterator, paginates automatically:

```python
for customer in client.customers.list(country="BJ"):
    print(customer["id"])
```

Async version:

```python
async for customer in client.customers.list(country="BJ"):
    print(customer["id"])
```

## Error handling

```python
from zayono.exceptions import (
    ValidationError, AuthenticationError, RateLimitError,
)

try:
    payment = client.payments.create(amount=-1, currency="XOF", ...)
except ValidationError as e:
    # 422 — e.errors is a dict {field: [messages]}
    for field, msgs in e.errors.items():
        print(f"{field}: {', '.join(msgs)}")
except AuthenticationError:
    # 401
    pass
except RateLimitError as e:
    # 429 — e.retry_after in seconds
    pass
```

## Type hints

The SDK is typed inline (`py.typed`). Resources return `dict`s, and `zayono.types` exposes `TypedDict`s to annotate your functions. mypy + pyright + Pylance catch errors before runtime:

```python
from zayono.types import Payment

def process(p: Payment) -> None:
    if p["status"] == "success":
        ...
```

`PaymentStatus` is a `Literal["initiated", "pending", "success", "failed", "cancelled", "refunded"]`, usable to annotate your own signatures.

## Compatibility

| Python version | Status |
|---|---|
| 3.9 | Supported |
| 3.10 | Recommended |
| 3.11 | Recommended |
| 3.12 | Recommended |
| 3.13 | Supported |

## Full reference

- [`Zayono`](https://github.com/zayono/zayono-python/blob/main/docs/Zayono.md) — sync client
- [`AsyncZayono`](https://github.com/zayono/zayono-python/blob/main/docs/AsyncZayono.md) — async client
- [`payments`](https://github.com/zayono/zayono-python/blob/main/docs/payments.md)
- [`payouts`](https://github.com/zayono/zayono-python/blob/main/docs/payouts.md)
- [`customers`](https://github.com/zayono/zayono-python/blob/main/docs/customers.md)
- [`webhooks`](https://github.com/zayono/zayono-python/blob/main/docs/webhooks.md)
- [Types](https://github.com/zayono/zayono-python/blob/main/src/zayono/types.py)
