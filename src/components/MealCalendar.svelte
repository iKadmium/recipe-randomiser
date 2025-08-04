<script lang="ts" module>
	import { Temporal } from '@js-temporal/polyfill';
	import type { MealDate } from '$lib/temporal-meal-generator';

	export interface MealCalendarProps {
		mealDays: MealDate[];
		startDate: Temporal.PlainDate;
		endDate: Temporal.PlainDate;
		onRandomiseClick: (date: Temporal.PlainDate) => unknown | Promise<unknown>;
		onPickClick: (date: Temporal.PlainDate) => unknown | Promise<unknown>;
		onTakeoutClick: (date: Temporal.PlainDate) => unknown | Promise<unknown>;
	}
</script>

<script lang="ts">
	import MealCalendarDay from './MealCalendarDay.svelte';

	let {
		mealDays,
		startDate,
		endDate,
		onRandomiseClick,
		onPickClick,
		onTakeoutClick
	}: MealCalendarProps = $props();

	let monthName = $derived(startDate.toLocaleString('en', { month: 'long' }));

	const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let weeks = $derived(getWeeks(startDate, endDate));

	function getWeeks(
		startDate: Temporal.PlainDate,
		endDate: Temporal.PlainDate
	): Temporal.PlainDate[][] {
		// Find the start of the week containing startDate (Sunday = 7, so we want Sunday = 0)
		const startDayOfWeek = startDate.dayOfWeek === 7 ? 0 : startDate.dayOfWeek;
		const weekStart = startDate.subtract({ days: startDayOfWeek });

		// Find the end of the week containing endDate
		const endDayOfWeek = endDate.dayOfWeek === 7 ? 0 : endDate.dayOfWeek;
		const weekEnd = endDate.add({ days: 6 - endDayOfWeek });

		// Generate all days from weekStart to weekEnd
		const days: Temporal.PlainDate[] = [];
		let currentDate = weekStart;

		while (Temporal.PlainDate.compare(currentDate, weekEnd) <= 0) {
			days.push(currentDate);
			currentDate = currentDate.add({ days: 1 });
		}

		// Group into weeks of 7 days
		const weeks: Temporal.PlainDate[][] = [];
		let week: Temporal.PlainDate[] = [];

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
	{#each weekDays as day (day)}
		<div class="day">{day}</div>
	{/each}
	{#each weeks as week (week)}
		{#each week as date (date)}
			<MealCalendarDay
				{date}
				meal={(() => {
					const foundMeal = mealDays.find((meal) => meal.date.equals(date));
					return foundMeal?.meal;
				})()}
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
