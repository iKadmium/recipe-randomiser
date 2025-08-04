<script lang="ts">
	import { Temporal } from '@js-temporal/polyfill';
	import { Input } from '@sveltestrap/sveltestrap';

	export interface DatePickerProps {
		date: Temporal.PlainDate;
		min?: Temporal.PlainDate;
		max?: Temporal.PlainDate;
		id: string;
	}

	let { date = $bindable(), min, max, id }: DatePickerProps = $props();
</script>

<Input
	type="date"
	{id}
	bind:value={
		() => date.toString(),
		(v) => {
			date = Temporal.PlainDate.from(v);
		}
	}
	min={min ? min.toString() : undefined}
	max={max ? max.toString() : undefined}
/>
