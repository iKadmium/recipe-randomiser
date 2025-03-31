<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Recipe } from '$lib/models/recipe';
	import RecipeEditor from '../../../components/RecipeEditor.svelte';

	let { data } = $props();

	async function handleSave(recipe: Recipe) {
		const resp = await fetch(`/api/recipe/${data.id}`, {
			method: 'PUT',
			body: JSON.stringify(recipe),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!resp.ok) {
			console.error('Failed to save recipe:', resp.statusText);
			return;
		}
		await goto('/recipes');
	}
</script>

<h1>Recipe Editor</h1>
<RecipeEditor
	recipe={data.recipe}
	tags={data.tags}
	ingredients={data.ingredients}
	onSave={(recipe) => handleSave(recipe)}
/>
