import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const RunwaySchema = z.object({
  includeBreakdown: z.boolean().optional().describe('Include a day-by-day breakdown of projected spending'),
});

export function registerRunwayTool(server: McpServer) {
  server.tool(
    'shelter_runway',
    'How many days until you run out of money — daily budget, next payday, safe-to-spend.',
    {
      includeBreakdown: RunwaySchema.shape.includeBreakdown,
    },
    {
      title: 'Cash Runway',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = RunwaySchema.parse(args);
        const params = input.includeBreakdown ? { breakdown: 'true' } : undefined;
        const result = await apiGet('/v1/runway', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get runway: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
