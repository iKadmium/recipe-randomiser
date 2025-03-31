<script lang="ts">
	import { Button, FormGroup, Label, Modal, TabContent, TabPane } from '@sveltestrap/sveltestrap';

	import { generateMeals, getMealForDate, type MealDate } from '$lib/meal-generator';
	import { getShoppingList } from '$lib/shopping-list';
	import { getEveryDay, getFirstSaturdayOfNextMonth, toUTCIsoString } from '$lib/util';
	import DateListSelector from '../components/DateListSelector.svelte';
	import DatePicker from '../components/DatePicker.svelte';
	import MealCalendar from '../components/MealCalendar.svelte';
	import MealPicker from '../components/MealPicker.svelte';

	let { data } = $props();

	let startDate = $state(getStartDate());
	let endDate = $state(getEndDate());
	let easyMealDays = $state<Date[]>(getEveryDay(getStartDate(), getEndDate(), 'Monday'));
	let takeoutDays = $state<Date[]>(getEveryDay(getStartDate(), getEndDate(), 'Friday'));
	let mealDays = $state<MealDate[]>(
		// svelte-ignore state_referenced_locally
		generateMeals(startDate, endDate, easyMealDays, takeoutDays, data.recipes)
	);

	let dialogOpen = $state(false);
	let activeMeal = $state<MealDate | null>(null);

	let shoppingList = $derived(getShoppingList(mealDays, data.recipes, data.ingredients));

	function getStartDate(): Date {
		const today = new Date();
		let firstSaturday = getFirstSaturdayOfNextMonth(today);

		if (firstSaturday < today) {
			const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
			firstSaturday = getFirstSaturdayOfNextMonth(nextMonth);
		}

		return firstSaturday;
	}

	function getEndDate(): Date {
		const today = new Date();
		const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
		const firstSaturday = getFirstSaturdayOfNextMonth(nextMonth);

		const dayBeforeFirstSaturday = new Date(firstSaturday);
		dayBeforeFirstSaturday.setDate(firstSaturday.getDate() - 1);

		return dayBeforeFirstSaturday;
	}

	function handleRandomiseClick(date: Date): void {
		const meal = mealDays.find((meal) => toUTCIsoString(meal.date) === toUTCIsoString(date));
		if (meal) {
			meal.meal = getMealForDate(date, easyMealDays, takeoutDays, data.recipes);
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
			if (meal.meal === 'Takeout') {
				takeoutDays = takeoutDays.filter((day) => toUTCIsoString(day) !== toUTCIsoString(date));
			} else {
				takeoutDays.push(date);
			}
			meal.meal = getMealForDate(date, easyMealDays, takeoutDays, data.recipes);
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
			onRandomiseClick={handleRandomiseClick}
			onPickClick={handlePickClick}
			onTakeoutClick={handleTakeoutClick}
		/>
		<Button
			color="primary"
			on:click={() =>
				(mealDays = generateMeals(startDate, endDate, easyMealDays, takeoutDays, data.recipes))}
		>
			Generate Meals
		</Button>
	</TabPane>

	<TabPane tabId="ingredients" tab="Shopping List">
		<h2>Fresh</h2>
		<ul>
			{#each shoppingList.fresh.toSorted((a, b) => a.week - b.week) as week}
				<li>
					Week {week.week}

					<ul>
						{#each week.ingredients as ingredient}
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
			{#each shoppingList.pantry as ingredient}
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
