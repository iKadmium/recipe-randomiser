import { writable } from 'svelte/store';

export interface ToastInfo {
	type: 'error' | 'success';
	message: string;
}

export const errors = writable<ToastInfo[]>([]);

export function addToast(toast: ToastInfo) {
	errors.update((errorsValue) => {
		errorsValue.push(toast);
		window.setTimeout(() => {
			removeToast(toast);
		}, 5000);
		return errorsValue;
	});
}

export function removeToast(toast: ToastInfo) {
	errors.update((errorsValue) => {
		const index = errorsValue.indexOf(toast);
		if (index !== -1) {
			errorsValue.splice(index, 1);
		}
		return errorsValue;
	});
}
