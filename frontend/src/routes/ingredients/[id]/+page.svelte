<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ingredientsDataSource } from '$lib';
	import type { Ingredient } from '$lib/models/ingredient';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import IngredientEditor from '../../../components/IngredientEditor.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const ingredient: Writable<Ingredient> = writable(data);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if ($ingredient) {
			await ingredientsDataSource.put($page.params.id, $ingredient);
			await goto('/ingredients');
		}
	}
</script>

<h1>Edit Ingredient</h1>

<IngredientEditor {ingredient} on:submit={handleSubmit} />
