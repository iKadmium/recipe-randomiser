<script lang="ts">
	export interface IngredientEditorProps {
		ingredient: Ingredient;
		onSubmit: (ingredient: Ingredient) => void | Promise<void>;
	}
	import type { Ingredient } from '$lib/models/ingredient';
	import { Button, Form, FormGroup, Input } from '@sveltestrap/sveltestrap';

	let { ingredient: initialIngredient, onSubmit }: IngredientEditorProps = $props();
	const ingredient = $state(initialIngredient);
</script>

<Form on:submit={() => onSubmit(ingredient)}>
	<FormGroup floating label="Name">
		<Input placeholder="Name" bind:value={ingredient.name} />
	</FormGroup>
	<FormGroup floating label="Unit">
		<Input placeholder="Unit" bind:value={ingredient.unit} />
	</FormGroup>
	<Input label="Fresh" type="checkbox" bind:checked={ingredient.fresh} />

	<Button color="primary">Save</Button>
</Form>
