<script lang="ts" module>
	export interface DateListSelectorProps {
		startDate: Date;
		endDate: Date;
		dates: Date[];
		legend: string;
	}
</script>

<script lang="ts">
	import { toUTCIsoString } from '$lib/util';
	import { FormGroup, Input, Button } from '@sveltestrap/sveltestrap';

	let { dates = $bindable<Date[]>(), startDate, endDate, legend }: DateListSelectorProps = $props();
</script>

<FormGroup>
	<fieldset class="days">
		<legend>{legend}</legend>
		{#each dates as day, index}
			<div class="day">
				<Input
					type="date"
					min={toUTCIsoString(startDate).split('T')[0]}
					max={toUTCIsoString(endDate).split('T')[0]}
					bind:value={
						() => toUTCIsoString(day).split('T')[0],
						(day) => {
							dates[index] = new Date(day);
						}
					}
				/>
				<Button color="danger" on:click={() => dates.splice(index, 1)}>Remove</Button>
			</div>
		{/each}
		<Button color="primary" on:click={() => dates.push(new Date())}>Add Day</Button>
	</fieldset>
</FormGroup>

<style>
	.days {
		border: 1px solid var(--bs-border-color);
		padding: 1rem;
		border-radius: 1rem;
	}

	.day {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
</style>
