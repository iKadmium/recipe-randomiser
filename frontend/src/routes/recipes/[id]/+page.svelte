<script lang="ts">
	import { goto } from '$app/navigation';
	import { recipesDataSource } from '$lib';
	import type { Recipe } from '$lib/models/recipe';
	import { writable } from 'svelte/store';
	import RecipeEditor from '../../../components/RecipeEditor.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const recipe = writable<Recipe>(data.recipe);

	async function handleSave(recipe: Recipe) {
		await recipesDataSource.post(recipe);
		await goto('/recipes');
	}
</script>

<h1>Recipe Editor</h1>
<RecipeEditor
	{recipe}
	ingredients={data.ingredients}
	on:save={(event) => handleSave(event.detail.recipe)}
/>
