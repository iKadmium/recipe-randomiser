import { ingredientsDataSource, recipesDataSource, tagsDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [recipe, ingredients, tags] = await Promise.all([
		recipesDataSource.get(params.id),
		ingredientsDataSource.getAll(),
		tagsDataSource.getAll()
	]);
	if (!recipe) {
		throw new Error(`Recipe with id ${params.id} not found`);
	}
	return { recipe, ingredients, tags, id: params.id };
};
