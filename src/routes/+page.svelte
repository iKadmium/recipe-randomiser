<script lang="ts">
	import { Button, FormGroup, Label, Modal, TabContent, TabPane } from '@sveltestrap/sveltestrap';

	import { generateMeals, getMealForDate, type MealDate } from '$lib/meal-generator';
	import { getShoppingList } from '$lib/shopping-list';
	import { getEveryDay, getFirstDayOfNextMonth, getNextDay, toUTCIsoString } from '$lib/util';
	import DateListSelector from '../components/DateListSelector.svelte';
	import DatePicker from '../components/DatePicker.svelte';
	import MealCalendar from '../components/MealCalendar.svelte';
	import MealPicker from '../components/MealPicker.svelte';

	let { data } = $props();

	let startDate = $state(getStartDate());
	let endDate = $state(getEndDate());

	let easyMealDays = $state<Date[]>([]);
	let takeoutDays = $state<Date[]>([]);
	let mealDays = $state<MealDate[]>([]);
	let lastGeneratedKey = $state(''); // Track when we need to regenerate

	$effect(() => {
		easyMealDays = getEveryDay(startDate, endDate, 'Monday');
		takeoutDays = [...getEveryDay(startDate, endDate, 'Friday'), getNextDay(startDate, 'Monday')];
		
		// Create a key to track when we need to regenerate meals
		const newKey = `${startDate.getTime()}-${endDate.getTime()}-${data.recipes}`;
		if (newKey !== lastGeneratedKey) {
			mealDays = generateMeals(startDate, endDate, easyMealDays, takeoutDays, data.recipes);
			lastGeneratedKey = newKey;
		}
	});

	let dialogOpen = $state(false);
	let activeMeal = $state<MealDate | null>(null);

	let shoppingList = $derived(getShoppingList(mealDays, data.recipes, data.ingredients));

	function getStartDate(): Date {
		const today = new Date();
		let firstSaturday = getFirstDayOfNextMonth(today, 'Saturday');
		if (firstSaturday < today) {
			const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
			firstSaturday = getFirstDayOfNextMonth(nextMonth, 'Saturday');
		}

		return firstSaturday;
	}

	function getEndDate(): Date {
		const today = new Date();
		const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
		const firstSaturday = getFirstDayOfNextMonth(nextMonth, 'Saturday');

		const dayBeforeFirstSaturday = new Date(firstSaturday);
		dayBeforeFirstSaturday.setDate(firstSaturday.getDate() - 1);

		return dayBeforeFirstSaturday;
	}

	function handleRandomiseClick(date: Date): void {
		console.log('Randomising meal for date:', date);
		const meal = mealDays.find((meal) => toUTCIsoString(meal.date) === toUTCIsoString(date));
		console.log('Found meal:', meal);
		if (meal) {
			console.log('Meal before randomisation:', meal.meal);
			meal.meal = getMealForDate(date, easyMealDays, takeoutDays, data.recipes, mealDays);
			console.log('Meal after randomisation:', meal.meal);
			// Trigger reactivity by reassigning the array
			mealDays = [...mealDays];
		}
	}

	function handlePickClick(date: Date): void {
		const meal = mealDays.find((meal) => toUTCIsoString(meal.date) === toUTCIsoString(date));
		if (meal) {
			activeMeal = meal;
			dialogOpen = true;
		}
	}

	function handleTakeoutClick(date: Date): void {
		const meal = mealDays.find((meal) => toUTCIsoString(meal.date) === toUTCIsoString(date));
		if (meal) {
			const dateString = toUTCIsoString(date);
			const isTakeoutDay = takeoutDays.some((day: Date) => toUTCIsoString(day) === dateString);

			if (meal.meal === 'Takeout') {
				// Remove from takeout
				takeoutDays = takeoutDays.filter((day: Date) => toUTCIsoString(day) !== dateString);
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
			<DatePicker id="start-date" bind:date={startDate} min={new Date()} />
		</FormGroup>
		<FormGroup>
			<Label for="end-date">End Date</Label>
			<DatePicker id="end-date" bind:date={endDate} min={startDate} />
		</FormGroup>
		<DateListSelector bind:dates={easyMealDays} legend="Easy Meal Days" {startDate} {endDate} />
		<DateListSelector bind:dates={takeoutDays} legend="Takeout Days" {startDate} {endDate} />
	</TabPane>
</TabContent>
