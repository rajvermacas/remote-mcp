import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { logger } from '../utils/logger.js';

// Advanced client implementation showcasing latest MCP patterns
class AdvancedMcpClient {
  private client: Client;
  private transport!: StdioClientTransport | StreamableHTTPClientTransport | SSEClientTransport;

  constructor(
    private clientName: string = 'advanced-calculator-client',
    private version: string = '1.0.0'
  ) {
    this.client = new Client({
      name: this.clientName,
      version: this.version
    });
  }

  // Modern connection with fallback strategy using latest transport patterns
  async connectWithFallback(serverUrl?: string): Promise<void> {
    if (serverUrl) {
      try {
        // Try latest Streamable HTTP first (protocol 2025-03-26)
        this.transport = new StreamableHTTPClientTransport(new URL(serverUrl));
        await this.client.connect(this.transport);
        logger.info('Connected using Streamable HTTP transport');
        return;
      } catch (error) {
        logger.warn('Streamable HTTP failed, falling back to SSE', { error });
        
        try {
          // Fallback to SSE for backwards compatibility
          this.transport = new SSEClientTransport(new URL(serverUrl));
          await this.client.connect(this.transport);
          logger.info('Connected using SSE transport fallback');
          return;
        } catch (sseError) {
          logger.error('Both HTTP transports failed', { error: sseError });
          throw sseError;
        }
      }
    } else {
      // Stdio transport for local development
      this.transport = new StdioClientTransport({
        command: 'node',
        args: ['dist/server/stdio-server.js']
      });
      await this.client.connect(this.transport);
      logger.info('Connected using stdio transport');
    }
  }
  // Advanced calculator operations showcase using latest client patterns
  async performCalculations(): Promise<void> {
    try {
      logger.info('Starting calculator demonstrations with advanced MCP patterns');

      // List available tools using modern client API
      const tools = await this.client.listTools();
      logger.info('Available calculator tools:', { 
        tools: tools.tools.map(t => ({ name: t.name, description: t.description }))
      });

      // Advanced arithmetic operations with comprehensive error handling
      const operations = [
        { tool: 'add', args: { a: 15, b: 25 }, description: 'Basic addition' },
        { tool: 'subtract', args: { a: 100, b: 37 }, description: 'Subtraction operation' },
        { tool: 'multiply', args: { a: 12, b: 8 }, description: 'Multiplication example' },
        { tool: 'divide', args: { a: 144, b: 12 }, description: 'Division calculation' },
        { tool: 'power', args: { base: 2, exponent: 10 }, description: 'Power calculation' },
        { tool: 'sqrt', args: { value: 256 }, description: 'Square root operation' }
      ];

      for (const operation of operations) {
        try {
          logger.info(`Executing ${operation.description}...`);
          const result = await this.client.callTool({
            name: operation.tool,
            arguments: operation.args
          });

          const content = (result as any).content[0];
          const response = JSON.parse(content.text);
          logger.info(`${operation.description} result:`, {
            operation: response.operation,
            inputs: response.inputs,
            result: response.result
          });

        } catch (error) {
          logger.error(`Error in ${operation.description}:`, { error });
        }
      }
    } catch (error) {
      logger.error('Error during calculator operations:', { error });
      throw error;
    }
  }
  // Advanced resource management using latest MCP patterns
  async checkServerHealth(): Promise<void> {
    try {
      const resources = await this.client.listResources();
      logger.info('Available resources:', { resources: resources.resources.map(r => r.name) });

      // Read health resource with modern error handling
      const health = await this.client.readResource({
        uri: 'health://status'
      });

      const healthContent = (health as any).contents[0];
      const healthData = JSON.parse(healthContent.text);
      logger.info('Server health status:', healthData);

    } catch (error) {
      logger.error('Error checking server health:', { error });
    }
  }

  // Modern connection cleanup with comprehensive error handling
  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        logger.info('Client disconnected successfully');
      }
    } catch (error) {
      logger.error('Error during client disconnect:', { error });
    }
  }
}

// Advanced client usage example with modern async patterns
async function demonstrateAdvancedMcpClient() {
  const client = new AdvancedMcpClient();
  
  try {
    // Connect with automatic transport fallback
    await client.connectWithFallback('http://localhost:3000');
    
    // Check server health and capabilities
    await client.checkServerHealth();
    
    // Perform comprehensive calculator operations
    await client.performCalculations();
    
  } catch (error) {
    logger.error('Client demonstration failed:', { error });
  } finally {
    // Ensure proper cleanup
    await client.disconnect();
  }
}

// Export for usage in other modules
export { AdvancedMcpClient, demonstrateAdvancedMcpClient };

// Run demonstration if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateAdvancedMcpClient().catch(console.error);
}