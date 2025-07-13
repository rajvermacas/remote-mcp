import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCalculatorTools } from './tools/calculator.js';
import { logger } from '../utils/logger.js';

// Factory function using latest MCP server patterns
export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'advanced-calculator-server',
    version: '1.0.0',
    description: 'Production-ready MCP Calculator Server with comprehensive arithmetic operations'
  });

  // Register calculator tools using modern patterns
  registerCalculatorTools(server);

  // Advanced health check resource with comprehensive metrics
  server.registerResource(
    'health',
    'health://status',
    {
      title: 'Server Health Status',
      description: 'Current health and status information of the calculator server',
      mimeType: 'application/json'
    },
    async (uri) => {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        version: '1.0.0',
        availableTools: ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'],
        nodeVersion: process.version,
        platform: process.platform
      };

      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify(healthStatus, null, 2),
          mimeType: 'application/json'
        }]
      };
    }
  );

  logger.info('MCP Server created with advanced calculator tools and health monitoring');
  return server;
}