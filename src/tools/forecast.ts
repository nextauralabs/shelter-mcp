import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const ForecastSchema = z.object({
  days: z.literal(14).optional().describe('Verified 14-day view of the canonical 30-day run'),
});

export function registerForecastTool(server: McpServer) {
  server.tool(
    'shelter_forecast',
    'Verified 14-day view of Shelter\'s canonical 30-day balance forecast.',
    {
      days: ForecastSchema.shape.days,
    },
    {
      title: 'Cash Forecast',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = ForecastSchema.parse(args);
        const params = input.days ? { days: String(input.days) } : undefined;
        const result = await apiGet('/v1/forecast', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get forecast: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
