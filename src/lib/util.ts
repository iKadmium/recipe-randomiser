export type Day = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
function getDayNumber(day: Day): number {
	const dayNames: Day[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return dayNames.indexOf(day);
}

export function getFirstSaturdayOfNextMonth(date: Date): Date {
	const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
	const firstSaturday = new Date(nextMonth);
	firstSaturday.setDate(firstSaturday.getDate() + ((6 - firstSaturday.getDay()) % 7));
	return firstSaturday;
}

export function toUTCIsoString(date: Date): string {
	const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return utcDate.toISOString();
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

export function getRandom<T>(arr: T[]): T {
	if (arr.length === 0) {
		throw new Error("Array is empty");
	}
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
}