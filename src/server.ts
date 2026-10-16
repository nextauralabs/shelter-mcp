import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createEnvClient, type ShelterApiClient } from './client.js';
import { registerTools } from './tools/index.js';
import { registerPrompts } from './prompts/index.js';

export const SERVER_VERSION = '1.1.0';

export interface ShelterMcpServerOptions {
  /** API client for this server. Defaults to the SHELTER_API_KEY environment client. */
  client?: ShelterApiClient;
}

export function createShelterMcpServer(options: ShelterMcpServerOptions = {}): McpServer {
  const server = new McpServer({
    name: 'shelter',
    version: SERVER_VERSION,
  });

  registerTools(server, options.client ?? createEnvClient());
  registerPrompts(server);

  return server;
}
