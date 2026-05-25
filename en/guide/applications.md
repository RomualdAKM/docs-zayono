# Applications and multi-application architecture

Each Zayono **merchant account** can host **multiple applications**. An application represents a distinct product, store or integration point — each with its own configuration, its own API keys and its own resources.

## Why multiple applications?

- **Isolate business environments**: one app for your e-commerce store, another for your mobile app, a third for your B2B invoices. Each app has its own statistics, checkout settings and dedicated webhooks.
- **Different configurations**: one product can route MTN BJ to PawaPay, another to FedaPay. One app can enable automatic currency conversion, another not. One app can enforce the `abidjan` template, another `cotonou`.
- **Isolate credentials**: each application has its own aggregator keys, its own webhook endpoints, its own branding (logo, brand colour, support contacts).

## Resources scoped per application

All business resources are **attached to an application**, not directly to the merchant account:

| Resource | Scope |
|-----------|-------|
| API keys | Per application |
| Routing rules | Per application + environment |
| Aggregator configurations | Per application + environment |
| Webhook endpoints | Per application |
| Transactions (payments, payouts) | Per application |
| Customers | Per application |
| Checkout sessions | Per application |
| Application settings (template, colours, conversion, notifications, etc.) | Per application |

A transaction made with an API key from application A only appears in application A listings, is only billed at application A's `fee_percent`, and only triggers webhooks configured on application A.

## Identifying the application

For the **public API** (every `/v1/*` route), identification is **implicit through the API key**. Each key is bound to exactly one application — there's nothing extra to pass in the request:

```bash
# This key points to the "online-store" application
curl https://backend.zayono.com/api/v1/payments/initialize \
  -H "Authorization: Bearer zyn_test_<online-store application key>" \
  -d '{ ... }'
```

If you manage multiple applications, **store a distinct key per application** on the integrator side (for example in separate environment variables), and call the API with the key matching the relevant flow.

::: tip
You can generate as many keys as you want per application (sandbox and live are separate). A key can be disabled at any time from the dashboard without impacting other applications.
:::

## Application list

The dashboard exposes your application list under the **Applications** menu. You can:

- **Create** a new application (name, description, enabled environments)
- **Rename** or **describe** an application
- **Disable** an application: its API keys immediately reject every request with a `403`. Handy if credentials leak — without losing transaction history.
- **Upload an icon** (shown to customers on the checkout page and in email receipts)

## What stays at the merchant account level

Three pieces of information stay attached to the parent account and are shared across all its applications:

- **Account email and password**
- **Company name** (legal entity name)
- **Zayono fee** (`zayono_fee_percent`, set by administrators)

Everything else — including notification emails, checkout support contacts, routing strategy and currency conversion — is configurable **per application**.
