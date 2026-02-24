import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerFinancialCheckup(server: McpServer) {
  server.prompt(
    'financial-checkup',
    'Step-by-step financial checkup — review status, alerts, forecast, and opportunities.',
    async () => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are helping a user do a comprehensive financial checkup with Shelter. Follow this workflow:

## Step 1: Check financial status
Use the \`shelter_status\` tool to get the current snapshot — safe-to-spend, balances, health score.

## Step 2: Review alerts
Use the \`shelter_alerts\` tool to see if there are any urgent items — unusual spending, upcoming bills, low balance warnings.

## Step 3: Examine the forecast
Use the \`shelter_forecast\` tool to see projected cash flow over the next few weeks. Identify any tight spots.

## Step 4: Check runway
Use the \`shelter_runway\` tool to see how many days of spending are covered and the daily budget.

## Step 5: Summarize
Present a clear summary:
- Overall health score and what it means
- Any alerts that need attention
- Cash runway and daily budget
- Upcoming pinch points from the forecast
- One actionable recommendation`,
          },
        },
      ],
    })
  );
}
