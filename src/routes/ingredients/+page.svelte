<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import CardDeck from '../../components/CardDeck.svelte';
	import IngredientListItem from '../../components/IngredientListItem.svelte';
	import type { PageProps } from './$types';
	import { getDatabaseEntries } from '$lib/models/database';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/ingredient/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete ingredient:', resp.statusText);
			return;
		}
		delete ingredientsRaw[key];
	}

	let { data }: PageProps = $props();
	let ingredientsRaw = $state(data.ingredients);
	let ingredients = $derived(
		getDatabaseEntries(ingredientsRaw).toSorted(([_keyA, ingredientA], [_keyB, ingredientB]) => {
			return ingredientA.name.localeCompare(ingredientB.name);
		})
	);
</script>

<h1>Ingredients</h1>

<Button color="primary" href="/ingredients/new">New Ingredient</Button>

<CardDeck>
	{#each ingredients as [key, ingredient] (key)}
		<IngredientListItem {ingredient} {key} onDelete={() => handleDelete(key)} />
	{/each}
</CardDeck>
