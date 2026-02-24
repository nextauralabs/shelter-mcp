import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const ContextSchema = z.object({
  detail: z.enum(['summary', 'full']).optional().describe('Level of detail — "summary" for a brief overview, "full" for comprehensive context'),
});

export function registerContextTool(server: McpServer) {
  server.tool(
    'shelter_context',
    'Get a natural-language summary of the user\'s financial situation for use as conversation context.',
    {
      detail: ContextSchema.shape.detail,
    },
    {
      title: 'Financial Context',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = ContextSchema.parse(args);
        const params = input.detail ? { detail: input.detail } : undefined;
        const result = await apiGet('/v1/context', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get context: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
