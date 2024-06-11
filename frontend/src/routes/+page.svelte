<script lang="ts">
	import { Button, FormGroup, Input, TabContent, TabPane } from '@sveltestrap/sveltestrap';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import type { IngredientWithAmount, Recipe } from '$lib/models/recipe';

	let days: number = 4;

	export let data: PageData;

	let recipes: Recipe[] = [];
	let ingredients: IngredientWithAmount[] = [];

	function sum(numbers: number[]): number {
		let running = 0;
		for (const number of numbers) {
			running += number;
		}
		return running;
	}

	function generate() {
		const sorted = Object.values(data.recipes)
			.map((x) => ({ item: x, value: Math.random() * 20 + x.priority }))
			.sort((a, b) => a.value - b.value);
		recipes = sorted.slice(0, days).map((x) => x.item);

		const ingredientNames = recipes
			.flatMap((x) => x.ingredients)
			.flatMap((x) => x.ingredient)
			.filter((x, i, arr) => arr.indexOf(x) === i);
		ingredients = ingredientNames.map((x) => ({
			ingredient: x,
			amount: sum(
				recipes
					.flatMap((recipe) => recipe.ingredients)
					.filter((ingredientWithAmount) => ingredientWithAmount.ingredient === x)
					.map((ingredient) => ingredient.amount)
			)
		}));
	}
</script>

<h1>Meal generator</h1>

<FormGroup floating label="Days">
	<Input type="number" bind:value={days} />
</FormGroup>
<Button color="primary" on:click={() => generate()}>Generate</Button>

<TabContent>
	<TabPane tabId="meals" tab="Meals" active>
		<h2>Meals</h2>
		<ul>
			{#each recipes as item}
				<li>{item.name}</li>
			{/each}
		</ul>
	</TabPane>
	<TabPane tabId="ingredients" tab="Shopping List">
		<h2>Shopping List</h2>
		<ul>
			{#each ingredients as ingredient}
				<li>{ingredient.ingredient} - {ingredient.amount}</li>
			{/each}
		</ul>
	</TabPane>
</TabContent>
