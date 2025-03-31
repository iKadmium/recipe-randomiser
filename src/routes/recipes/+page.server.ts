import { recipesDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await recipesDataSource.getAll();
	return data;
};
