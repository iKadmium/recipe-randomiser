<script lang="ts">
	import {
		Collapse,
		Container,
		Nav,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		NavItem,
		NavLink,
		Styles
	} from '@sveltestrap/sveltestrap';
	import ToastSet from '../components/ToastSet.svelte';

	let isOpen = false;

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<Styles theme="dark" />

<ToastSet />

<Navbar>
	<NavbarBrand href="/">Meal Generator</NavbarBrand>
	<NavbarToggler class="me-2" on:click={toggle} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="/recipes">Recipes</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/ingredients">Ingredients</NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>

<Container xl>
	<slot />
</Container>

<style>
	:global(.full-size-button) {
		width: 100%;
		height: 100%;
		border: none;
		background: none;
	}

	:global(.full-height-card) {
		min-height: 12rem;
	}

	:global(.big-icon) {
		font-size: 64px;
	}
</style>
