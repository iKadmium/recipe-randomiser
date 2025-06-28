import { isLoggedIn } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

// This 'handle' function runs for every server-side request
export async function handle({ event, resolve }) {
	// List of public routes that don't require authentication
	// Make sure to include your login page and any other necessary public assets/routes
	const publicRoutes = ['/login', '/login/', '/api/auth/login']; // Add other public routes if any (e.g., /api/public)

	// Check if the current path is a public route
	const isPublicRoute = publicRoutes.includes(event.url.pathname);

	// If not authenticated AND not on a public route, redirect to login
	if (!isPublicRoute && !isLoggedIn(event.cookies)) {
		throw redirect(302, '/login'); // Redirect to your login page
	}

	// If authenticated or on a public route, continue with the request
	const response = await resolve(event);
	return response;
}
