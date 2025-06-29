<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import CardDeck from '../../components/CardDeck.svelte';
	import RecipeListItem from '../../components/RecipeListItem.svelte';
	import type { PageProps } from './$types';
	import { getDatabaseEntries } from '$lib/models/database';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/recipe/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete recipe:', resp.statusText);
			return;
		}
		delete recipesRaw[key];
	}

	let { data }: PageProps = $props();

	let recipesRaw = $state(data.recipes);
	let recipes = $derived(
		getDatabaseEntries(recipesRaw).toSorted(([_keyA, recipeA], [_keyB, recipeB]) => {
			return recipeA.name.localeCompare(recipeB.name);
		})
	);
</script>

<h1>Recipes</h1>

<Button color="primary" href="/recipes/new">New Recipe</Button>

<CardDeck>
	{#each recipes as [key, recipe] (key)}
		<RecipeListItem {recipe} {key} onDelete={() => handleDelete(key)} />
	{/each}
</CardDeck>
