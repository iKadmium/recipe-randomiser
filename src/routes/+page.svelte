<script lang="ts">
	import { Temporal } from '@js-temporal/polyfill';
	import { Button, FormGroup, Label, Modal, TabContent, TabPane } from '@sveltestrap/sveltestrap';

	import { generateMeals, getMealForDate, type MealDate } from '$lib/temporal-meal-generator';
	import { getShoppingList } from '$lib/temporal-shopping-list';
	import { getEveryDay, getFirstDayOfNextMonth, getNextDay, today } from '$lib/temporal-util';
	import DateListSelector from '../components/DateListSelector.svelte';
	import DatePicker from '../components/DatePicker.svelte';
	import MealCalendar from '../components/MealCalendar.svelte';
	import MealPicker from '../components/MealPicker.svelte';

	let { data } = $props();

	let startDate = $state(getStartDate());
	let endDate = $state(getEndDate());

	let easyMealDays = $state<Temporal.PlainDate[]>([]);
	let takeoutDays = $state<Temporal.PlainDate[]>([]);
	let mealDays = $state<MealDate[]>([]);
	let lastGeneratedKey = $state(''); // Track when we need to regenerate

	$effect(() => {
		// Create a key to track when we need to regenerate meals
		const newKey = `${startDate.toString()}-${endDate.toString()}-${JSON.stringify(easyMealDays.map((d) => d.toString()))}-${JSON.stringify(takeoutDays.map((d) => d.toString()))}`;
		if (newKey !== lastGeneratedKey) {
			mealDays = generateMeals(startDate, endDate, easyMealDays, takeoutDays, data.recipes);
			lastGeneratedKey = newKey;
		}
	});

	// Initialize the days when start/end date changes
	$effect(() => {
		easyMealDays = getEveryDay(startDate, endDate, 'Monday');
		takeoutDays = [...getEveryDay(startDate, endDate, 'Friday'), getNextDay(startDate, 'Monday')];
	});

	let dialogOpen = $state(false);
	let activeMeal = $state<MealDate | null>(null);

	let shoppingList = $derived(getShoppingList(mealDays, data.recipes, data.ingredients));

	function getStartDate(): Temporal.PlainDate {
		const todayDate = today();
		let firstSaturday = getFirstDayOfNextMonth(todayDate, 'Saturday');
		if (Temporal.PlainDate.compare(firstSaturday, todayDate) < 0) {
			const nextMonth = todayDate.with({ day: 1 }).add({ months: 1 });
			firstSaturday = getFirstDayOfNextMonth(nextMonth, 'Saturday');
		}

		return firstSaturday;
	}

	function getEndDate(): Temporal.PlainDate {
		const todayDate = today();
		const nextMonth = todayDate.with({ day: 1 }).add({ months: 1 });
		const firstSaturday = getFirstDayOfNextMonth(nextMonth, 'Saturday');

		return firstSaturday.subtract({ days: 1 });
	}

	function handleRandomiseClick(date: Temporal.PlainDate): void {
		const meal = mealDays.find((meal) => meal.date.equals(date));
		if (meal) {
			meal.meal = getMealForDate(date, easyMealDays, takeoutDays, data.recipes, mealDays);
		}
	}

	function handlePickClick(date: Temporal.PlainDate): void {
		const meal = mealDays.find((meal) => meal.date.equals(date));
		if (meal) {
			activeMeal = meal;
			dialogOpen = true;
		}
	}

	function handleTakeoutClick(date: Temporal.PlainDate): void {
		const meal = mealDays.find((meal) => meal.date.equals(date));
		if (meal) {
			const isTakeoutDay = takeoutDays.some((day) => day.equals(date));

			if (meal.meal === 'Takeout') {
				// Remove from takeout
				takeoutDays = takeoutDays.filter((day) => !day.equals(date));
			} else {
				// Add to takeout
				if (!isTakeoutDay) {
					takeoutDays = [...takeoutDays, date];
				}
			}
		}
	}

	function toggleDialog(): void {
		dialogOpen = !dialogOpen;
	}

	function handlePickMeal(meal: string): void {
		if (activeMeal) {
			activeMeal.meal = meal;
			// Trigger reactivity by reassigning the array
			mealDays = [...mealDays];
		}
		dialogOpen = false;
	}
</script>

<h1>Meal generator</h1>

<Modal body header="Pick a meal" isOpen={dialogOpen} toggle={toggleDialog}>
	<MealPicker recipes={data.recipes} onPick={handlePickMeal} />
</Modal>

<TabContent>
	<TabPane tabId="meals" tab="Meals" active>
		<MealCalendar
			{mealDays}
			{startDate}
			{endDate}
			onRandomiseClick={handleRandomiseClick}
			onPickClick={handlePickClick}
			onTakeoutClick={handleTakeoutClick}
		/>
		<Button
			color="primary"
			on:click={() => {
				easyMealDays = getEveryDay(startDate, endDate, 'Monday');
				takeoutDays = getEveryDay(startDate, endDate, 'Friday');
			}}
		>
			Generate Meals
		</Button>
	</TabPane>

	<TabPane tabId="ingredients" tab="Shopping List">
		<h2>Fresh</h2>
		<ul>
			{#each shoppingList.fresh.toSorted((a, b) => a.week - b.week) as week (week.week)}
				<li>
					Week {week.week}

					<ul>
						{#each week.ingredients as ingredient (ingredient.ingredient)}
							<li>
								{ingredient.ingredient} - {ingredient.amount}
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
		<h2>Pantry</h2>
		<ul>
			{#each shoppingList.pantry as ingredient (ingredient.ingredient)}
				<li>
					{ingredient.ingredient} - {ingredient.amount}
				</li>
			{/each}
		</ul>
	</TabPane>

	<TabPane tabId="settings" tab="Settings">
		<FormGroup>
			<Label for="start-date">Start Date</Label>
			<DatePicker id="start-date" bind:date={startDate} />
		</FormGroup>
		<FormGroup>
			<Label for="end-date">End Date</Label>
			<DatePicker id="end-date" bind:date={endDate} min={startDate} />
		</FormGroup>
		<DateListSelector bind:dates={easyMealDays} legend="Easy Meal Days" {startDate} {endDate} />
		<DateListSelector bind:dates={takeoutDays} legend="Takeout Days" {startDate} {endDate} />
	</TabPane>
</TabContent>
