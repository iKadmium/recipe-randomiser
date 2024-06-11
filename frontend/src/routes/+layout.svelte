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

	let isOpen = false;

	function handleUpdate(event: CustomEvent<boolean>) {
		isOpen = event.detail;
	}

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<Styles theme="dark" />

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
