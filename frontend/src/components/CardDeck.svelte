<div class="card-stack">
	<slot />
</div>

<style>
	.card-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 1rem;
	}

	@media (min-width: 600px) {
		.card-stack {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}
</style>
