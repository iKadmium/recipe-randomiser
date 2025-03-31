import { ingredientsDataSource, tagsDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [ingredients, tags] = await Promise.all([
		ingredientsDataSource.getAll(),
		tagsDataSource.getAll()
	]);
	return { ingredients, tags };
};
