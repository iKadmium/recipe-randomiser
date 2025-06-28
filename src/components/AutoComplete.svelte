<script lang="ts" module>
	export interface AutoCompleteProps {
		options: string[];
		excludedOptions: string[];
		allowAdd: boolean;
		noun: string;
		onNewAdd: (newItem: string) => void;
		onExistingAdd: (existingItem: string) => void;
		inputRef?: HTMLInputElement | null;
	}
</script>

<script lang="ts">
	import { FormGroup, Icon, InputGroup, InputGroupText } from '@sveltestrap/sveltestrap';
	import AutoCompleteSuggestion from './AutoCompleteSuggestion.svelte';
	let searchString = $state('');
	let selectedIndex = $state(0);
	let suggestions = $state<string[]>([]);

	let {
		options,
		excludedOptions,
		allowAdd,
		noun,
		onExistingAdd,
		onNewAdd,
		inputRef = $bindable()
	}: AutoCompleteProps = $props();

	function handleSearchInput() {
		if (searchString === '') {
			suggestions = [];
		} else {
			suggestions = options
				.filter((x) => !excludedOptions.includes(x))
				.filter((x) => x.toUpperCase().includes(searchString.toUpperCase()))
				.slice(0, 10);
		}
	}

	async function handleSearchKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown': {
				const legitOptionCount = allowAdd
					? Object.keys(suggestions).length
					: Object.keys(suggestions).length - 1;
				if (selectedIndex < legitOptionCount) {
					selectedIndex++;
				}
				event.preventDefault();
				break;
			}
			case 'ArrowUp':
				if (selectedIndex > 0) {
					selectedIndex--;
				}
				event.preventDefault();
				break;
			case 'Enter':
				selectItem(selectedIndex);
				event.preventDefault();
				break;
		}
	}

	function selectItem(index: number) {
		if (index === suggestions.length) {
			onNewAdd(searchString);
		} else {
			const item = suggestions[index];
			onExistingAdd(item);
		}
		suggestions = [];
		searchString = '';
	}
</script>

<FormGroup>
	<InputGroup>
		<InputGroupText><Icon name="search" /></InputGroupText>
		<input
			placeholder={`Search for ${noun}`}
			class="form-control"
			type="text"
			bind:value={searchString}
			oninput={handleSearchInput}
			onkeydown={handleSearchKeyDown}
			bind:this={inputRef}
		/>
	</InputGroup>

	{#if searchString.length > 0}
		<div class="suggestion-list light" style={`width: ${inputRef.clientWidth}px`}>
			{#each suggestions as key, index (key)}
				<AutoCompleteSuggestion
					title={key}
					selected={selectedIndex === index}
					on:click={() => selectItem(index)}
				/>
			{/each}
			{#if allowAdd}
				<AutoCompleteSuggestion
					title={`Add new ${noun} ${searchString}...`}
					selected={selectedIndex === Object.entries(suggestions).length}
					on:click={() => selectItem(Object.entries(suggestions).length)}
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
