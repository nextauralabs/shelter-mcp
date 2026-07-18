import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiPost } from '../client.js';

const AffordabilitySchema = z.object({
  amount: z.number().finite().positive().describe('The major-unit amount of the purchase or expense'),
  currency: z.string().regex(/^[A-Z]{3}$/).describe('Uppercase ISO 4217 currency code, such as CAD or USD'),
  description: z.string().min(1).describe('What the purchase or expense is for'),
});

export function registerAffordabilityTool(server: McpServer) {
  server.tool(
    'shelter_affordability',
    'Check if you can afford a specific purchase — impact on safe-to-spend, recommendation.',
    {
      amount: AffordabilitySchema.shape.amount,
      currency: AffordabilitySchema.shape.currency,
      description: AffordabilitySchema.shape.description,
    },
    {
      title: 'Affordability Check',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = AffordabilitySchema.parse(args);
        const result = await apiPost('/v1/affordability', input);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Affordability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
