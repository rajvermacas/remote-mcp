import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

// Advanced integration testing using latest MCP client patterns
describe('MCP Server Integration Tests - End-to-End Validation', () => {
  let client: Client;
  let serverProcess: ChildProcess;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    // Start the server process with modern spawn patterns
    const serverPath = path.join(__dirname, '../../dist/server/stdio-server.js');
    serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' }
    });

    // Create client transport with latest SDK patterns
    transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath],
      env: { NODE_ENV: 'test' }
    });

    client = new Client({
      name: 'integration-test-client',
      version: '1.0.0'
    });

    await client.connect(transport);
  }, 15000);

  afterAll(async () => {
    if (client) {
      await client.close();
    }
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  });

  describe('Server Capabilities Discovery', () => {
    test('should list all expected calculator tools', async () => {
      const tools = await client.listTools();
      
      expect(tools.tools).toHaveLength(6);
      
      const toolNames = tools.tools.map(tool => tool.name);
      expect(toolNames).toContain('add');
      expect(toolNames).toContain('subtract');
      expect(toolNames).toContain('multiply');
      expect(toolNames).toContain('divide');
      expect(toolNames).toContain('power');
      expect(toolNames).toContain('sqrt');
    });    
    test('should validate tool schemas and metadata', async () => {
      const tools = await client.listTools();
      
      tools.tools.forEach(tool => {
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      });
    });
  });

  describe('Real-Time Calculator Operations', () => {
    test('should execute addition operations with full client-server communication', async () => {
      const result = await client.callTool({
        name: 'add',
        arguments: { a: 10, b: 5 }
      });

      const response = JSON.parse(result.content[0].text);
      expect(response.result).toBe(15);
      expect(response.operation).toBe('addition');
      expect(response.inputs).toEqual({ a: 10, b: 5 });
      expect(result.isError).toBeFalsy();
    });

    test('should handle complex mathematical sequences', async () => {
      // Test sequential operations to validate server state management
      const operations = [
        { name: 'power', args: { base: 2, exponent: 4 }, expected: 16 },
        { name: 'sqrt', args: { value: 16 }, expected: 4 },
        { name: 'multiply', args: { a: 4, b: 3 }, expected: 12 },
        { name: 'divide', args: { a: 12, b: 4 }, expected: 3 }
      ];

      for (const op of operations) {
        const result = await client.callTool({
          name: op.name,
          arguments: op.args
        });
        
        const response = JSON.parse(result.content[0].text);
        expect(response.result).toBe(op.expected);
        expect(result.isError).toBeFalsy();
      }
    });  });

  describe('Resource Management and Health Monitoring', () => {
    test('should provide accessible health resources', async () => {
      const resources = await client.listResources();
      expect(resources.resources).toHaveLength(1);
      expect(resources.resources[0].name).toBe('health');
      expect(resources.resources[0].mimeType).toBe('application/json');
    });

    test('should return comprehensive health status information', async () => {
      const health = await client.readResource({
        uri: 'health://status'
      });

      const healthData = JSON.parse(health.contents[0].text);
      expect(healthData.status).toBe('healthy');
      expect(healthData.timestamp).toBeDefined();
      expect(healthData.uptime).toBeGreaterThan(0);
      expect(healthData.memoryUsage).toBeDefined();
      expect(healthData.availableTools).toHaveLength(6);
      expect(healthData.version).toBe('1.0.0');
      expect(healthData.nodeVersion).toBe(process.version);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle invalid tool names gracefully', async () => {
      await expect(client.callTool({
        name: 'nonexistent-tool',
        arguments: { a: 1, b: 2 }
      })).rejects.toThrow();
    });

    test('should validate input parameters correctly', async () => {
      await expect(client.callTool({
        name: 'add',
        arguments: { a: 'invalid', b: 2 }
      })).rejects.toThrow();
    });
  });
});