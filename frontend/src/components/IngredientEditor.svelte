<script lang="ts">
	import type { Ingredient } from '$lib/models/ingredient';
	import { Button, Form, FormGroup, Input } from '@sveltestrap/sveltestrap';
	import type { Writable } from 'svelte/store';

	export let ingredient: Writable<Ingredient>;
</script>

<Form on:submit>
	<FormGroup floating label="Name">
		<Input placeholder="Name" bind:value={$ingredient.name} />
	</FormGroup>
	<FormGroup floating label="Unit">
		<Input placeholder="Unit" bind:value={$ingredient.unit} />
	</FormGroup>

	<Button color="primary">Save</Button>
</Form>
