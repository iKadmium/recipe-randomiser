<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Ingredient } from '$lib/models/ingredient';
	import IngredientEditor from '../../../components/IngredientEditor.svelte';

	const initial: Ingredient = {
		fresh: false,
		name: '',
		unit: 'things'
	};

	async function handleSubmit(ingredient: Ingredient) {
		const resp = await fetch('/api/ingredient', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ingredient)
		});
		if (!resp.ok) {
			console.error('Failed to save ingredient:', resp.statusText);
			return;
		}
		await goto('/ingredients');
	}
</script>

<h1>New Ingredient</h1>

<IngredientEditor ingredient={initial} onSubmit={handleSubmit} />
