#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createMcpServer } from './mcp-server.js';
import { logger } from '../utils/logger.js';

// Modern Express application with cutting-edge MCP transport patterns
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Advanced middleware configuration for production
app.use(express.json({ 
  limit: '10mb',
  type: ['application/json', 'application/json-rpc']
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  exposedHeaders: ['Mcp-Session-Id'],
  allowedHeaders: ['Content-Type', 'mcp-session-id', 'authorization'],
  credentials: true
}));

// Session storage with modern Map-based architecture
const streamableTransports: Map<string, StreamableHTTPServerTransport> = new Map();
const sseTransports: Map<string, SSEServerTransport> = new Map();
// Advanced health check endpoint with comprehensive metrics
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    activeSessions: {
      streamable: streamableTransports.size,
      sse: sseTransports.size
    },
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    pid: process.pid
  };
  res.json(health);
});

// Request logging middleware for monitoring
app.use((req, res, next) => {
  logger.debug('HTTP Request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    sessionId: req.headers['mcp-session-id']
  });
  next();
});

// Modern Streamable HTTP endpoint using latest 2025-03-26 protocol
app.all('/mcp', async (req, res) => {
  try {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && streamableTransports.has(sessionId)) {
      // Reuse existing transport with enhanced session validation
      transport = streamableTransports.get(sessionId)!;
      logger.debug('Reusing existing streamable transport', { sessionId });
    } else if (!sessionId && isInitializeRequest(req.body)) {      // New initialization request using latest transport patterns
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          streamableTransports.set(newSessionId, transport);
          logger.info('New streamable session initialized', { sessionId: newSessionId });
        },
        // Production-grade DNS rebinding protection
        enableDnsRebindingProtection: process.env.NODE_ENV === 'production',
        allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || ['127.0.0.1', 'localhost'],
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || []
      });

      // Enhanced transport lifecycle management
      transport.onclose = () => {
        if (transport.sessionId) {
          streamableTransports.delete(transport.sessionId);
          logger.info('Streamable session closed', { sessionId: transport.sessionId });
        }
      };

      // Create server instance with latest patterns
      const server = createMcpServer();
      await server.connect(transport);
    } else {
      // Enhanced error response with detailed messaging
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided or invalid initialize request',
          data: {
            timestamp: new Date().toISOString(),
            expectedHeaders: ['mcp-session-id'],
            receivedHeaders: Object.keys(req.headers)
          }
        },
        id: null,
      });
    }
    // Process request using cutting-edge transport patterns
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    logger.error('Error handling streamable HTTP request:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: req.headers['mcp-session-id'],
      url: req.url,
      method: req.method
    });
    
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
          data: {
            timestamp: new Date().toISOString(),
            requestId: randomUUID()
          }
        },
        id: null,
      });
    }
  }
});

// Legacy SSE endpoint for backwards compatibility with enhanced features
app.get('/sse', async (req, res) => {
  try {
    const transport = new SSEServerTransport('/messages', res);
    sseTransports.set(transport.sessionId, transport);
    
    // Enhanced session lifecycle management
    res.on('close', () => {
      sseTransports.delete(transport.sessionId);
      logger.info('SSE session closed', { sessionId: transport.sessionId });
    });
    
    const server = createMcpServer();
    await server.connect(transport);
    
    logger.info('New SSE session created', { sessionId: transport.sessionId });
  } catch (error) {    logger.error('Error creating SSE connection:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      userAgent: req.get('User-Agent')
    });
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to establish SSE connection',
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Legacy message endpoint for SSE with enhanced error handling
app.post('/messages', async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    const transport = sseTransports.get(sessionId);
    
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      logger.warn('SSE transport not found', { sessionId, availableSessions: Array.from(sseTransports.keys()) });
      res.status(400).json({
        error: 'No transport found for sessionId',
        sessionId,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Error handling SSE message:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      sessionId: req.query.sessionId 
    });
    
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to handle message',
        timestamp: new Date().toISOString()
      });
    }
  }
});
// Enhanced graceful shutdown with comprehensive cleanup
const server = app.listen(PORT, () => {
  logger.info(`Advanced MCP Calculator Server listening on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Streamable HTTP: http://localhost:${PORT}/mcp`);
  logger.info(`Legacy SSE: http://localhost:${PORT}/sse`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Modern process signal handling for production deployments
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, initiating graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Clean up all active transports
    try {
      const cleanupPromises = [
        ...Array.from(streamableTransports.values()).map(t => t.close?.() || Promise.resolve()),
        ...Array.from(sseTransports.values()).map(t => t.close?.() || Promise.resolve())
      ];
      
      await Promise.allSettled(cleanupPromises);
      logger.info('All transports cleaned up successfully');
      
    } catch (error) {
      logger.error('Error during transport cleanup:', { error });
    }
    
    process.exit(0);
  });
  
  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// Advanced error boundary patterns for production reliability
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { 
    reason: reason instanceof Error ? reason.message : reason,
    promise: promise.toString()
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { 
    error: error.message, 
    stack: error.stack 
  });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Enhanced process monitoring for observability
process.on('warning', (warning) => {
  logger.warn('Node.js Warning', {
    name: warning.name,
    message: warning.message,
    stack: warning.stack
  });
});

// Memory usage monitoring for production environments
setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB threshold
    logger.warn('High memory usage detected', { memoryUsage: memUsage });
  }
}, 30000);

logger.info('Advanced MCP Calculator HTTP Server initialized with cutting-edge patterns');