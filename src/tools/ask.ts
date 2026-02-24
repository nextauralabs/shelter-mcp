import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiPost } from '../client.js';

const AskSchema = z.object({
  question: z.string().min(1).describe('A natural-language question about your finances'),
});

export function registerAskTool(server: McpServer) {
  server.tool(
    'shelter_ask',
    'Ask Guardian AI any question about your finances — spending, bills, trends, or advice.',
    {
      question: AskSchema.shape.question,
    },
    {
      title: 'Ask Guardian AI',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = AskSchema.parse(args);
        const result = await apiPost('/v1/ask', { question: input.question });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Ask failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
