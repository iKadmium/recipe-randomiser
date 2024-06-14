<div class="card-stack">
	<slot />
</div>

<style>
	.card-stack {
		display: grid;

		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
		padding-bottom: 1rem;
	}
</style>
