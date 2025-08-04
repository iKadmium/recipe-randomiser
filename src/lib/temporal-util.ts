import { Temporal } from '@js-temporal/polyfill';

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7; // Monday = 1, Sunday = 7

export type Day =
    | 'Sunday'
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday';

function getDayNumber(day: Day): DayOfWeek {
    const dayMap: Record<Day, DayOfWeek> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    };
    return dayMap[day];
}

export function getFirstDayOfNextMonth(date: Temporal.PlainDate, day: Day): Temporal.PlainDate {
    const nextMonth = date.with({ day: 1 }).add({ months: 1 });
    const targetDayNumber = getDayNumber(day);
    const firstDayOfMonth = nextMonth.dayOfWeek;

    // Convert Sunday=7 to Sunday=0 to match JavaScript Date behavior
    const targetDayJS = targetDayNumber === 7 ? 0 : targetDayNumber;
    const firstDayOfMonthJS = firstDayOfMonth === 7 ? 0 : firstDayOfMonth;

    const daysToAdd = (targetDayJS - firstDayOfMonthJS + 7) % 7;

    return nextMonth.add({ days: daysToAdd });
}

export function getNextDay(date: Temporal.PlainDate, day: Day): Temporal.PlainDate {
    const targetDay = getDayNumber(day);
    const currentDay = date.dayOfWeek;
    let daysToAdd = (targetDay - currentDay + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7;

    return date.add({ days: daysToAdd });
}

export function getEveryDay(startDate: Temporal.PlainDate, endDate: Temporal.PlainDate, day: Day): Temporal.PlainDate[] {
    const matchingDays: Temporal.PlainDate[] = [];
    const dayNumber = getDayNumber(day);
    let currentDate = startDate;

    while (Temporal.PlainDate.compare(currentDate, endDate) <= 0) {
        if (currentDate.dayOfWeek === dayNumber) {
            matchingDays.push(currentDate);
        }
        currentDate = currentDate.add({ days: 1 });
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

// Helper functions to convert between Date and Temporal.PlainDate
export function dateToPlainDate(date: Date): Temporal.PlainDate {
    return Temporal.PlainDate.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    });
}

export function plainDateToDate(plainDate: Temporal.PlainDate): Date {
    return new Date(plainDate.year, plainDate.month - 1, plainDate.day);
}

// Helper to get today as PlainDate
export function today(): Temporal.PlainDate {
    return Temporal.Now.plainDateISO();
}
