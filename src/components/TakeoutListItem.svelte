<script lang="ts" context="module">
	export interface IngredientListItemEvents {
		delete?: {};
	}
</script>

<script lang="ts">
	import type { Takeout } from '$lib/models/takeout';
	import { Button, ButtonGroup, Card, CardBody, CardFooter, Icon } from '@sveltestrap/sveltestrap';
	import { createEventDispatcher } from 'svelte';

	export let takeout: Takeout;
	export let key: string;

	const dispatch = createEventDispatcher<IngredientListItemEvents>();

	async function handleDeleteClick() {
		dispatch('delete');
	}

	async function handleEditClick() {
		const newName = window.prompt('Please enter the new name for the takeout:', takeout.name);
		if (newName && newName.trim() !== '') {
			takeout.name = newName;
			await fetch(`/api/takeout/${key}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: takeout.name })
			});
		}
	}
</script>

<Card>
	<CardBody>
		{takeout.name}
	</CardBody>
	<CardFooter>
		<ButtonGroup>
			<Button on:click={() => handleEditClick()} color="warning">
				<Icon name="pencil-square" />
			</Button>
			<Button color="danger" on:click={(event) => handleDeleteClick()}>
				<Icon name="trash" />
			</Button>
		</ButtonGroup>
	</CardFooter>
</Card>
