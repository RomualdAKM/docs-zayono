# Rate limits

The Zayono API applies rate limits to guarantee stability and fair usage.

## Default limits

| Request type | Limit | Scope |
|-----------------|--------|-------|
| API endpoints (API key) | **120 requests / minute** | Per API key |
| Authentication (login) | **10 requests / minute** | Per IP address |
| Checkout (processing) | **10 requests / minute** | Per IP address |
| Inbound webhooks | **100 requests / minute** | Per IP address |

## Response when exceeded

When the limit is reached, the API returns:

**HTTP status:** `429 Too Many Requests`

```json
{
  "message": "Too Many Attempts.",
  "data": null,
  "errors": null
}
```

## Best practices

### Exponential backoff

On a 429 response, wait before retrying:

```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options)

    if (response.status !== 429) {
      return response
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, attempt) * 1000
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  throw new Error('Rate limit exceeded after retries')
}
```

### Optimise your calls

- **Avoid excessive polling**: use [webhooks](/en/webhooks/introduction) to be notified of status changes
- **Cache** responses that rarely change (methods, operators, exchange rates)
- **Batch operations** when possible (e.g. bulk routing rules)
