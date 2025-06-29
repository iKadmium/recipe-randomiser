<script lang="ts">
	import { Button } from '@sveltestrap/sveltestrap';
	import CardDeck from '../../components/CardDeck.svelte';
	import TakeoutListItem from '../../components/TakeoutListItem.svelte';
	import type { PageProps } from './$types';
	import { getDatabaseEntries } from '$lib/models/database';

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

	let { data }: PageProps = $props();

	let takeoutsRaw = $state(data.takeouts);
	let takeouts = $derived(getDatabaseEntries(takeoutsRaw));
</script>

<h1>Takeouts</h1>

<Button color="primary" on:click={() => addTakeout()}>New takeout</Button>

<CardDeck>
	{#each takeouts as [key, takeout] (key)}
		<TakeoutListItem {takeout} {key} onDelete={() => handleDelete(key)} />
	{/each}
</CardDeck>
