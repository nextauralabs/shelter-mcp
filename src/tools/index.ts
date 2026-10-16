import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ShelterApiClient } from '../client.js';
import { registerStatusTool } from './status.js';
import { registerRunwayTool } from './runway.js';
import { registerForecastTool } from './forecast.js';
import { registerAlertsTool } from './alerts.js';
import { registerOpportunitiesTool } from './opportunities.js';
import { registerContextTool } from './context.js';
import { registerAffordabilityTool } from './affordability.js';
import { registerCoachTools } from './coach.js';
import { registerAskTool } from './ask.js';

export function registerTools(server: McpServer, client: ShelterApiClient) {
  registerStatusTool(server, client);
  registerRunwayTool(server, client);
  registerForecastTool(server, client);
  registerAlertsTool(server, client);
  registerOpportunitiesTool(server, client);
  registerContextTool(server, client);
  registerAffordabilityTool(server, client);
  registerCoachTools(server, client);
  registerAskTool(server, client);
}
