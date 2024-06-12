import { ingredientsDataSource, recipesDataSource, tagsDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const [recipe, ingredients, tags] = await Promise.all([
		recipesDataSource.get(params.id, fetch),
		ingredientsDataSource.getAll(fetch),
		tagsDataSource.getAll(fetch)
	]);
	return { recipe, ingredients, tags };
};
