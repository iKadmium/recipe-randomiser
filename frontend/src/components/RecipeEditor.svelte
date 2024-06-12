<script lang="ts" context="module">
	export interface RecipeEditorEvents {
		save: {
			recipe: Recipe;
		};
	}
</script>

<script lang="ts">
	import { ingredientsDataSource, tagsDataSource } from '$lib';
	import type { Database } from '$lib/models/database';
	import type { Ingredient } from '$lib/models/ingredient';
	import { Difficulty, type IngredientWithAmount, type Recipe } from '$lib/models/recipe';
	import type { Tag } from '$lib/models/tag';
	import { Button, Form, FormGroup, Icon, Input, Modal, Table } from '@sveltestrap/sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import AutoComplete from './AutoComplete.svelte';
	export let recipe: Writable<Recipe>;
	export let ingredients: Database<Ingredient>;
	export let tags: Database<Tag>;

	const dispatch = createEventDispatcher<RecipeEditorEvents>();

	let isModalOpen = false;
	let amountInputRef: HTMLInputElement;
	let activeIngredient: { name: string; new: boolean } | null = null;

	function openModal(ingredient: typeof activeIngredient) {
		isModalOpen = true;
		activeIngredient = ingredient;
		window.setTimeout(() => {
			amountInputRef.focus();
		});
	}

	function handleDeleteIngredientClick(ingredientAndAmount: IngredientWithAmount) {
		const index = $recipe.ingredients.indexOf(ingredientAndAmount);
		$recipe.ingredients.splice(index, 1);
		recipe = recipe;
	}

	function handleSave() {
		dispatch('save', { recipe: $recipe });
	}

	function handleAmountInput(event: KeyboardEvent) {
		switch (event.key) {
			case 'Escape':
				handleAmountCancel();
				break;
			case 'Enter':
				handleAmountSubmit();
				break;
		}
	}

	function handleAmountCancel(event?: MouseEvent) {
		isModalOpen = false;
	}

	async function handleAmountSubmit(event?: MouseEvent) {
		if (!activeIngredient) {
			return;
		}

		let amount = parseInt(amountInputRef.value);
		if (!(amount > 0)) {
			amount = 1;
		}

		if (activeIngredient.new) {
			const ingredient: Ingredient = {
				name: activeIngredient.name,
				unit: 'things'
			};

			await ingredientsDataSource.post(ingredient);
		}
		$recipe.ingredients.push({
			amount,
			ingredient: activeIngredient.name
		});
		amountInputRef.value = '';
		recipe = recipe;
		isModalOpen = false;
	}

	function handleExistingTagAdd(tag: string) {
		$recipe.tags.push(tag);
		recipe = recipe;
	}

	async function handleNewTagAdd(tag: string) {
		await tagsDataSource.post({ name: tag });
		$recipe.tags.push(tag);
		recipe = recipe;
	}

	function handleDeleteTagClick(tag: string) {
		const index = $recipe.tags.indexOf(tag);
		$recipe.tags.splice(index, 1);
		recipe = recipe;
	}
</script>

<Form on:submit>
	<FormGroup floating label="Name">
		<Input placeholder="Name" bind:value={$recipe.name} />
	</FormGroup>

	<FormGroup floating label="Priority (higher numbers appear more often)">
		<Input placeholder="Priority" type="number" bind:value={$recipe.priority} min={1} max={5} />
	</FormGroup>

	<FormGroup label="Difficulty" floating>
		<Input type="select" bind:value={$recipe.difficulty}>
			<option value={Difficulty.Easy}>Easy</option>
			<option value={Difficulty.Medium}>Medium</option>
			<option value={Difficulty.Hard}>Hard</option>
		</Input>
	</FormGroup>

	<h2>Tags</h2>
	<Table>
		<tbody>
			{#each $recipe.tags as tag}
				<tr>
					<td>{tag}</td>
					<td>
						<Button color="danger" on:click={(event) => handleDeleteTagClick(tag)}>
							<Icon name="trash" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

	<AutoComplete
		noun="tag"
		allowAdd
		options={Object.keys(tags)}
		excludedOptions={$recipe.tags}
		on:existing={(item) => handleExistingTagAdd(item.detail)}
		on:new={(item) => handleNewTagAdd(item.detail)}
	/>

	<h2>Ingredients</h2>

	<Table>
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
						<Button
							color="danger"
							on:click={(event) => handleDeleteIngredientClick(ingredientAndAmount)}
						>
							<Icon name="trash" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

	<AutoComplete
		options={Object.keys(ingredients)}
		allowAdd
		noun="ingredient"
		excludedOptions={$recipe.ingredients.map((x) => x.ingredient)}
		on:existing={(item) => openModal({ name: item.detail, new: false })}
		on:new={(item) => openModal({ name: item.detail, new: true })}
	/>

	<Button color="primary" on:click={handleSave}>Save</Button>
</Form>

<Modal isOpen={isModalOpen}>
	<FormGroup floating label="Amount">
		<input
			class="form-control"
			type="number"
			on:keydown={handleAmountInput}
			bind:this={amountInputRef}
		/>
	</FormGroup>
	<Button color="primary" on:click={handleAmountSubmit}>OK</Button>
	<Button type="cancel" on:click={handleAmountCancel}>Cancel</Button>
</Modal>
