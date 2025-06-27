import { ingredientsDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await ingredientsDataSource.getAll();
	const sorted = Object.entries(data).sort(([, a], [, b]) => {
		return a.name.localeCompare(b.name);
	});
	const sortedData = Object.fromEntries(sorted);
	return sortedData;
};
