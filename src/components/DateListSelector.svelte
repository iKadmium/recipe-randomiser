<script lang="ts" module>
	import { Temporal } from '@js-temporal/polyfill';

	export interface DateListSelectorProps {
		startDate: Temporal.PlainDate;
		endDate: Temporal.PlainDate;
		dates: Temporal.PlainDate[];
		legend: string;
	}
</script>

<script lang="ts">
	import { FormGroup, Input, Button } from '@sveltestrap/sveltestrap';

	let {
		dates = $bindable<Temporal.PlainDate[]>(),
		startDate,
		endDate,
		legend
	}: DateListSelectorProps = $props();
</script>

<FormGroup>
	<fieldset class="days">
		<legend>{legend}</legend>
		{#each dates as day, index (day)}
			<div class="day">
				<Input
					type="date"
					min={startDate.toString()}
					max={endDate.toString()}
					bind:value={
						() => day.toString(),
						(dayStr) => {
							dates[index] = Temporal.PlainDate.from(dayStr);
						}
					}
				/>
				<Button color="danger" on:click={() => dates.splice(index, 1)}>Remove</Button>
			</div>
		{/each}
		<Button color="primary" on:click={() => dates.push(Temporal.PlainDate.from('2025-01-01'))}
			>Add Day</Button
		>
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
