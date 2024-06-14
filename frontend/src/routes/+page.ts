import { ingredientsDataSource, recipesDataSource } from '$lib';
import type { IngredientWithAmount } from '$lib/models/recipe';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const ingredients = await ingredientsDataSource.getAll(fetch);
	const recipes = await recipesDataSource.getAll(fetch);
	return { ingredients, recipes };
};

export interface Suggestion {
	recipe: string;
}

export interface SelectableIngredientWithAmount extends IngredientWithAmount {
	selected: boolean;
}
