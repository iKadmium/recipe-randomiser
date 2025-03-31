import { ingredientsDataSource, recipesDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const ingredients = await ingredientsDataSource.getAll();
	const recipes = await recipesDataSource.getAll();
	return { ingredients, recipes };
};
