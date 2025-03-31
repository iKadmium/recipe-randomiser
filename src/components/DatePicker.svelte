<script lang="ts">
	import { toUTCIsoString } from '$lib/util';

	import { Input } from '@sveltestrap/sveltestrap';

	export interface DatePickerProps {
		date: Date;
		min?: Date;
		max?: Date;
		id: string;
	}

	let { date = $bindable(), min, max, id }: DatePickerProps = $props();
</script>

<Input
	type="date"
	{id}
	bind:value={
		() => toUTCIsoString(date).split('T')[0],
		(v) => {
			date = new Date(v);
		}
	}
	min={min ? toUTCIsoString(min).split('T')[0] : undefined}
	max={max ? toUTCIsoString(max).split('T')[0] : undefined}
/>
