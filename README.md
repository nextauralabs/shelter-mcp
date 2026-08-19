# Shelter MCP Server

Connect Claude, Codex, Cursor, and other MCP-compatible agents to scoped financial context from your own [Shelter](https://shelter.money) account.

The server is read-only. It can retrieve forecasts, runway, alerts, opportunities, and affordability guidance, but it cannot move money or access Plaid credentials.

## Requirements

- Node.js 20 or newer
- A Shelter account with connected financial data
- A scoped API key from [shelter.money/developer](https://shelter.money/developer)

No Plaid developer account is required.

## Quick start

Create an API key, then configure your MCP client to run:

```bash
npx -y @shelter.money/mcp
```

with `SHELTER_API_KEY` in the server environment.

### Claude Desktop

```json
{
  "mcpServers": {
    "shelter": {
      "command": "npx",
      "args": ["-y", "@shelter.money/mcp"],
      "env": {
        "SHELTER_API_KEY": "wv_your_key_here"
      }
    }
  }
}
```

Restart Claude Desktop after saving its configuration.

### Codex

```bash
codex mcp add shelter --env SHELTER_API_KEY=wv_your_key_here -- npx -y @shelter.money/mcp
```
### Cursor

Add this server to Cursor's MCP settings:

```json
{
  "shelter": {
    "command": "npx",
    "args": ["-y", "@shelter.money/mcp"],
    "env": {
      "SHELTER_API_KEY": "wv_your_key_here"
    }
  }
}
```

## Available tools

- `shelter_status` — connection and authority status
- `shelter_runway` — safe-to-spend runway and upcoming pressure
- `shelter_forecast` — manifest-bound cash-flow forecast
- `shelter_alerts` — current financial alerts
- `shelter_opportunities` — actionable savings opportunities
- `shelter_context` — scoped financial context for agent reasoning
- `shelter_affordability` — purchase affordability simulation
- `shelter_coach_daily` — daily coaching summary
- `shelter_coach_advice` — coaching for a requested topic
- `shelter_ask` — ask Guardian a financial question

The package also provides financial checkup, spending review, and purchase-planning prompts.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `SHELTER_API_KEY` | Yes | Scoped key created in Shelter. Keep it secret. |
| `SHELTER_API_URL` | No | API base URL. Defaults to `https://api.shelter.money/agent`. |
| `PORT` | HTTP mode only | Local HTTP port. Defaults to `3100`. |

If `SHELTER_API_KEY` is missing, the server still exposes its tool definitions but returns suppressed responses with no financial values. It never substitutes sample money data for a user's real financial state.
## Security model

- End-user identity comes only from the scoped Shelter API key.
- Keys are stored by Shelter as SHA-256 hashes and shown only once when created.
- Keys can be scoped and revoked from the Shelter developer page.
- The hosted Agent API applies authentication, authorization, rate limits, and audit logging.
- The MCP package does not contain Shelter backend code, deployment secrets, Plaid tokens, or bank credentials.
- Financial responses fail closed when authoritative data is unavailable.

Treat the API key like a password. Do not commit it or place it directly in command history on shared machines. See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## Development

```bash
npm ci
npm run typecheck
npm run build
```

Run the stdio server from the built package:

```bash
SHELTER_API_KEY=wv_your_key_here node dist/bin/shelter-mcp.js
```

A stateless Streamable HTTP entrypoint is also built for controlled hosting:

```bash
SHELTER_API_KEY=wv_your_key_here npm start
```

The HTTP entrypoint binds to `0.0.0.0` and is not the recommended personal-client setup. Use stdio unless you operate and secure the HTTP environment yourself.

## Architecture

This public repository contains only the MCP adapter. It calls Shelter's hosted, read-only Agent API. Shelter's private financial calculations, authentication gateway, database schema, and service credentials are not part of this package.

## License

[MIT](LICENSE)
