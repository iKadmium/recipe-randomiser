import { isLoggedIn } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const loggedIn = isLoggedIn(cookies);
	return { loggedIn };
};
