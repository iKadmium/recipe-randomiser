<script lang="ts">
	import { goto } from '$app/navigation';
	import { Difficulty, type Recipe } from '$lib/models/recipe';
	import RecipeEditor from '../../../components/RecipeEditor.svelte';
	import type { PageProps } from './$types';

	const initialRecipe: Recipe = {
		name: '',
		ingredients: [],
		priority: 3,
		tags: [],
		difficulty: Difficulty.Medium
	};

	let { data }: PageProps = $props();

	async function handleSave(recipe: Recipe) {
		const resp = await fetch('/api/recipe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(recipe)
		});
		if (!resp.ok) {
			console.error('Failed to save recipe:', resp.statusText);
			return;
		}
		await goto('/recipes');
	}
</script>

<h1>New Recipe</h1>
<RecipeEditor
	recipe={initialRecipe}
	ingredients={data.ingredients}
	tags={data.tags}
	onSave={(recipe) => handleSave(recipe)}
/>
