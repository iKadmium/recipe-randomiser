import { isLoggedIn } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const loggedIn = isLoggedIn(cookies);
	return { loggedIn };
};
