import { recipesDataSource } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const data = await recipesDataSource.getAll(fetch);
	return data;
};
