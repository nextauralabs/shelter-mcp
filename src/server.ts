import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools/index.js';
import { registerPrompts } from './prompts/index.js';

export function createShelterMcpServer(): McpServer {
  const server = new McpServer({
    name: 'shelter',
    version: '1.0.7',
  });

  registerTools(server);
  registerPrompts(server);

  return server;
}
