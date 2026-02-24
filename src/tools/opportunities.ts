import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const OpportunitiesSchema = z.object({
  category: z.enum(['subscriptions', 'bills', 'spending', 'negotiation']).optional().describe('Filter opportunities by category'),
});

export function registerOpportunitiesTool(server: McpServer) {
  server.tool(
    'shelter_opportunities',
    'Find savings opportunities — unused subscriptions, negotiable bills, spending patterns to optimize.',
    {
      category: OpportunitiesSchema.shape.category,
    },
    {
      title: 'Savings Opportunities',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = OpportunitiesSchema.parse(args);
        const params = input.category ? { category: input.category } : undefined;
        const result = await apiGet('/v1/opportunities', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get opportunities: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
