<script lang="ts" context="module">
	export interface IngredientListItemEvents {
		delete?: {};
	}
</script>

<script lang="ts">
	import type { Ingredient } from '$lib/models/ingredient';
	import { Button, ButtonGroup, Card, CardBody, CardFooter, Icon } from '@sveltestrap/sveltestrap';
	import { createEventDispatcher } from 'svelte';

	export let ingredient: Ingredient;
	export let key: string;

	const dispatch = createEventDispatcher<IngredientListItemEvents>();

	async function handleDeleteClick() {
		dispatch('delete');
	}
</script>

<Card>
	<CardBody>
		{ingredient.name}
	</CardBody>
	<CardFooter>
		<ButtonGroup>
			<Button href={`/ingredients/${key}`} color="warning">
				<Icon name="pencil-square" />
			</Button>
			<Button color="danger" on:click={(event) => handleDeleteClick()}>
				<Icon name="trash" />
			</Button>
		</ButtonGroup>
	</CardFooter>
</Card>
