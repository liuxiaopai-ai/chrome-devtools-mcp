// Minimal Node client using the official MCP TypeScript SDK.
//
// Usage:
//   node examples/minimal-node-client.mjs
//
// This will:
// 1) spawn `npx chrome-devtools-mcp@latest`
// 2) connect via MCP stdio transport
// 3) list available tools as a smoke check
//
// For SDK details, see:
// https://modelcontextprotocol.io/docs/develop/build-client#typescript

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'npx',
  args: ['--yes', 'chrome-devtools-mcp@latest'],
  env: {
    ...process.env,
    CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS: 'true',
  },
  stderr: 'inherit',
});

const client = new Client(
  { name: 'minimal-node-client', version: '0.0.0' },
  { capabilities: {} },
);

try {
  await client.connect(transport);

  const { tools } = await client.listTools();
  console.log(`Connected to chrome-devtools-mcp. Found ${tools.length} tools.`);

  for (const tool of tools.slice(0, 10)) {
    console.log(`- ${tool.name}`);
  }
} finally {
  await transport.close();
}
