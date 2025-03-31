import type { Ingredient } from '$lib/models/ingredient.js';
import { ingredientsDataSource } from '$lib/server/index.js';

export async function POST({ request }) {
	const body = (await request.json()) as Ingredient;
	const { name, unit, fresh } = body;
	const ingredient: Ingredient = {
		name,
		unit,
		fresh
	};

	ingredientsDataSource.post(ingredient);
	return new Response(JSON.stringify(ingredient));
}
