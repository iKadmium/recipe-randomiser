<script lang="ts" module>
	import type { MealDate } from '$lib/meal-generator';

	export interface MealCalendarProps {
		mealDays: MealDate[];
		onRandomiseClick: (date: Date) => unknown | Promise<unknown>;
		onPickClick: (date: Date) => unknown | Promise<unknown>;
		onTakeoutClick: (date: Date) => unknown | Promise<unknown>;
	}
</script>

<script lang="ts">
	import { toUTCIsoString } from '$lib/util';
	import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';
	import MealCalendarDay from './MealCalendarDay.svelte';

	let { mealDays, onRandomiseClick, onPickClick, onTakeoutClick }: MealCalendarProps = $props();

	let startDate = $derived(mealDays[0]?.date ?? new Date());
	let endDate = $derived(mealDays[mealDays.length - 1]?.date ?? new Date());

	let monthName = $derived(startDate.toLocaleDateString(undefined, { month: 'long' }));

	const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let weeks = $derived(getWeeks(startDate, endDate));

	function getWeeks(startDate: Date, endDate: Date): Date[][] {
		const start = startOfWeek(startDate, { weekStartsOn: 0 });
		const end = endOfWeek(endDate, { weekStartsOn: 0 });
		const days = eachDayOfInterval({ start, end });

		const weeks: Date[][] = [];
		let week: Date[] = [];

		for (let i = 0; i < days.length; i++) {
			week.push(days[i]);
			if (week.length === 7) {
				weeks.push(week);
				week = [];
			}
		}
		if (week.length > 0) {
			weeks.push(week);
		}
		return weeks;
	}
</script>

<h2>{monthName}</h2>
<div class="calendar">
	{#each weekDays as day}
		<div class="day">{day}</div>
	{/each}
	{#each weeks as week}
		{#each week as date}
			<MealCalendarDay
				{date}
				meal={mealDays.find((meal) => toUTCIsoString(meal.date) === toUTCIsoString(date))?.meal}
				onRandomise={() => onRandomiseClick(date)}
				onPick={() => onPickClick(date)}
				onTakeout={() => onTakeoutClick(date)}
			/>
		{/each}
	{/each}
</div>

<style>
	.day {
		font-weight: bold;
		text-align: center;
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: auto 1fr;
		grid-auto-rows: 1fr;

		overflow-x: scroll;
	}
</style>
