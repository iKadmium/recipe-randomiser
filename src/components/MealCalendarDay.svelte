<script lang="ts" module>
	import { Temporal } from '@js-temporal/polyfill';

	export interface MealCalendarDayProps {
		date: Temporal.PlainDate;
		meal: string | undefined;
		onRandomise: () => unknown | Promise<unknown>;
		onPick: () => unknown | Promise<unknown>;
		onTakeout: () => unknown | Promise<unknown>;
	}
</script>

<script lang="ts">
	import { Button, ButtonGroup, Icon } from '@sveltestrap/sveltestrap';

	let { date, meal, onRandomise, onPick, onTakeout }: MealCalendarDayProps = $props();

	let canChange = $derived(meal !== undefined);
	let isTakeout = $derived(meal === 'Takeout');
</script>

<div class="day">
	<div class="date">{date.day}</div>
	{#if meal}
		<div class="meal-container">
			<span class="meal">{meal}</span>
		</div>
		{#if canChange}
			<ButtonGroup>
				{#if !isTakeout}
					<Button
						color="primary"
						on:click={() => {
							onRandomise();
						}}
					>
						<Icon name="repeat" />
					</Button>
					<Button color="primary" on:click={() => onPick()}>
						<Icon name="hand-index" />
					</Button>
				{/if}
				<Button color="primary" on:click={() => onTakeout()} active={isTakeout}>
					<Icon name="bag" />
				</Button>
			</ButtonGroup>
		{/if}
	{/if}
</div>

<style>
	.day {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
		border: 1px solid var(--bs-border-color);
		gap: 0.5rem;
	}

	.meal-container {
		flex-grow: 1;
		text-align: center;
	}

	.meal {
		vertical-align: middle;
	}
</style>
