<div class="card-stack">
	<slot />
</div>

<style>
	.card-stack {
		display: grid;

		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		padding-bottom: 1rem;
	}
</style>
