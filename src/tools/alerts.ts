import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiGet } from '../client.js';

const AlertsSchema = z.object({
  severity: z.enum(['info', 'warning', 'critical']).optional().describe('Filter alerts by severity level'),
});

export function registerAlertsTool(server: McpServer) {
  server.tool(
    'shelter_alerts',
    'Get active financial alerts — unusual spending, upcoming bills, low balance warnings.',
    {
      severity: AlertsSchema.shape.severity,
    },
    {
      title: 'Financial Alerts',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    async (args) => {
      try {
        const input = AlertsSchema.parse(args);
        const params = input.severity ? { severity: input.severity } : undefined;
        const result = await apiGet('/v1/alerts', params);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to get alerts: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
