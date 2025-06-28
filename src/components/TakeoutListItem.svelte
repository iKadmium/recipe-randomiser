<script lang="ts" module>
	export interface TakeoutListItemProps {
		onDelete: () => unknown | Promise<unknown>;
		takeout: Takeout;
		key: string;
	}
</script>

<script lang="ts">
	import type { Takeout } from '$lib/models/takeout';
	import { Button, ButtonGroup, Card, CardBody, CardFooter, Icon } from '@sveltestrap/sveltestrap';

	let { takeout, key, onDelete }: TakeoutListItemProps = $props();

	async function handleDeleteClick() {
		onDelete();
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
			<Button color="danger" on:click={() => handleDeleteClick()}>
				<Icon name="trash" />
			</Button>
		</ButtonGroup>
	</CardFooter>
</Card>
