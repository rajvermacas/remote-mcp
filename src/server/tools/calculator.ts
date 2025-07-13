import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  AdditionSchema,
  SubtractionSchema,
  MultiplicationSchema,
  DivisionSchema,
  PowerSchema,
  SquareRootSchema,
  CalculationResult,
  ErrorResult
} from '../../types/calculator.js';
import { logger } from '../../utils/logger.js';

// Modern MCP tool registration using latest SDK patterns
export function registerCalculatorTools(server: McpServer): void {
  // Addition tool with advanced error handling
  server.registerTool(
    'add',
    {
      title: 'Addition Calculator',
      description: 'Add two numbers together and return the result',
      inputSchema: AdditionSchema.shape
    },
    async ({ a, b }) => {
      try {
        const result = a + b;
        const response: CalculationResult = {
          result,
          operation: 'addition',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.info('Addition operation completed', { a, b, result });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorResponse: ErrorResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          operation: 'addition',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.error('Addition operation failed', { a, b, error: errorResponse.error });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(errorResponse, null, 2)
          }],
          isError: true
        };
      }
    }
  );

  // Subtraction tool with modern error handling patterns
  server.registerTool(
    'subtract',
    {
      title: 'Subtraction Calculator',
      description: 'Subtract the second number from the first number',
      inputSchema: SubtractionSchema.shape
    },
    async ({ a, b }) => {
      try {
        const result = a - b;
        const response: CalculationResult = {
          result,
          operation: 'subtraction',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.info('Subtraction operation completed', { a, b, result });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorResponse: ErrorResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          operation: 'subtraction',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.error('Subtraction operation failed', { a, b, error: errorResponse.error });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(errorResponse, null, 2)
          }],
          isError: true
        };
      }
    }
  );  );

  // Multiplication tool with latest SDK patterns
  server.registerTool(
    'multiply',
    {
      title: 'Multiplication Calculator',
      description: 'Multiply two numbers together',
      inputSchema: MultiplicationSchema.shape
    },
    async ({ a, b }) => {
      try {
        const result = a * b;
        const response: CalculationResult = {
          result,
          operation: 'multiplication',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.info('Multiplication operation completed', { a, b, result });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorResponse: ErrorResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          operation: 'multiplication',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.error('Multiplication operation failed', { a, b, error: errorResponse.error });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(errorResponse, null, 2)
          }],
          isError: true
        };
      }
    }
  );
  // Division tool with advanced zero-division protection
  server.registerTool(
    'divide',
    {
      title: 'Division Calculator',
      description: 'Divide the first number by the second number',
      inputSchema: DivisionSchema.shape
    },
    async ({ a, b }) => {
      try {
        if (b === 0) {
          throw new Error('Division by zero is not allowed');
        }

        const result = a / b;
        const response: CalculationResult = {
          result,
          operation: 'division',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };

        logger.info('Division operation completed', { a, b, result });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorResponse: ErrorResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          operation: 'division',
          inputs: { a, b },
          timestamp: new Date().toISOString()
        };
        logger.error('Division operation failed', { a, b, error: errorResponse.error });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(errorResponse, null, 2)
          }],
          isError: true
        };
      }
    }
  );

  // Power/Exponentiation tool with modern validation
  server.registerTool(
    'power',
    {
      title: 'Power Calculator',
      description: 'Raise the base number to the power of the exponent',
      inputSchema: PowerSchema.shape
    },
    async ({ base, exponent }) => {
      try {
        const result = Math.pow(base, exponent);
        
        if (!isFinite(result)) {
          throw new Error('Result is infinite or not a number');
        }

        const response: CalculationResult = {
          result,
          operation: 'power',
          inputs: { base, exponent },
          timestamp: new Date().toISOString()
        };

        logger.info('Power operation completed', { base, exponent, result });        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorResponse: ErrorResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          operation: 'power',
          inputs: { base, exponent },
          timestamp: new Date().toISOString()
        };

        logger.error('Power operation failed', { base, exponent, error: errorResponse.error });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(errorResponse, null, 2)
          }],
          isError: true
        };
      }
    }
  );

  // Square root tool with modern input validation
  server.registerTool(
    'sqrt',
    {
      title: 'Square Root Calculator',
      description: 'Calculate the square root of a number',
      inputSchema: SquareRootSchema.shape
    },
    async ({ value }) => {
      try {        if (value < 0) {
          throw new Error('Cannot calculate square root of a negative number');
        }

        const result = Math.sqrt(value);
        const response: CalculationResult = {
          result,
          operation: 'square_root',
          inputs: { value },
          timestamp: new Date().toISOString()
        };

        logger.info('Square root operation completed', { value, result });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      } catch (error) {
        const errorResponse: ErrorResult = {
          error: error instanceof Error ? error.message : 'Unknown error',
          operation: 'square_root',
          inputs: { value },
          timestamp: new Date().toISOString()
        };

        logger.error('Square root operation failed', { value, error: errorResponse.error });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(errorResponse, null, 2)
          }],
          isError: true
        };
      }
    }
  );

  logger.info('Calculator tools registered successfully');
}