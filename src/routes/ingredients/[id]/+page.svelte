<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Ingredient } from '$lib/models/ingredient';
	import IngredientEditor from '../../../components/IngredientEditor.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	async function handleSubmit(ingredient: Ingredient) {
		if (ingredient) {
			const resp = await fetch(`/api/ingredient/${data.ingredient.name}`, {
				method: 'PUT',
				body: JSON.stringify(ingredient),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!resp.ok) {
				console.error('Failed to save ingredient:', resp.statusText);
				return;
			}
			await goto('/ingredients');
		}
	}
</script>

<h1>Edit Ingredient</h1>

<IngredientEditor ingredient={data.ingredient} onSubmit={handleSubmit} />
