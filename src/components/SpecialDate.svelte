<script>
	import { toUTCIsoString } from '$lib/util';
	import { FormGroup, Input, Button } from '@sveltestrap/sveltestrap';
</script>

<FormGroup>
	<fieldset class="easy-meal-days">
		<legend>Easy Meal Days</legend>
		{#each easyMealDays as day, index}
			<div class="easy-meal-day">
				<Input
					type="date"
					min={toUTCIsoString(startDate).split('T')[0]}
					max={toUTCIsoString(endDate).split('T')[0]}
					bind:value={
						() => toUTCIsoString(day).split('T')[0],
						(day) => {
							easyMealDays[index] = new Date(day);
						}
					}
				/>
				<Button color="danger" on:click={() => easyMealDays.splice(index, 1)}>Remove</Button>
			</div>
		{/each}
		<Button
			color="primary"
			on:click={() => {
				easyMealDays = [...easyMealDays, new Date()];
			}}
		>
			Add Easy Meal Day
		</Button>
	</fieldset>
</FormGroup>
