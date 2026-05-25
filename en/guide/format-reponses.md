# Response format

All Zayono API responses follow a **uniform JSON format**.

## Structure

```json
{
  "message": "Description of the operation",
  "data": { ... },
  "errors": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `message` | `string` | Message describing the outcome of the operation |
| `data` | `object \| null` | Returned data (null on error) |
| `errors` | `object \| null` | Validation error details (null on success) |

## Success response

```json
{
  "message": "Payment initialized successfully.",
  "data": {
    "id": "9e5f6a7b-8c9d-4e3f-a1b2-c3d4e5f6a7b8",
    "status": "initiated",
    "amount": 1000,
    "currency": "XOF",
    "created_at": "2025-05-15T10:30:00+00:00"
  },
  "errors": null
}
```

## Error response

```json
{
  "message": "Validation failed.",
  "data": null,
  "errors": {
    "amount": ["The amount field is required."],
    "currency": ["The currency must be 3 characters."]
  }
}
```

## HTTP status codes

| Code | Meaning |
|------|---------------|
| `200` | Success |
| `201` | Resource created |
| `202` | Accepted (asynchronous processing in progress) |
| `400` | Bad request |
| `401` | Not authenticated |
| `403` | Forbidden (account suspended) |
| `404` | Resource not found |
| `409` | Conflict (duplicate, invalid state) |
| `410` | Resource expired |
| `422` | Validation error |
| `429` | Too many requests |
| `500` | Server error |
| `502` | Aggregator error |

## Conventions

- All **amounts** are decimal numbers (e.g. `1000.00`)
- All **dates** use the **ISO 8601** format (e.g. `2025-05-15T10:30:00+00:00`)
- All **identifiers** are **UUID v4**
- **Currencies** use the 3-letter **ISO 4217** format (e.g. `XOF`, `XAF`)
- **Countries** use the **ISO 3166-1 alpha-2** format (e.g. `BJ`, `CI`)
