import { getFirstDayOfNextMonth } from './util';
import { expect, test, describe } from 'vitest';

describe('util', () => {
	describe('getFirstDayOfNextMonth', () => {
		test('should return the first Friday of the next month', () => {
			const date = new Date('2025-03-01');
			const expected = new Date('2025-04-04');
			const result = getFirstDayOfNextMonth(date, "Friday");
			expect(result).toEqual(expected);
		});
	});
});
