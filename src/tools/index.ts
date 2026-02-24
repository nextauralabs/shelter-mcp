import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerStatusTool } from './status.js';
import { registerRunwayTool } from './runway.js';
import { registerForecastTool } from './forecast.js';
import { registerAlertsTool } from './alerts.js';
import { registerOpportunitiesTool } from './opportunities.js';
import { registerContextTool } from './context.js';
import { registerAffordabilityTool } from './affordability.js';
import { registerCoachTools } from './coach.js';
import { registerAskTool } from './ask.js';

export function registerTools(server: McpServer) {
  registerStatusTool(server);
  registerRunwayTool(server);
  registerForecastTool(server);
  registerAlertsTool(server);
  registerOpportunitiesTool(server);
  registerContextTool(server);
  registerAffordabilityTool(server);
  registerCoachTools(server);
  registerAskTool(server);
}
