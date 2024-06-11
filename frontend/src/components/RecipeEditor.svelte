<script lang="ts" context="module">
	export interface RecipeEditorEvents {
		save: {
			recipe: Recipe;
		};
	}
</script>

<script lang="ts">
	import type { Database } from '$lib/models/database';
	import type { Ingredient } from '$lib/models/ingredient';
	import type { IngredientWithAmount, Recipe } from '$lib/models/recipe';
	import { Button, Form, FormGroup, Icon, Input } from '@sveltestrap/sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import IngredientSearcher from './IngredientSearcher.svelte';
	export let recipe: Writable<Recipe>;
	export let ingredients: Database<Ingredient>;

	const dispatch = createEventDispatcher<RecipeEditorEvents>();

	function handleAddExistingIngredient(key: string, amount: number) {
		$recipe.ingredients.push({ ingredient: key, amount });
		recipe = recipe;
	}

	function handleAddNewIngredient(ingredient: Ingredient, amount: number) {
		ingredients[ingredient.name] = ingredient;
		$recipe.ingredients.push({ ingredient: ingredient.name, amount });
		recipe = recipe;
	}

	function handleDeleteClick(ingredientAndAmount: IngredientWithAmount) {
		const index = $recipe.ingredients.indexOf(ingredientAndAmount);
		$recipe.ingredients.splice(index, 1);
		recipe = recipe;
	}

	function handleSave() {
		dispatch('save', { recipe: $recipe });
	}
</script>

<Form on:submit>
	<FormGroup floating label="Name">
		<Input placeholder="Name" bind:value={$recipe.name} />
	</FormGroup>

	<FormGroup floating label="Priority (higher numbers appear more often)">
		<Input placeholder="Priority" type="number" bind:value={$recipe.priority} min={1} max={5} />
	</FormGroup>

	<h2>Ingredients</h2>

	<table class="ingredients">
		<thead>
			<th>Amount</th>
			<th>Item</th>
		</thead>
		<tbody>
			{#each $recipe.ingredients as ingredientAndAmount}
				<tr>
					<td>{ingredientAndAmount.amount}</td>
					<td>{ingredientAndAmount.ingredient}</td>
					<td>
						<Button color="danger" on:click={(event) => handleDeleteClick(ingredientAndAmount)}>
							<Icon name="trash" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<IngredientSearcher
		{ingredients}
		existingIngredients={$recipe.ingredients.map((x) => x.ingredient)}
		on:existing={(item) => handleAddExistingIngredient(item.detail.key, item.detail.amount)}
		on:new={(item) => handleAddNewIngredient(item.detail.ingredient, item.detail.amount)}
	/>

	<Button color="primary" on:click={handleSave}>Save</Button>
</Form>

<style>
	.ingredients td {
		padding: 0 1rem;
	}

	.ingredients th {
		padding: 0 1rem;
	}
</style>
