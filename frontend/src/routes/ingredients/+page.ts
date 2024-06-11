import { ingredientsDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const data = await ingredientsDataSource.getAll(fetch);
	return data;
};
