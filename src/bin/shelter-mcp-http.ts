#!/usr/bin/env node
import { createServer } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createShelterMcpServer } from '../server.js';

const PORT = parseInt(process.env.PORT || '3100', 10);

const httpServer = createServer(async (req, res) => {
  // CORS headers for Smithery and other remote clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, mcp-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // MCP endpoint — stateless: new server + transport per request
  if (req.url === '/mcp' || req.url === '/') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed. Use POST.' }, id: null }));
      return;
    }

    // Read body
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString());

    const mcpServer = createShelterMcpServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    try {
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, body);
      res.on('close', () => {
        transport.close();
        mcpServer.close();
      });
    } catch (error) {
      console.error('MCP request failed:', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null }));
      }
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found. POST to /mcp' }));
});

httpServer.listen(PORT, () => {
  console.error(`Shelter MCP server listening on http://0.0.0.0:${PORT}/mcp`);
  if (!process.env.SHELTER_API_KEY) {
    console.error('Warning: SHELTER_API_KEY not set — running in demo mode');
  }
});
