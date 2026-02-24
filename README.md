# @shelter.money/mcp

MCP server for [Shelter](https://shelter.money) — AI financial coaching powered by real bank data.

Works with Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.

## Quick Start

```bash
SHELTER_API_KEY=sk_xxx npx @shelter.money/mcp
```

No API key? It runs in **demo mode** with sample data so you can try it out.

## Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shelter": {
      "command": "npx",
      "args": ["-y", "@shelter.money/mcp"],
      "env": {
        "SHELTER_API_KEY": "sk_xxx"
      }
    }
  }
}
```

## Cursor / Windsurf

Add to your MCP settings:

```json
{
  "shelter": {
    "command": "npx",
    "args": ["-y", "@shelter.money/mcp"],
    "env": {
      "SHELTER_API_KEY": "sk_xxx"
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `shelter_status` | Financial snapshot — safe-to-spend, balances, health score |
| `shelter_runway` | Days until you run out of money, daily budget |
| `shelter_forecast` | Projected cash flow over the next few weeks |
| `shelter_alerts` | Unusual spending, upcoming bills, low balance warnings |
| `shelter_opportunities` | Savings opportunities — unused subscriptions, negotiable bills |
| `shelter_context` | Natural-language summary of your financial situation |
| `shelter_affordability` | Check if you can afford a purchase and see the impact |
| `shelter_coach_daily` | Today's personalized financial coaching tip |
| `shelter_coach_advice` | Targeted advice on debt, savings, bills, subscriptions, or negotiation |
| `shelter_ask` | Ask Guardian AI any question about your finances |

## Prompts

| Prompt | Description |
|--------|-------------|
| `financial-checkup` | Step-by-step review of status, alerts, forecast, and runway |
| `spending-review` | Find savings opportunities with optional category focus |
| `plan-a-purchase` | Evaluate if you can afford something and understand the impact |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SHELTER_API_KEY` | No | Your Shelter API key. Runs in demo mode without one. |
| `SHELTER_API_URL` | No | Custom API base URL (default: `https://api.shelter.money/agent`) |

## Programmatic Usage

```typescript
import { createShelterMcpServer } from '@shelter.money/mcp';

const server = createShelterMcpServer();
```

## License

MIT
