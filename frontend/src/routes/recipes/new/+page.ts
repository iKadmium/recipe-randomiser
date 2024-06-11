import { ingredientsDataSource, recipesDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const ingredients = await ingredientsDataSource.getAll(fetch);
	return ingredients;
};
