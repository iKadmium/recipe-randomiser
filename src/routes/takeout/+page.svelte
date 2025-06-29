<script lang="ts">
	import { getDatabaseEntries } from '$lib/models/database';
	import { Button, ButtonGroup, Icon, Table } from '@sveltestrap/sveltestrap';
	import type { PageProps } from './$types';

	async function handleDelete(key: string) {
		const resp = await fetch(`/api/takeout/${key}`, {
			method: 'DELETE'
		});
		if (!resp.ok) {
			console.error('Failed to delete takeout:', resp.statusText);
			return;
		}
		delete takeoutsRaw[key];
	}

	async function addTakeout() {
		const input = window.prompt('Please enter the name of the new takeout:', 'New Takeout');
		if (!input) return;

		const resp = await fetch('/api/takeout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: input })
		});
		if (!resp.ok) {
			console.error('Failed to add takeout:', resp.statusText);
			return;
		}
		const newTakeout = await resp.json();
		takeoutsRaw[newTakeout.id] = newTakeout;
	}

	async function handleEdit(key: string) {
		const takeout = takeoutsRaw[key];
		if (!takeout) {
			console.error('Takeout not found:', key);
			return;
		}
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

	let { data }: PageProps = $props();

	let takeoutsRaw = $state(data.takeouts);
	let takeouts = $derived(getDatabaseEntries(takeoutsRaw));
</script>

<h1>Takeouts</h1>

<Button color="primary" on:click={() => addTakeout()}>New takeout</Button>

<Table striped bordered hover>
	<thead>
		<tr>
			<th>Name</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each takeouts as [key, takeout] (key)}
			<tr>
				<td>{takeout.name}</td>
				<td>
					<ButtonGroup>
						<Button color="warning" on:click={() => handleEdit(key)}>
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
