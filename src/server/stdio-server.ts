#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp-server.js';
import { logger } from '../utils/logger.js';

// Modern async main function with comprehensive error handling
async function main() {
  try {
    const server = createMcpServer();
    const transport = new StdioServerTransport();
    
    // Advanced graceful shutdown patterns for production environments
    const shutdownGracefully = async (signal: string) => {
      logger.info(`Received ${signal}, initiating graceful shutdown...`);
      try {
        await server.close();
        logger.info('Server closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', { error });
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdownGracefully('SIGINT'));
    process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));

    // Connect using latest transport patterns
    await server.connect(transport);
    logger.info('MCP Calculator Server started successfully on stdio transport');
    
    // Optional: Emit server ready event for monitoring systems
    process.emit('SERVER_READY');
    
  } catch (error) {
    logger.error('Failed to start MCP Calculator Server', { error });
    process.exit(1);
  }
}

// Modern error boundary patterns for Node.js applications
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { reason, promise: promise.toString() });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Enhanced process monitoring for production deployments
process.on('warning', (warning) => {
  logger.warn('Node.js Warning', {
    name: warning.name,
    message: warning.message,
    stack: warning.stack
  });
});

// Execute main function with modern error handling
main().catch((error) => {
  logger.error('Fatal error in main process:', { error });
  process.exit(1);
});