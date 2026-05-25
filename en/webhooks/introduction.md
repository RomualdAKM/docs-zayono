# Webhooks

Webhooks let Zayono **notify your server in real time** when a transaction's status changes.

## Principle

Instead of polling each transaction's status, you configure a URL where Zayono will send HTTP POST notifications automatically.

```
Transaction status change
        ↓
Zayono detects the change
        ↓
POST to your webhook endpoint
        ↓
Your server processes the notification
```

## Setup

1. Register a [webhook endpoint](/en/webhooks/endpoints) via the API or the dashboard
2. Choose the [events](/en/webhooks/evenements) to listen for
3. Receive a `secret` to [verify signatures](/en/webhooks/verification-signature)
4. Implement processing logic on your server

## Retry policy

If your server does not respond with a `2xx` code within 30 seconds, Zayono retries:

| Attempt | Delay |
|-----------|-------|
| 1st | Immediate |
| 2nd | ~1 minute |
| 3rd | ~5 minutes |

After 3 failed attempts, the webhook is marked as failed.

## Best practices

- **Respond quickly** with `200 OK` before running your business logic
- **Verify the signature** to authenticate the notification origin
- **Handle idempotency** — the same event can be delivered more than once
- **Log payloads** for debugging
- **Use HTTPS** for your webhook endpoint
