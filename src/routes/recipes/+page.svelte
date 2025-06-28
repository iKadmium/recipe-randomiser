<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import RecipeListItem from '../../components/RecipeListItem.svelte';
	import type { PageData } from './$types';
	import CardDeck from '../../components/CardDeck.svelte';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/recipe/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete recipe:', resp.statusText);
			return;
		}
		delete data[key];
		data = data;
	}

	export let data: PageData;
</script>

<h1>Recipes</h1>

<Button color="primary" href="/recipes/new">New Recipe</Button>

<CardDeck>
	{#each Object.entries(data) as [key, recipe] (key)}
		<RecipeListItem {recipe} {key} onDelete={() => handleDelete(key)} />
	{/each}
</CardDeck>
