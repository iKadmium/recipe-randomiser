export type Day =
	| 'Sunday'
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday';
function getDayNumber(day: Day): number {
	const dayNames: Day[] = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	return dayNames.indexOf(day);
}

export function getFirstDayOfNextMonth(date: Date, day: Day): Date {
	const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
	const firstDay = new Date(nextMonth);
	firstDay.setDate(firstDay.getDate() + ((getDayNumber(day) - firstDay.getDay()) % 7));
	return firstDay;
}

export function toUTCIsoString(date: Date): string {
	const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return utcDate.toISOString();
}

export function getNextDay(date: Date, day: Day): Date {
	const targetDay = getDayNumber(day);
	const currentDay = date.getDay();
	let daysToAdd = (targetDay - currentDay + 7) % 7;
	if (daysToAdd === 0) daysToAdd = 7;
	const nextDate = new Date(date);
	nextDate.setDate(date.getDate() + daysToAdd);
	return nextDate;
}

export function getEveryDay(startDate: Date, endDate: Date, day: Day): Date[] {
	const matchingDays: Date[] = [];
	const dayNumber = getDayNumber(day);
	const currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		if (currentDate.getDay() === dayNumber) {
			matchingDays.push(new Date(currentDate));
		}
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return matchingDays;
}

export function getRandom<T>(arr: T[]): T | undefined {
	if (arr.length === 0) {
		return undefined;
	}
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}

export function getRandomWithPenalty<T>(
	arr: T[],
	used: Record<string, number>,
	getKey: (item: T) => string
): T | undefined {
	if (arr.length === 0) return undefined;

	const weights = arr.map((item) => {
		const key = getKey(item);
		const distance = used[key];
		// Penalty: recent items (distance small) get lower weight, older get higher
		// Penalty formula: weight = 1 / (1 + exp(-k * (distance - d0)))
		// For unused items (distance === undefined), give max weight
		if (distance === undefined) return 1;
		// Diminishing penalty: e.g., exponential decay
		const penalty = Math.exp(-distance);
		return penalty;
	});

	const totalWeight = weights.reduce((a, b) => a + b, 0);
	if (totalWeight === 0) return getRandom(arr);

	let r = Math.random() * totalWeight;
	for (let i = 0; i < arr.length; i++) {
		if (r < weights[i]) return arr[i];
		r -= weights[i];
	}
	return arr[arr.length - 1];
}
