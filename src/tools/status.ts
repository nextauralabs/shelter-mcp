import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const StatusSchema = z.object({
  refresh: z.boolean().optional().describe('Force a fresh calculation instead of using cached data'),
});

export function registerStatusTool(server: McpServer) {
  server.tool(
    'shelter_status',
    'Get a snapshot of your financial status — safe-to-spend, balances, upcoming bills, health score.',
    {
      refresh: StatusSchema.shape.refresh,
    },
    {
      title: 'Financial Status',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = StatusSchema.parse(args);
        const params = input.refresh ? { refresh: 'true' } : undefined;
        const result = await apiGet('/v1/status', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
