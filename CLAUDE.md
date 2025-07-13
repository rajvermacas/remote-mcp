# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Model Context Protocol (MCP) server implementation in TypeScript that provides secure arithmetic operations with multiple transport options. The codebase follows modern MCP SDK patterns and includes comprehensive error handling, logging, and testing.

## Common Development Commands

### Build and Development
- `npm run build` - Compile TypeScript to dist/ directory
- `npm run dev` - Start stdio server with hot reload (development)
- `npm run dev:http` - Start HTTP server with hot reload (development)
- `npm start` - Start stdio server (production)
- `npm start:http` - Start HTTP server (production)

### Testing and Quality
- `npm test` - Run all tests (Jest with ts-jest)
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Fix ESLint issues automatically

### MCP-Specific Tools
- `npm run inspector` - Start MCP inspector for interactive testing
- `npx @modelcontextprotocol/inspector --cli node dist/server/stdio-server.js --method tools/list` - List available tools
- Test tool calls: `npx @modelcontextprotocol/inspector --cli node dist/server/stdio-server.js --method tools/call --tool-name add --tool-arg a=10 --tool-arg b=5`

## Architecture Overview

### Core Architecture
- **Transport Layer**: Supports both stdio and HTTP+SSE transports
- **Server Factory**: `createMcpServer()` in `src/server/mcp-server.ts` creates configured server instances
- **Tool Registration**: Modular tool registration system in `src/server/tools/calculator.ts`
- **Type Safety**: Zod schemas for runtime validation in `src/types/calculator.ts`
- **Logging**: Winston-based logging system in `src/utils/logger.ts`

### Key Components
- `src/server/stdio-server.ts` - Stdio transport implementation
- `src/server/http-server.ts` - Express-based HTTP server with session management
- `src/server/mcp-server.ts` - Core MCP server factory with health monitoring
- `src/server/tools/calculator.ts` - Calculator tool implementations with error handling
- `src/types/calculator.ts` - Zod schemas and TypeScript types
- `src/utils/logger.ts` - Centralized logging configuration

### Transport Options
1. **Stdio Transport**: Default for MCP client integration, uses standard input/output
2. **HTTP Transport**: REST API with Server-Sent Events, includes session management and CORS

### Available Calculator Tools
- `add` - Addition with two numbers
- `subtract` - Subtraction with two numbers  
- `multiply` - Multiplication with two numbers
- `divide` - Division with zero-check validation
- `power` - Exponentiation with base and exponent
- `sqrt` - Square root with non-negative validation

## Development Guidelines

### Adding New Tools
1. Define Zod schema in `src/types/calculator.ts`
2. Implement tool logic in `src/server/tools/calculator.ts` using `server.registerTool()`
3. Add comprehensive error handling with `CalculationResult` and `ErrorResult` types
4. Include logging for operations and errors
5. Write unit tests in `tests/unit/`

### File Size Management
- Keep individual files under 800 lines - current largest file is ~200 lines
- Extract complex logic into separate utility modules if needed

### Testing Strategy
- Unit tests for individual tools in `tests/unit/calculator.test.ts`
- Integration tests for full server functionality in `tests/integration/server.test.ts`
- Use Jest with ts-jest preset for ESM support

### Error Handling Pattern
All tools follow consistent error handling:
```typescript
try {
  // operation logic
  const response: CalculationResult = { result, operation, inputs, timestamp };
  return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
} catch (error) {
  const errorResponse: ErrorResult = { error: message, operation, inputs, timestamp };
  // log and return error
}
```

### ESM Configuration
- Project uses ESM modules (`"type": "module"` in package.json)
- TypeScript compiles to ES2022 with ESNext modules
- Jest configured for ESM with ts-jest preset
- Import paths use `.js` extensions for compiled output

## Production Deployment

### Docker Support
- `docker-compose.yml` provides development and production profiles
- `docker-compose --profile production up -d` for production deployment
- Health monitoring available at `/health` endpoint

### Monitoring
- Logs written to `logs/combined.log` and `logs/error.log`
- Health endpoint provides server metrics and status
- Winston logger with configurable levels

## MCP Protocol Integration

This server implements MCP protocol version 2024-11-05 with:
- Tool registration and invocation
- Resource endpoints (health monitoring)
- Session management for HTTP transport
- Proper JSON-RPC 2.0 message handling
- Client capability negotiation during initialization