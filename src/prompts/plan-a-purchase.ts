import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPlanAPurchase(server: McpServer) {
  server.prompt(
    'plan-a-purchase',
    'Evaluate whether you can afford a purchase and understand the financial impact.',
    {
      item: z.string().optional().describe('What you want to buy (e.g. "new laptop", "weekend trip")'),
      amount: z.string().optional().describe('How much it costs in dollars (e.g. "500", "1200")'),
      currency: z.string().regex(/^[A-Z]{3}$/).optional().describe('Uppercase ISO currency code, such as CAD or USD'),
    },
    async (args) => {
      const itemContext = args.item ? ` for **${args.item}**` : '';
      const amountContext = args.amount ? ` costing **$${args.amount}**` : '';
      const currencyContext = args.currency ? ` in **${args.currency}**` : '';
      const hasDetails = args.item || args.amount || args.currency;

      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `You are helping a user evaluate a potential purchase${itemContext}${amountContext}${currencyContext} using Shelter.

## Step 1: Check current status
Use the \`shelter_status\` tool to see the current safe-to-spend and financial health.

## Step 2: Run affordability check
${hasDetails && args.amount && args.currency ? `Use the \`shelter_affordability\` tool with amount: ${args.amount}, currency: "${args.currency}"${args.item ? ` and description: "${args.item}"` : ''} to check the impact.` : 'Ask the user for the purchase amount, ISO currency, and description, then use the `shelter_affordability` tool to check the impact.'}

## Step 3: Check the forecast
Use the \`shelter_forecast\` tool to see if there are upcoming bills or tight spots that make this purchase riskier.

## Step 4: Provide a recommendation
Present a clear verdict:
- Can you afford it right now? (yes/no/maybe)
- Impact on safe-to-spend balance
- Upcoming bills or expenses that could conflict
- If tight: suggest a timeline for when it would be safer to buy
- Do not derive a savings timeline unless the tool returns that exact authoritative result

Only repeat authoritative tool fields. Do not invent or recompute amounts, percentages, dates, or targets.`,
            },
          },
        ],
      };
    }
  );
}
