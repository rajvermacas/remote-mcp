import { describe, test, expect, beforeEach } from '@jest/globals';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCalculatorTools } from '../../src/server/tools/calculator.js';

// Modern Jest testing patterns for MCP server validation
describe('Advanced Calculator Tools - Unit Tests', () => {
  let server: McpServer;

  beforeEach(() => {
    server = new McpServer({
      name: 'test-calculator',
      version: '1.0.0'
    });
    registerCalculatorTools(server);
  });

  describe('Addition Tool - Comprehensive Testing', () => {
    test('should handle positive integer addition correctly', async () => {
      const result = await server.callTool('add', { a: 5, b: 3 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(8);
      expect(response.operation).toBe('addition');
      expect(response.inputs).toEqual({ a: 5, b: 3 });
      expect(result.isError).toBeFalsy();
    });

    test('should handle negative numbers correctly', async () => {
      const result = await server.callTool('add', { a: -5, b: 3 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(-2);
      expect(response.operation).toBe('addition');
    });

    test('should handle decimal precision accurately', async () => {
      const result = await server.callTool('add', { a: 1.1, b: 2.2 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBeCloseTo(3.3, 10);
    });    
    test('should handle edge cases with zero values', async () => {
      const result = await server.callTool('add', { a: 0, b: 0 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(0);
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('Division Tool - Advanced Error Handling', () => {
    test('should perform accurate division operations', async () => {
      const result = await server.callTool('divide', { a: 10, b: 2 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(5);
      expect(response.operation).toBe('division');
      expect(result.isError).toBeFalsy();
    });

    test('should handle division by zero with proper error response', async () => {
      const result = await server.callTool('divide', { a: 10, b: 0 });
      const errorResponse = JSON.parse(result.content[0].text);
      
      expect(errorResponse.error).toBe('Division by zero is not allowed');
      expect(errorResponse.operation).toBe('division');
      expect(result.isError).toBe(true);
    });

    test('should handle floating point division precision', async () => {
      const result = await server.callTool('divide', { a: 1, b: 3 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBeCloseTo(0.3333333333333333, 10);
    });  });

  describe('Square Root Tool - Mathematical Precision Testing', () => {
    test('should calculate perfect square roots accurately', async () => {
      const result = await server.callTool('sqrt', { value: 9 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(3);
      expect(response.operation).toBe('square_root');
      expect(result.isError).toBeFalsy();
    });

    test('should handle decimal square roots with precision', async () => {
      const result = await server.callTool('sqrt', { value: 2 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBeCloseTo(1.4142135623730951, 10);
    });

    test('should reject negative numbers with proper error handling', async () => {
      const result = await server.callTool('sqrt', { value: -4 });
      const errorResponse = JSON.parse(result.content[0].text);
      
      expect(errorResponse.error).toBe('Cannot calculate square root of a negative number');
      expect(errorResponse.operation).toBe('square_root');
      expect(result.isError).toBe(true);
    });
  });

  describe('Power Tool - Advanced Mathematical Operations', () => {
    test('should handle integer exponentiation correctly', async () => {
      const result = await server.callTool('power', { base: 2, exponent: 3 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(8);
      expect(response.operation).toBe('power');
    });    
    test('should handle fractional exponents accurately', async () => {
      const result = await server.callTool('power', { base: 4, exponent: 0.5 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.result).toBe(2);
    });

    test('should detect infinite results and handle gracefully', async () => {
      const result = await server.callTool('power', { base: 2, exponent: 1024 });
      const errorResponse = JSON.parse(result.content[0].text);
      
      expect(errorResponse.error).toBe('Result is infinite or not a number');
      expect(result.isError).toBe(true);
    });
  });

  describe('Comprehensive Tool Validation', () => {
    test('should include proper timestamps in all responses', async () => {
      const result = await server.callTool('multiply', { a: 6, b: 7 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp)).toBeInstanceOf(Date);
    });

    test('should maintain consistent response structure across tools', async () => {
      const result = await server.callTool('subtract', { a: 10, b: 4 });
      const response = JSON.parse(result.content[0].text);
      
      expect(response).toHaveProperty('result');
      expect(response).toHaveProperty('operation');
      expect(response).toHaveProperty('inputs');
      expect(response).toHaveProperty('timestamp');
    });
  });
});