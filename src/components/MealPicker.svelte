<script lang="ts" module>
	import { getDatabaseEntries, type Database } from '$lib/models/database';

	import type { Recipe } from '$lib/models/recipe';

	export interface MealPickerProps {
		onPick: (meal: string) => unknown | Promise<unknown>;
		recipes: Database<Recipe>;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import AutoComplete from './AutoComplete.svelte';

	let { recipes, onPick }: MealPickerProps = $props();

	let inputRef = $state<HTMLInputElement | null>(null);
	let recipesRaw = $state(recipes);
	let allRecipes = $derived<string[]>(
		getDatabaseEntries(recipesRaw).map(([_key, value]) => value.name)
	);

	onMount(() => {
		window.setTimeout(() => {
			inputRef?.focus();
		}, 0);
	});
</script>

<div class="picker-body">
	<AutoComplete
		allowAdd={false}
		excludedOptions={[]}
		options={allRecipes}
		noun="meal"
		onExistingAdd={(meal) => onPick(meal)}
		onNewAdd={() => {}}
		bind:inputRef
	/>
</div>
