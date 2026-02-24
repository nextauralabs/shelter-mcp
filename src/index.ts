/**
 * @shelter.money/mcp
 * MCP server for Shelter — AI financial coaching powered by real bank data
 */

import { z } from 'zod';

export { createShelterMcpServer } from './server.js';
import { createShelterMcpServer } from './server.js';

/**
 * Smithery sandbox — allows Smithery to scan tools/prompts without real credentials.
 * Our server already runs in demo mode when no API key is set.
 */
export function createSandboxServer() {
  return createShelterMcpServer();
}

/** Default export for Smithery shttp runtime */
export default createSandboxServer;

/**
 * Smithery configSchema — exported as a Zod object so the Smithery CLI
 * can auto-generate a JSON Schema during `smithery deploy`.
 */
export const configSchema = z.object({
  shelterApiKey: z
    .string()
    .describe(
      'Your Shelter API key. Get one at https://shelter.money'
    ),
  apiUrl: z
    .string()
    .url()
    .default('https://api.shelter.money/agent')
    .describe('Custom API base URL. Only change this for self-hosted instances.'),
});
