import { ingredientsDataSource, recipesDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const recipe = await recipesDataSource.get(params.id, fetch);
	const ingredients = await ingredientsDataSource.getAll(fetch);
	return { recipe, ingredients };
};
