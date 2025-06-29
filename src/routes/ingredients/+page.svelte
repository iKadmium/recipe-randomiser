<script lang="ts">
	import { getDatabaseEntries } from '$lib/models/database';
	import { Button, ButtonGroup, Icon, Table } from '@sveltestrap/sveltestrap';
	import type { PageProps } from './$types';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/ingredient/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete ingredient:', resp.statusText);
			return;
		}
		delete ingredientsRaw[key];
	}

	let { data }: PageProps = $props();
	let ingredientsRaw = $state(data.ingredients);
	let ingredients = $derived(
		getDatabaseEntries(ingredientsRaw).toSorted(([_keyA, ingredientA], [_keyB, ingredientB]) => {
			return ingredientA.name.localeCompare(ingredientB.name);
		})
	);
</script>

<h1>Ingredients</h1>

<Button color="primary" href="/ingredients/new">New Ingredient</Button>

<Table striped bordered hover>
	<thead>
		<tr>
			<th>Name</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each ingredients as [key, ingredient] (key)}
			<tr>
				<td>{ingredient.name}</td>
				<td>
					<ButtonGroup>
						<Button href={`/ingredients/${key}`} color="warning">
							<Icon name="pencil-square" />
						</Button>
						<Button color="danger" on:click={() => handleDelete(key)}>
							<Icon name="trash" />
						</Button>
					</ButtonGroup>
				</td>
			</tr>
		{/each}
	</tbody>
</Table>
