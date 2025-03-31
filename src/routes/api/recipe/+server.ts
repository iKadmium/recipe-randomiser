import type { Recipe } from '$lib/models/recipe.js';
import { recipesDataSource } from '$lib/server/index.js';

export async function POST({ request }) {
	const data = (await request.json()) as Recipe;
	const { name, ingredients, difficulty, priority, tags } = data;

	// Validate the input data
	if (
		!name ||
		!ingredients ||
		!Array.isArray(ingredients) ||
		!priority ||
		!tags ||
		difficulty === undefined
	) {
		return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
	}

	const recipe: Recipe = {
		name,
		ingredients,
		difficulty,
		priority,
		tags
	};

	recipesDataSource.post(recipe);

	return new Response(JSON.stringify(recipe), { status: 201 });
}
