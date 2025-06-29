import { ingredientsDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data = await ingredientsDataSource.get(params.id);
	if (!data) {
		throw new Error(`Ingredient with id ${params.id} not found`);
	}
	return { ingredient: data };
};
