<script lang="ts" module>
	export interface IngredientListItemProps {
		onDelete: () => unknown | Promise<unknown>;
		recipe: Recipe;
		key: string;
	}
</script>

<script lang="ts">
	import type { Recipe } from '$lib/models/recipe';
	import { Button, ButtonGroup, Card, CardBody, CardFooter, Icon } from '@sveltestrap/sveltestrap';

	let { recipe, key, onDelete }: IngredientListItemProps = $props();

	async function handleDeleteClick() {
		onDelete();
	}
</script>

<Card>
	<CardBody>
		{recipe.name}
	</CardBody>
	<CardFooter>
		<ButtonGroup>
			<Button href={`/recipes/${key}`} color="warning">
				<Icon name="pencil-square" />
			</Button>
			<Button color="danger" on:click={() => handleDeleteClick()}>
				<Icon name="trash" />
			</Button>
		</ButtonGroup>
	</CardFooter>
</Card>
