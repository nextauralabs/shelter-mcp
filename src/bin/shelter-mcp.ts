#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createShelterMcpServer } from '../server.js';

async function main() {
  const apiKey = process.env.SHELTER_API_KEY;

  if (!apiKey) {
    console.error('Warning: SHELTER_API_KEY not set — financial values will be suppressed.');
    console.error('');
    console.error('For real data, set SHELTER_API_KEY:');
    console.error('  SHELTER_API_KEY=sk_xxx npx @shelter.money/mcp');
    console.error('');
    console.error('Or configure in Claude Desktop:');
    console.error('  {');
    console.error('    "mcpServers": {');
    console.error('      "shelter": {');
    console.error('        "command": "npx",');
    console.error('        "args": ["-y", "@shelter.money/mcp"],');
    console.error('        "env": { "SHELTER_API_KEY": "sk_xxx" }');
    console.error('      }');
    console.error('    }');
    console.error('  }');
    console.error('');
  }

  const server = createShelterMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
