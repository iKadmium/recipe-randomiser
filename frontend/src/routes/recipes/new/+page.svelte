<script lang="ts">
	import { writable } from 'svelte/store';
	import RecipeEditor from '../../../components/RecipeEditor.svelte';
	import type { PageData } from './$types';
	import type { Recipe } from '$lib/models/recipe';
	import { recipesDataSource } from '$lib';
	import { goto } from '$app/navigation';

	const recipe = writable<Recipe>({ name: '', ingredients: [], priority: 3 });
	export let data: PageData;

	async function handleSave(recipe: Recipe) {
		await recipesDataSource.post(recipe);
		await goto('/recipes');
	}
</script>

<h1>New Recipe</h1>
<RecipeEditor {recipe} ingredients={data} on:save={(event) => handleSave(event.detail.recipe)} />
