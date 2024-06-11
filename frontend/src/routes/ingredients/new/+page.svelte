<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ingredientsDataSource } from '$lib';
	import type { Ingredient } from '$lib/models/ingredient';
	import { Button, Form, FormGroup, Input } from '@sveltestrap/sveltestrap';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import IngredientEditor from '../../../components/IngredientEditor.svelte';

	const ingredient = writable<Ingredient>({
		name: '',
		unit: ''
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if ($ingredient) {
			await ingredientsDataSource.post($ingredient);
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
