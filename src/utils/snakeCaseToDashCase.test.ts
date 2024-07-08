import { expect, test } from 'vitest';
import { snakeCaseToDashCase } from './snakeCaseToDashCase.js';

test('if function is safe for empty value', () => {
  expect(snakeCaseToDashCase('')).toBe('');
});

test('if "meeting_created" will be converted to "meeting-created"', () => {
  expect(snakeCaseToDashCase('meeting_created')).toBe('meeting-created');
});
