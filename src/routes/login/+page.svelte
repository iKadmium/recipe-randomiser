<script lang="ts">
	import {
		Card,
		CardHeader,
		CardBody,
		Form,
		FormGroup,
		Input,
		Label,
		Button,
		Alert
	} from '@sveltestrap/sveltestrap';
	import { goto } from '$app/navigation';
	import { addToast } from '$lib/toasts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let password = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handleLogin() {
		if (!password.trim()) {
			error = 'Please enter a password';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password })
			});

			if (!response.ok) {
				throw new Error('Invalid password');
			}

			addToast({
				type: 'success',
				message: 'Login successful'
			});

			// Redirect to home page or dashboard
			await goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed';
		} finally {
			loading = false;
		}
	}

	async function handleLogout() {
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Logout failed');
			}

			addToast({
				type: 'success',
				message: 'Logout successful'
			});

			// Redirect to home page or dashboard
			await goto('/');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Logout failed';
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="d-flex justify-content-center align-items-center" style="min-height: 60vh;">
	<Card style="width: 100%; max-width: 400px;">
		<CardHeader class="text-center">
			<h1>Admin Login</h1>
		</CardHeader>
		<CardBody>
			<Form>
				<FormGroup>
					{#if data.loggedIn}
						<p>You are currently logged in</p>
					{:else}
						<Label for="password">Password</Label>
						<Input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Enter admin password"
							onkeypress={handleKeyPress}
							disabled={loading}
						/>
					{/if}
				</FormGroup>

				{#if error}
					<Alert color="danger" class="mb-3">
						{error}
					</Alert>
				{/if}

				<div class="d-grid">
					{#if data.loggedIn}
						<Button color="primary" onclick={handleLogout} disabled={loading}>
							{loading ? 'Logging out...' : 'Log out'}
						</Button>
					{:else}
						<Button color="primary" onclick={handleLogin} disabled={loading || !password.trim()}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					{/if}
				</div>
			</Form>
		</CardBody>
	</Card>
</div>
