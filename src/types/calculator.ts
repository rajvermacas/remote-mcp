import { z } from 'zod';

// Input validation schemas with latest Zod patterns
export const AdditionSchema = z.object({
  a: z.number().describe('First number to add'),
  b: z.number().describe('Second number to add')
});

export const SubtractionSchema = z.object({
  a: z.number().describe('Number to subtract from'),
  b: z.number().describe('Number to subtract')
});

export const MultiplicationSchema = z.object({
  a: z.number().describe('First number to multiply'),
  b: z.number().describe('Second number to multiply')
});

export const DivisionSchema = z.object({
  a: z.number().describe('Dividend'),
  b: z.number().describe('Divisor (cannot be zero)')
});

export const PowerSchema = z.object({
  base: z.number().describe('Base number'),
  exponent: z.number().describe('Exponent')
});

export const SquareRootSchema = z.object({
  value: z.number().min(0).describe('Number to calculate square root (must be non-negative)')
});

// Type inference with modern TypeScript patterns
export type AdditionInput = z.infer<typeof AdditionSchema>;
export type SubtractionInput = z.infer<typeof SubtractionSchema>;
export type MultiplicationInput = z.infer<typeof MultiplicationSchema>;
export type DivisionInput = z.infer<typeof DivisionSchema>;
export type PowerInput = z.infer<typeof PowerSchema>;
export type SquareRootInput = z.infer<typeof SquareRootSchema>;

// Result types with modern error handling patterns
export interface CalculationResult {
  result: number;
  operation: string;
  inputs: Record<string, number>;
  timestamp: string;
}

export interface ErrorResult {
  error: string;
  operation: string;
  inputs?: Record<string, number>;
  timestamp: string;
}