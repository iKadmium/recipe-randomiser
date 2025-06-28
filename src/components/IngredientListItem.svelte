<script lang="ts" module>
	export interface IngredientListItemProps {
		ingredient: Ingredient;
		key: string;
		onDelete: () => unknown | Promise<unknown>;
	}
</script>

<script lang="ts">
	import type { Ingredient } from '$lib/models/ingredient';
	import { Button, ButtonGroup, Card, CardBody, CardFooter, Icon } from '@sveltestrap/sveltestrap';

	let { ingredient, key, onDelete }: IngredientListItemProps = $props();
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
			<Button color="danger" on:click={() => onDelete()}>
				<Icon name="trash" />
			</Button>
		</ButtonGroup>
	</CardFooter>
</Card>
