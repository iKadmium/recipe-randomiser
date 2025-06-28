<script lang="ts">
	import type { ToastInfo } from '$lib/toasts';
	import { removeToast, errors as toasts } from '$lib/toasts';
	import { Toast, ToastBody, ToastHeader } from '@sveltestrap/sveltestrap';

	function getIcon(toast: ToastInfo): string {
		switch (toast.type) {
			case 'error':
				return 'danger';
			case 'success':
				return 'success';
		}
	}

	function getHeader(toast: ToastInfo): string {
		switch (toast.type) {
			case 'error':
				return 'Error';
			case 'success':
				return 'Success';
		}
	}
</script>

<div class="toast-container">
	{#each $toasts as toast (toast.message)}
		<button class={`btn toast-button btn-${getIcon(toast)}`} on:click={() => removeToast(toast)}>
			<Toast on:close={() => removeToast(toast)} color={toast.type}>
				<ToastHeader icon={getIcon(toast)}>{getHeader(toast)}</ToastHeader>
				<ToastBody>{toast.message}</ToastBody>
			</Toast>
		</button>
	{/each}
</div>

<style>
	.toast-container {
		z-index: 1;
		position: fixed;
		right: 0;
		bottom: 0;

		display: flex;
		gap: 0.5rem;
		flex-direction: column;
	}

	.toast-button {
		border: none;
		padding: 0.5rem;
	}
</style>
