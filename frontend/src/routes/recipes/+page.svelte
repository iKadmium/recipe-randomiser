<script lang="ts">
	import { recipesDataSource } from '$lib';
	import { Button } from '@sveltestrap/sveltestrap';
	import RecipeListItem from '../../components/RecipeListItem.svelte';
	import type { PageData } from './$types';

	async function handleDelete(key: string) {
		await recipesDataSource.delete(key);
		delete data[key];
		data = data;
	}

	export let data: PageData;
</script>

<h1>Recipes</h1>

<Button color="primary" href="/recipes/new">New Recipe</Button>

<ul>
	{#each Object.entries(data) as [key, recipe]}
		<RecipeListItem {recipe} {key} on:delete={() => handleDelete(key)} />
	{/each}
</ul>
