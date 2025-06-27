import { getFirstDayOfNextMonth } from './util';
import { expect, test, describe } from 'vitest';

describe('util', () => {
	describe('getfirstSaturdayOfNextMonth', () => {
		test('should return the last Friday of the month', () => {
			const date = new Date('2025-03-01');
			const expected = new Date('2025-04-05');
			const result = getFirstDayOfNextMonth(date);
			expect(result).toEqual(expected);
		});
	});
});
