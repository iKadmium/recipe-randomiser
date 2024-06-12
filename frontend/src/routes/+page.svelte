<script lang="ts">
	import { Difficulty, type IngredientWithAmount, type Recipe } from '$lib/models/recipe';
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardText,
		CardTitle,
		Icon,
		TabContent,
		TabPane
	} from '@sveltestrap/sveltestrap';
	import AutoComplete from '../components/AutoComplete.svelte';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';

	export let data: PageData;

	let recipes = writable<Recipe[]>([]);
	let ingredients: IngredientWithAmount[] = [];

	recipes.subscribe((value) => calculateIngredients());

	function sum(numbers: number[]): number {
		let running = 0;
		for (const number of numbers) {
			running += number;
		}
		return running;
	}

	function calculateIngredients() {
		const ingredientNames = $recipes
			.flatMap((x) => x.ingredients)
			.flatMap((x) => x.ingredient)
			.filter((x, i, arr) => arr.indexOf(x) === i);

		ingredients = ingredientNames.map((x) => ({
			ingredient: x,
			amount: sum(
				$recipes
					.flatMap((recipe) => recipe.ingredients)
					.filter((ingredientWithAmount) => ingredientWithAmount.ingredient === x)
					.map((ingredient) => ingredient.amount)
			)
		}));
	}

	function addRandomRecipe() {
		const alreadyHasHardRecipe = $recipes.some((x) => x.difficulty === Difficulty.Hard);
		const legitRecipes = Object.values(data.recipes)
			.filter((x) => !$recipes.includes(x))
			.filter((x) => !alreadyHasHardRecipe || x.difficulty < Difficulty.Hard);
		if (legitRecipes.length > 0) {
			const randomIndex = Math.floor(legitRecipes.length * Math.random());
			const recipe = legitRecipes[randomIndex];
			addRecipe(recipe.name);
		}
	}

	function addRecipe(name: string) {
		recipes.set([...$recipes, data.recipes[name]]);
	}

	function removeRecipe(index: number) {
		const newRecipes = [...$recipes];
		newRecipes.splice(index, 1);
		recipes.set(newRecipes);
	}
</script>

<h1>Meal generator</h1>

<TabContent>
	<TabPane tabId="meals" tab="Meals" active>
		<h2>Meals</h2>

		<div class="card-stack">
			{#each $recipes as item, index}
				<Card class="full-height-card">
					<CardHeader>
						<CardTitle>
							{item.name}
						</CardTitle>
					</CardHeader>
					<CardBody>
						<CardText>
							<dl>
								<dt>Difficulty</dt>
								<dd>{Difficulty[item.difficulty]}</dd>

								<dt>Tags</dt>
								<dd>{item.tags.join(', ')}</dd>
							</dl>
						</CardText>
					</CardBody>
					<CardFooter>
						<Button color="danger" on:click={() => removeRecipe(index)}>
							<Icon name="trash" />
						</Button>
					</CardFooter>
				</Card>
			{/each}
			<Card class="full-height-card">
				<CardBody>
					<Button outline class="full-size-button" on:click={() => addRandomRecipe()}>
						<Icon class="big-icon" name="dice-3" />
					</Button>
				</CardBody>
			</Card>
		</div>
		<AutoComplete
			noun="recipe"
			options={Object.keys(data.recipes)}
			on:existing={(event) => addRecipe(event.detail)}
		/>
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

<style>
	.card-stack {
		display: grid;

		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		padding-bottom: 1rem;
	}

	:global(.full-size-button) {
		width: 100%;
		height: 100%;
		border: none;
		background: none;
	}

	:global(.full-height-card) {
		min-height: 12rem;
	}

	:global(.big-icon) {
		font-size: 64px;
	}
</style>
