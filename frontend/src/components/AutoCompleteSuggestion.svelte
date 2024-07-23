<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let selected: boolean;

	const dispatch = createEventDispatcher();
	function onSuggestionClick() {
		dispatch('click', title);
	}
</script>

<button class:selected class="item" on:click={() => onSuggestionClick()}>{title}</button>

<style>
	.item {
		color: var(--bs-dark);
		background: var(--bs-light);
		padding: 0.25rem 0.5rem;

		text-align: start;
		border: none;
		margin: none;
	}

	.selected {
		background: var(--bs-primary);
	}
</style>
