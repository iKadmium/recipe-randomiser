<script lang="ts" context="module">
	export interface IngredientSelectionEvents {
		existing: {
			key: string;
			amount: number;
		};
		new: {
			ingredient: Ingredient;
			amount: number;
		};
	}
</script>

<script lang="ts">
	import type { Database } from '$lib/models/database';
	import type { Ingredient } from '$lib/models/ingredient';
	import { Button, FormGroup, Input, Modal, colorMode } from '@sveltestrap/sveltestrap';
	import AutoCompleteSuggestion from './AutoCompleteSuggestion.svelte';
	import { createEventDispatcher } from 'svelte';
	import { ingredientsDataSource } from '$lib';
	let searchString: string = '';
	let selectedIndex = 0;

	const dispatch = createEventDispatcher<IngredientSelectionEvents>();

	export let ingredients: Database<Ingredient>;
	export let existingIngredients: string[];

	function handleSearchInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (searchString === '') {
			suggestions = [];
		} else {
			suggestions = Object.keys(ingredients)
				.filter((x) => !existingIngredients.includes(x))
				.filter((x) => x.toUpperCase().includes(searchString.toUpperCase()))
				.slice(0, 10);
		}
	}

	let suggestions: string[] = [];

	function handleSearchKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				if (selectedIndex < Object.keys(suggestions).length) {
					selectedIndex++;
				}
				event.preventDefault();
				break;
			case 'ArrowUp':
				if (selectedIndex > 0) {
					selectedIndex--;
				}
				event.preventDefault();
				break;
			case 'Enter':
				isModalOpen = true;
				setTimeout(() => {
					amountInputRef.focus();
				});
				event.preventDefault();
				break;
		}
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
		let amount = parseInt(amountInputRef.value);
		if (!(amount > 0)) {
			amount = 1;
		}
		if (selectedIndex === suggestions.length) {
			const ingredient: Ingredient = {
				name: searchString,
				unit: 'things'
			};

			await ingredientsDataSource.post(ingredient);
			dispatch('new', { ingredient, amount });
			suggestions = [];
		} else {
			const ingredientKey = suggestions[selectedIndex];
			dispatch('existing', { key: ingredientKey, amount });
			suggestions = [];
		}
		selectedIndex = 0;
		nameInputRef.value = '';
		searchString = '';
		isModalOpen = false;
	}

	let nameInputRef: HTMLInputElement;
	let amountInputRef: HTMLInputElement;
	let isModalOpen: boolean = false;
</script>

<FormGroup floating label="Name">
	<input
		class="form-control"
		type="text"
		bind:value={searchString}
		on:input={handleSearchInput}
		on:keydown={handleSearchKeyDown}
		bind:this={nameInputRef}
	/>

	{#if searchString.length > 0}
		<div class="suggestion-list light" style={`width: ${nameInputRef.clientWidth}px`}>
			{#each suggestions as key, index}
				<AutoCompleteSuggestion title={key} selected={selectedIndex === index} />
			{/each}
			<AutoCompleteSuggestion
				title={`Add new ingredient ${searchString}...`}
				selected={selectedIndex === Object.entries(suggestions).length}
			/>
		</div>
	{/if}
</FormGroup>

<Modal isOpen={isModalOpen}>
	<FormGroup floating label="Amount">
		<input
			class="form-control"
			type="number"
			on:keydown={handleAmountInput}
			bind:this={amountInputRef}
			on:input
		/>
	</FormGroup>
	<Button color="primary" on:click={handleAmountSubmit}>OK</Button>
	<Button type="cancel" on:click={handleAmountCancel}>Cancel</Button>
</Modal>

<style>
	.suggestion-list {
		display: flex;
		flex-direction: column;

		position: absolute;
	}
</style>
