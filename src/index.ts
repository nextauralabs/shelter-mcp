/**
 * @shelter.money/mcp
 * Connect AI agents to scoped financial context from the user's own Shelter account.
 */

import { z } from 'zod';

export { createShelterMcpServer } from './server.js';
import { createShelterMcpServer } from './server.js';

/**
 * Smithery sandbox — allows Smithery to scan tools/prompts without real credentials.
 * Without a key, tool discovery works but every financial value remains suppressed.
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
    .describe('Your Shelter API key. Create one at https://shelter.money/developer'),
  apiUrl: z
    .string()
    .url()
    .default('https://api.shelter.money/agent')
    .describe('Custom API base URL. Only change this for self-hosted instances.'),
});
