# Environments

Zayono provides two distinct environments so you can develop and test safely before going to production.

## Sandbox vs Live

| | Sandbox | Live |
|---|---------|------|
| **Key prefix** | `zyn_test_` | `zyn_live_` |
| **Real money** | No | Yes |
| **Aggregators** | Test credentials | Production credentials |
| **Use case** | Development, testing | Production |

## How it works

The environment is **determined automatically** by the API key used:

- `zyn_test_...` key → **sandbox** environment
- `zyn_live_...` key → **live** environment

You don't need to specify the environment manually. Just use the right key.

## Data isolation

The environments are **fully isolated**:

- Sandbox transactions are not visible in live and vice versa
- Routing rules are configured separately per environment
- Aggregator configurations are separate (sandbox keys vs live keys)
- Idempotency keys are scoped per environment

## Sandbox setup

To use the sandbox:

1. Create a `secret` API key in the `sandbox` environment
2. Configure your aggregators with their **test credentials**
3. Create routing rules in the `sandbox` environment
4. Use the `zyn_test_...` key for your API calls

::: tip
Always start with the sandbox to validate your integration before going live.
:::

## Going to production

Once your integration works in sandbox:

1. Configure your aggregators with their **production credentials**
2. Create routing rules in the `live` environment
3. Create an API key in the `live` environment
4. Replace `zyn_test_...` with `zyn_live_...` in your application
