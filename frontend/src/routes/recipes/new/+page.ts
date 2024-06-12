import { ingredientsDataSource, tagsDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [ingredients, tags] = await Promise.all([
		ingredientsDataSource.getAll(fetch),
		tagsDataSource.getAll(fetch)
	]);
	return { ingredients, tags };
};
