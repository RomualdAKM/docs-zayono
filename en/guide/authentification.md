# Authentication

The Zayono API uses **API keys** to authenticate requests. Each key is bound to an **application** (not to the parent merchant account) and to a specific environment. See [Applications](/en/guide/applications) if you manage multiple products under the same account.

## Key format

API keys follow this format:

```
zyn_{environment}_{32 alphanumeric characters}
```

| Prefix | Environment | Usage |
|---------|---------------|-------|
| `zyn_test_` | Sandbox | Development and testing |
| `zyn_live_` | Production | Real transactions |

## Usage

Include your API key in the `Authorization` header on every request:

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

## Key types

| Type | Description |
|------|-------------|
| `secret` | Secret key for server-to-server calls. **Never expose this client-side.** |
| `public` | Public key for client-side operations (limited usage). |

## Key management

You can manage your API keys from the Zayono dashboard:

- **Create** a new key (the full key is shown only once)
- **Disable** an existing key
- **Delete** a key
- **Set an optional expiry**

## Security

::: danger Important
- **Never** commit your API keys to source control
- Use **environment variables** to store your keys
- Use `zyn_test_` keys for development and `zyn_live_` keys for production
- If a key is compromised, disable it immediately from the dashboard
:::

## Authentication errors

If the key is invalid, expired or missing, the API returns:

```json
{
  "message": "Invalid or missing API key.",
  "data": null,
  "errors": null
}
```

**HTTP status:** `401 Unauthorized`
