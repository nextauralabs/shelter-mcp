import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const DailySchema = z.object({
  category: z.enum(['spending', 'saving', 'debt', 'general']).optional().describe('Focus area for today\'s tip'),
});

const AdviceTopicSchema = z.object({
  topic: z
    .enum(['debt', 'savings', 'bills', 'subscriptions', 'negotiation', 'general'])
    .describe('The financial topic to get advice on'),
});

export function registerCoachTools(server: McpServer) {
  server.tool(
    'shelter_coach_daily',
    'Get today\'s personalized financial coaching tip based on your recent spending.',
    {
      category: DailySchema.shape.category,
    },
    {
      title: 'Daily Coach Tip',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = DailySchema.parse(args);
        const params = input.category ? { category: input.category } : undefined;
        const result = await apiGet('/v1/coach/daily', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get daily tip: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'shelter_coach_advice',
    'Get targeted financial advice on a specific topic — debt, savings, bills, subscriptions, or negotiation.',
    {
      topic: AdviceTopicSchema.shape.topic,
    },
    {
      title: 'Coach Advice',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = AdviceTopicSchema.parse(args);
        const result = await apiGet('/v1/coach/advice', { topic: input.topic });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get advice: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
