import type { Recipe } from '$lib/models/recipe';
import { recipesDataSource } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await recipesDataSource.getAll();
	const sorted = Object.entries<Recipe>(data).toSorted(([, a], [, b]) => {
		return a.name.localeCompare(b.name);
	});
	return Object.fromEntries(sorted);
};
