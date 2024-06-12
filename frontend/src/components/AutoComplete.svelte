<script lang="ts" context="module">
	export interface IngredientSelectionEvents {
		existing: string;
		new: string;
	}
</script>

<script lang="ts">
	import { FormGroup, Icon, InputGroup, InputGroupText } from '@sveltestrap/sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import AutoCompleteSuggestion from './AutoCompleteSuggestion.svelte';
	let searchString: string = '';
	let selectedIndex = 0;

	const dispatch = createEventDispatcher<IngredientSelectionEvents>();

	export let options: string[];
	export let excludedOptions: string[] = [];
	export let allowAdd: boolean = false;
	export let noun: string = 'item';

	function handleSearchInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (searchString === '') {
			suggestions = [];
		} else {
			suggestions = options
				.filter((x) => !excludedOptions.includes(x))
				.filter((x) => x.toUpperCase().includes(searchString.toUpperCase()))
				.slice(0, 10);
		}
	}

	let suggestions: string[] = [];

	async function handleSearchKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				const legitOptionCount = allowAdd
					? Object.keys(suggestions).length
					: Object.keys(suggestions).length - 1;
				if (selectedIndex < legitOptionCount) {
					selectedIndex++;
				}
				event.preventDefault();
				break;
			case 'ArrowUp':
				if (selectedIndex > 0) {
					selectedIndex--;
				}
				event.preventDefault();
				break;
			case 'Enter':
				if (selectedIndex === suggestions.length) {
					dispatch('new', searchString);
				} else {
					const item = suggestions[selectedIndex];
					dispatch('existing', item);
				}
				suggestions = [];
				searchString = '';
				event.preventDefault();
				break;
		}
	}

	let nameInputRef: HTMLInputElement;
</script>

<FormGroup>
	<InputGroup>
		<InputGroupText><Icon name="search" /></InputGroupText>
		<input
			placeholder={`Search for ${noun}`}
			class="form-control"
			type="text"
			bind:value={searchString}
			on:input={handleSearchInput}
			on:keydown={handleSearchKeyDown}
			bind:this={nameInputRef}
		/>
	</InputGroup>

	{#if searchString.length > 0}
		<div class="suggestion-list light" style={`width: ${nameInputRef.clientWidth}px`}>
			{#each suggestions as key, index}
				<AutoCompleteSuggestion title={key} selected={selectedIndex === index} />
			{/each}
			{#if allowAdd}
				<AutoCompleteSuggestion
					title={`Add new ${noun} ${searchString}...`}
					selected={selectedIndex === Object.entries(suggestions).length}
				/>
			{/if}
		</div>
	{/if}
</FormGroup>

<style>
	.suggestion-list {
		display: flex;
		flex-direction: column;

		position: absolute;
	}
</style>
