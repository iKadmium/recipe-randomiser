<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Ingredient } from '$lib/models/ingredient';
	import { writable } from 'svelte/store';
	import IngredientEditor from '../../../components/IngredientEditor.svelte';

	const ingredient = writable<Ingredient>({
		name: '',
		unit: ''
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if ($ingredient) {
			const resp = await fetch('/api/ingredient', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify($ingredient)
			});
			if (!resp.ok) {
				console.error('Failed to save ingredient:', resp.statusText);
				return;
			}
			await goto('/ingredients');
		}
	}
</script>

<h1>New Ingredient</h1>

{#if $ingredient}
	<IngredientEditor {ingredient} on:submit={handleSubmit} />
{:else}
	<p>Loading...</p>
{/if}
