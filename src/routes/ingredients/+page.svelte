<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import CardDeck from '../../components/CardDeck.svelte';
	import IngredientListItem from '../../components/IngredientListItem.svelte';
	import type { PageData } from './$types';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/ingredient/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete ingredient:', resp.statusText);
			return;
		}
		delete data[key];
		data = data;
	}

	export let data: PageData;
</script>

<h1>Ingredients</h1>

<Button color="primary" href="/ingredients/new">New Ingredient</Button>

<CardDeck>
	{#each Object.entries(data) as [key, ingredient]}
		<IngredientListItem {ingredient} {key} onDelete={() => handleDelete(key)} />
	{/each}
</CardDeck>
