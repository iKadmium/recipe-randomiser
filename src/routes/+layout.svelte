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
	import '../global.css';

	let isOpen = $state(false);
	let { children } = $props();

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<Styles theme="dark" />

<ToastSet />

<Navbar>
	<NavbarBrand href="/">Meal Generator</NavbarBrand>
	<NavbarToggler class="me-2" on:click={toggle} />
	<Collapse {isOpen} navbar expand="md" on:update={(event) => (isOpen = event.detail)}>
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="/recipes">Recipes</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/ingredients">Ingredients</NavLink>
			</NavItem>
			<NavItem>
				<NavLink href="/takeout">Takeout</NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>

<Container xl>
	{@render children?.()}
</Container>
