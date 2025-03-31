import { getFirstSaturdayOfNextMonth } from './util';
import { expect, test, describe } from 'vitest';

describe('util', () => {
	describe('getLastFridayOfMonth', () => {
		test('should return the last Friday of the month', () => {
			const date = new Date('2025-03-01');
			const expected = new Date('2025-03-28');
			const result = getFirstSaturdayOfNextMonth(date);
			expect(result).toEqual(expected);
		});
	});
});
