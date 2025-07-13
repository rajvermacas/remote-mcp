# Advanced MCP Calculator Server

A production-ready Model Context Protocol (MCP) server implementation in TypeScript that provides secure arithmetic operations with multiple transport options and comprehensive error handling.

## 🚀 Features

- **Multiple Transport Support**: Stdio, HTTP+SSE, and modern Streamable HTTP
- **Robust Input Validation**: Zod schema-based type safety
- **Security**: DNS rebinding protection and session management
- **Comprehensive Error Handling**: Proper error responses with detailed messages
- **Modern Architecture**: Latest MCP TypeScript SDK patterns
- **Production Ready**: Logging, monitoring, and graceful shutdown

## 📁 Project Structure

```
mcp-calculator-server/
├── src/
│   ├── server/
│   │   ├── mcp-server.ts        # Core MCP server implementation
│   │   ├── stdio-server.ts      # Stdio transport server
│   │   ├── http-server.ts       # HTTP server with multiple transports
│   │   └── tools/
│   │       └── calculator.ts    # Calculator tool implementations
│   ├── client/
│   │   └── client-example.ts    # Example client implementation
│   ├── types/
│   │   └── calculator.ts        # Type definitions
│   └── utils/
│       ├── logger.ts            # Logging utility
│       └── validation.ts        # Input validation helpers
├── tests/
│   ├── integration/
│   │   └── server.test.ts       # End-to-end tests
│   └── unit/
│       └── calculator.test.ts   # Unit tests
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml
└── README.md
```

## 🛠 Installation

```bash
# Navigate to project directory
cd C:\Projects\remote-mcp-typescript

# Install dependencies
npm install

# Build the project
npm run build
```

## 🚀 Ready to Use Commands

### Development Commands
```bash
# Install dependencies
npm install

# Build the project (TypeScript compilation)
npm run build

# Start stdio server (development)
npm run start

# Start HTTP server (production)
npm run start:http

# Development with hot reload (stdio)
npm run dev

# Development with hot reload (HTTP)
npm run dev:http
```

### Testing & Quality Assurance
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### MCP Server Inspection & Debugging
```bash
# Start with MCP inspector (interactive testing)
npm run inspector

# Test specific tools via CLI
npx @modelcontextprotocol/inspector --cli node dist/server/stdio-server.js --method tools/list
npx @modelcontextprotocol/inspector --cli node dist/server/stdio-server.js --method tools/call --tool-name add --tool-arg a=10 --tool-arg b=5
```

### Production Deployment
```bash
# Docker development environment
docker-compose --profile development up -d

# Docker production deployment
docker-compose --profile production up -d

# Build and start production container
docker-compose up -d mcp-calculator

# Check container health
docker-compose ps
docker-compose logs mcp-calculator

# Stop services
docker-compose down
```

### Health Monitoring
```bash
# Check HTTP server health
curl http://localhost:3000/health

# Monitor logs in real-time
tail -f logs/combined.log

# View error logs
tail -f logs/error.log
```

### Advanced Usage Examples

#### Client Integration
```bash
# Run example client
node dist/client/client-example.js

# Use client with different transports
node -e "
import('./dist/client/client-example.js').then(m => 
  m.demonstrateAdvancedMcpClient()
)"
```

#### API Testing
```bash
# Test MCP initialization
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}'

# Test tool invocation via HTTP
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: your-session-id" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "add", "arguments": {"a": 10, "b": 5}}}'
```

## 📚 API Documentation

### Available Tools

| Tool | Description | Parameters | Example |
|------|-------------|------------|---------|
| `add` | Addition | `a: number, b: number` | `{a: 10, b: 5}` → `15` |
| `subtract` | Subtraction | `a: number, b: number` | `{a: 10, b: 3}` → `7` |
| `multiply` | Multiplication | `a: number, b: number` | `{a: 4, b: 5}` → `20` |
| `divide` | Division | `a: number, b: number` | `{a: 20, b: 4}` → `5` |
| `power` | Exponentiation | `base: number, exponent: number` | `{base: 2, exponent: 3}` → `8` |
| `sqrt` | Square Root | `value: number (≥0)` | `{value: 16}` → `4` |

This implementation demonstrates cutting-edge MCP server development with TypeScript, incorporating the latest SDK patterns, comprehensive error handling, multiple transport support, and production-ready features.

# Notes
## Start mcp inspector
npx @modelcontextprotocol/inspector - From the host windows machine

## Typescript remote mcp server
PORT=9000 npm run start:http