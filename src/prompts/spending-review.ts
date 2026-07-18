import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerSpendingReview(server: McpServer) {
  server.prompt(
    'spending-review',
    'Guide for finding savings opportunities in your spending.',
    {
      focus: z
        .string()
        .optional()
        .describe(
          'Optional spending category to focus on (e.g. subscriptions, dining, shopping, entertainment, groceries)'
        ),
    },
    async (args) => {
      const focusContext = args.focus
        ? `\n\nThe user wants to focus specifically on **${args.focus}** spending. Prioritize insights about this category.`
        : '';

      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `You are helping a user review their spending and find ways to save money with Shelter.${focusContext}

## Step 1: Get financial context
Use the \`shelter_context\` tool to understand the user's overall financial situation.

## Step 2: Find opportunities
Use the \`shelter_opportunities\` tool to identify specific savings — unused subscriptions, negotiable bills, spending patterns.

## Step 3: Get targeted advice
Use the \`shelter_coach_advice\` tool with the most relevant topic (subscriptions, bills, savings, or negotiation) to get actionable advice.

## Step 4: Present findings
Summarize the review:
- Total potential monthly savings only when the tool returns an authoritative total
- Top specific actions; include amounts only when each amount is authoritative
- Quick wins vs. longer-term optimizations
- Any spending patterns worth monitoring

Never add, normalize, estimate, or invent an amount. If a tool authority is suppressed, say the current financial result is unavailable.`,
            },
          },
        ],
      };
    }
  );
}
