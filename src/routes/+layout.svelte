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
	import type { LayoutProps } from './$types';

	let isOpen = $state<boolean>(false);
	let { data, children }: LayoutProps = $props();

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<Styles theme="dark" />

<ToastSet />

{#if data.loggedIn}
	<Navbar expand="md" container="md">
		<NavbarBrand href="/">Meal Generator</NavbarBrand>
		<NavbarToggler class="me-2" on:click={toggle} />
		<Collapse
			{isOpen}
			navbar
			expand="md"
			on:update={(event) => {
				isOpen = event.detail;
			}}
		>
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
{/if}

<Container xl>
	{@render children?.()}
</Container>
