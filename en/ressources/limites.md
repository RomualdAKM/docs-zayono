# Technical limits

Reference of the limits and constraints of the Zayono API.

## Rate limits

| Scope | Limit | Per |
|-------|--------|-----|
| API endpoints | 120 requests/min | API key |
| Authentication | 10 requests/min | IP address |
| Checkout (process) | 10 requests/min | IP address |
| Inbound webhooks | 100 requests/min | IP address |

## Content limits

| Item | Limit |
|---------|--------|
| Request body size | 1 MB |
| Pagination `per_page` max | 100 |
| Routing rules per bulk | 50 |
| Description | 255 characters |
| URL (return_url, cancel_url) | 500 characters |
| Webhook URL | 2048 characters |
| API key name | 255 characters |
| API key description | 500 characters |
| Metadata (number of keys) | No hard limit |

## Session limits

| Item | Limit |
|---------|--------|
| Checkout session expiration | 30 minutes |
| API key expiration | Configurable (optional) |

## Validation limits

| Item | Constraint |
|---------|------------|
| Minimum amount | 1 |
| Currency | 3 ISO 4217 characters |
| Country code | 2 ISO 3166-1 characters |
| Phone | 8-15 digits |
| API key format | `zyn_(live\|test)_[a-zA-Z0-9]{32}` |
| Idempotency Key | Valid UUID v4 |
| Routing priority | 1-100 |
| Merchant fees | 0-50% |

## Webhooks

| Item | Value |
|---------|--------|
| Delivery attempts | 3 max |
| Timeout per attempt | 30 seconds |
| Supported events | 6 |
| Signature method | HMAC-SHA256 |

## Aggregators

| Item | Value |
|---------|--------|
| Supported aggregators | 6 |
| Credential encryption | AES-256 |
| Credentials per aggregator/env | 1 max |
