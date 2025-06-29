import { ingredientsDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const ingredients = await ingredientsDataSource.getAll();
	return { ingredients };
};
