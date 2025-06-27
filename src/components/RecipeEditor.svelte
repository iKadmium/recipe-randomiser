<script lang="ts" module>
	export interface RecipeEditorProps {
		recipe: Recipe;
		ingredients: Database<Ingredient>;
		tags: Database<Tag>;
		onSave: (recipe: Recipe) => unknown | Promise<unknown>;
	}
</script>

<script lang="ts">
	import type { Database } from '$lib/models/database';
	import type { Ingredient } from '$lib/models/ingredient';
	import { Difficulty, type IngredientWithAmount, type Recipe } from '$lib/models/recipe';
	import type { Tag } from '$lib/models/tag';
	import {
		Button,
		Form,
		FormGroup,
		Icon,
		Input,
		Label,
		Modal,
		Table
	} from '@sveltestrap/sveltestrap';
	import AutoComplete from './AutoComplete.svelte';

	let {
		recipe: initialRecipe,
		ingredients,
		tags: initialTags,
		onSave
	}: RecipeEditorProps = $props();

	let tags: Database<Tag> = $state(initialTags);
	let recipe: Recipe = $state(initialRecipe);
	let isModalOpen = $state(false);
	let amountInputRef: HTMLInputElement | null = $state(null);
	let activeIngredient: { name: string; new: boolean } | null = $state(null);
	let hasMaxPerMonth: boolean = $state(initialRecipe.maxPerMonth !== undefined);

	function openModal(ingredient: typeof activeIngredient) {
		isModalOpen = true;
		activeIngredient = ingredient;
		window.setTimeout(() => {
			amountInputRef?.focus();
		});
	}

	function handleDeleteIngredientClick(ingredientAndAmount: IngredientWithAmount) {
		const index = recipe.ingredients.indexOf(ingredientAndAmount);
		recipe.ingredients.splice(index, 1);
		recipe = recipe;
	}

	function handleSave() {
		recipe.maxPerMonth = hasMaxPerMonth ? recipe.maxPerMonth : undefined;
		onSave(recipe);
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
		if (!activeIngredient || !amountInputRef) {
			return;
		}

		let amount = parseInt(amountInputRef.value);
		if (!(amount > 0)) {
			amount = 1;
		}

		if (activeIngredient.new) {
			const ingredient: Ingredient = {
				name: activeIngredient.name,
				unit: 'things',
				fresh: false
			};

			const resp = await fetch('/api/ingredient', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(ingredient)
			});
			if (!resp.ok) {
				console.error('Failed to save ingredient:', resp.statusText);
				return;
			}
		}
		recipe.ingredients.push({
			amount,
			ingredient: activeIngredient.name
		});
		amountInputRef.value = '';
		recipe = recipe;
		isModalOpen = false;
	}

	function handleExistingTagAdd(tag: string) {
		recipe.tags.push(tag);
		recipe = recipe;
	}

	async function handleNewTagAdd(tag: string) {
		const resp = await fetch('/api/tag', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: tag })
		});
		if (!resp.ok) {
			console.error('Failed to save tag:', resp.statusText);
			return;
		}
		recipe.tags.push(tag);
		recipe = recipe;
	}

	function handleDeleteTagClick(tag: string) {
		const index = recipe.tags.indexOf(tag);
		recipe.tags.splice(index, 1);
		recipe = recipe;
	}
</script>

<Form on:submit>
	<FormGroup floating label="Name">
		<Input placeholder="Name" bind:value={recipe.name} />
	</FormGroup>

	<FormGroup floating label="Priority (higher numbers appear more often)">
		<Input placeholder="Priority" type="number" bind:value={recipe.priority} min={1} max={5} />
	</FormGroup>

	<FormGroup label="Difficulty" floating>
		<Input type="select" bind:value={recipe.difficulty}>
			<option value={Difficulty.Easy}>Easy</option>
			<option value={Difficulty.Medium}>Medium</option>
			<option value={Difficulty.Hard}>Hard</option>
		</Input>
	</FormGroup>

	<Input type="checkbox" bind:checked={hasMaxPerMonth} label="Max Times Per Month" />

	{#if hasMaxPerMonth}
		<FormGroup floating label="Max Per Month">
			<Input type="number" placeholder="Max Per Month" bind:value={recipe.maxPerMonth} min={1} />
		</FormGroup>
	{/if}

	<h2>Tags</h2>
	<Table>
		<tbody>
			{#each recipe.tags as tag}
				<tr>
					<td>{tag}</td>
					<td>
						<Button color="danger" on:click={() => handleDeleteTagClick(tag)}>
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
		options={Object.values(tags).map((x) => x.name)}
		excludedOptions={recipe.tags}
		onExistingAdd={(item) => handleExistingTagAdd(item)}
		onNewAdd={(item) => handleNewTagAdd(item)}
	/>

	<h2>Ingredients</h2>

	<Table>
		<thead>
			<tr>
				<th>Amount</th>
				<th>Item</th>
			</tr>
		</thead>
		<tbody>
			{#each recipe.ingredients as ingredientAndAmount}
				<tr>
					<td>{ingredientAndAmount.amount}</td>
					<td>{ingredientAndAmount.ingredient}</td>
					<td>
						<Button
							color="danger"
							on:click={() => handleDeleteIngredientClick(ingredientAndAmount)}
						>
							<Icon name="trash" />
						</Button>
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

	<AutoComplete
		options={Object.values(ingredients).map((x) => x.name)}
		allowAdd
		noun="ingredient"
		excludedOptions={recipe.ingredients.map((x) => x.ingredient)}
		onExistingAdd={(item) => openModal({ name: item, new: false })}
		onNewAdd={(item) => openModal({ name: item, new: true })}
	/>

	<Button color="primary" on:click={handleSave}>Save</Button>
</Form>

<Modal isOpen={isModalOpen}>
	<FormGroup floating label="Amount">
		<input
			class="form-control"
			type="number"
			onkeydown={handleAmountInput}
			bind:this={amountInputRef}
		/>
	</FormGroup>
	<Button color="primary" on:click={handleAmountSubmit}>OK</Button>
	<Button type="cancel" on:click={handleAmountCancel}>Cancel</Button>
</Modal>
