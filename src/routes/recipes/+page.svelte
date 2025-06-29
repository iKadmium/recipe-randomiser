<script lang="ts">
	import { getDatabaseEntries } from '$lib/models/database';
	import { Button, ButtonGroup, Icon, Table } from '@sveltestrap/sveltestrap';
	import type { PageProps } from './$types';
	import { Difficulty } from '$lib/models/recipe';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/recipe/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete recipe:', resp.statusText);
			return;
		}
		delete recipesRaw[key];
	}

	let { data }: PageProps = $props();

	let recipesRaw = $state(data.recipes);
	let recipes = $derived(
		getDatabaseEntries(recipesRaw).toSorted(([_keyA, recipeA], [_keyB, recipeB]) => {
			return recipeA.name.localeCompare(recipeB.name);
		})
	);
</script>

<h1>Recipes</h1>

<Button color="primary" href="/recipes/new">New Recipe</Button>

<Table striped bordered hover>
	<thead>
		<tr>
			<th>Name</th>
			<th class="d-none d-lg-table-cell">Difficulty</th>
			<th class="d-none d-lg-table-cell">Tags</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each recipes as [key, recipe] (key)}
			<tr>
				<td>{recipe.name}</td>
				<td class="d-none d-lg-table-cell">{Difficulty[recipe.difficulty]}</td>
				<td class="d-none d-lg-table-cell">{recipe.tags.join(', ')}</td>
				<td>
					<ButtonGroup>
						<Button href={`/recipes/${key}`} color="warning">
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
