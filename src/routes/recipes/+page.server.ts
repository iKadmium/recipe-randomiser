import { recipesDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const recipes = await recipesDataSource.getAll();
	return { recipes };
};
