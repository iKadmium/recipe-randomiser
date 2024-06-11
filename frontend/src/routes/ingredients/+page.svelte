<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import IngredientListItem from '../../components/IngredientListItem.svelte';
	import type { PageData } from './$types';
	import { ingredientsDataSource } from '$lib';

	async function handleDelete(key: string) {
		await ingredientsDataSource.delete(key);
		delete data[key];
		data = data;
	}

	export let data: PageData;
</script>

<h1>Ingredients</h1>

<Button color="primary" href="/ingredients/new">New Ingredient</Button>

<ul>
	{#each Object.entries(data) as [key, ingredient]}
		<IngredientListItem {ingredient} {key} on:delete={() => handleDelete(key)} />
	{/each}
</ul>
