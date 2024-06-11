<script lang="ts">
	export let title: string;
	export let selected: boolean;
</script>

<span class:selected class="item">{title}</span>

<style>
	.item {
		color: var(--bs-dark);
		background: var(--bs-light);
		padding: 0.25rem 0.5rem;
	}
	.selected {
		background: var(--bs-primary);
	}
</style>
