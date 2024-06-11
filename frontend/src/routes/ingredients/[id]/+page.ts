import { ingredientsDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const data = await ingredientsDataSource.get(params.id, fetch);
	return data;
};
