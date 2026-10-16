import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createShelterMcpServer, createEnvClient } from '../dist/index.js';

async function connect(server) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

test('tools call the injected client, not the environment', async () => {
  const calls = [];
  const fake = {
    async get(path, params) {
      calls.push(['GET', path, params]);
      return { path, user: 'injected' };
    },
    async post(path, body) {
      calls.push(['POST', path, body]);
      return { path, user: 'injected' };
    },
  };
  const client = await connect(createShelterMcpServer({ client: fake }));

  const status = await client.callTool({ name: 'shelter_status', arguments: { refresh: true } });
  assert.equal(status.isError, undefined);
  assert.deepEqual(JSON.parse(status.content[0].text), { path: '/v1/status', user: 'injected' });

  await client.callTool({ name: 'shelter_ask', arguments: { question: 'Can I afford rent?' } });
  assert.deepEqual(calls, [
    ['GET', '/v1/status', { refresh: 'true' }],
    ['POST', '/v1/ask', { question: 'Can I afford rent?' }],
  ]);
});

test('every tool is read-only and fully annotated', async () => {
  const client = await connect(createShelterMcpServer({ client: createEnvClient({}) }));
  const { tools } = await client.listTools();
  assert.equal(tools.length, 10);
  for (const tool of tools) {
    assert.ok(tool.annotations?.title, `${tool.name} has a title`);
    assert.equal(tool.annotations.readOnlyHint, true, `${tool.name} readOnlyHint`);
    assert.equal(tool.annotations.destructiveHint, false, `${tool.name} destructiveHint`);
    assert.equal(typeof tool.annotations.openWorldHint, 'boolean', `${tool.name} openWorldHint`);
  }
});

test('without a key, financial values fail closed', async () => {
  const client = await connect(createShelterMcpServer({ client: createEnvClient({}) }));
  const result = await client.callTool({ name: 'shelter_runway', arguments: {} });
  const body = JSON.parse(result.content[0].text);
  assert.equal(body.authority.status, 'suppressed');
  assert.equal(body.data, null);
});

test('a client error becomes a tool error, not a crash', async () => {
  const failing = {
    async get() {
      throw new Error('Shelter API 401: revoked');
    },
    async post() {
      throw new Error('Shelter API 401: revoked');
    },
  };
  const client = await connect(createShelterMcpServer({ client: failing }));
  const result = await client.callTool({ name: 'shelter_alerts', arguments: {} });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /401: revoked/);
});
