import type { Database } from '$lib/models/database';
import type { Ingredient } from '$lib/models/ingredient';
import type { Recipe } from '$lib/models/recipe';
import type { Tag } from '$lib/models/tag';
import type { Takeout } from '$lib/models/takeout';
import {
	ingredientsDataSource,
	recipesDataSource,
	tagsDataSource,
	takeoutDataSource
} from '$lib/server/index';

export async function POST({ request }) {
	const body = await request.json();
	const { key, data } = body;
	// Key must be one of the data source types
	if (!['ingredients', 'recipes', 'tags', 'takeout'].includes(key)) {
		return new Response('Invalid key provided', { status: 400 });
	}

	switch (key) {
		case 'ingredients': {
			const typedData = data as Database<Ingredient>;
			const dataDestination = ingredientsDataSource;
			await dataDestination.putMany(typedData);
			break;
		}
		case 'recipes': {
			const typedData = data as Database<Recipe>;
			const dataDestination = recipesDataSource;
			await dataDestination.putMany(typedData);
			break;
		}
		case 'tags': {
			const typedData = data as Database<Tag>;
			const dataDestination = tagsDataSource;
			await dataDestination.putMany(typedData);
			break;
		}
		case 'takeout': {
			const typedData = data as Database<Takeout>;
			const dataDestination = takeoutDataSource;
			await dataDestination.putMany(typedData);
			break;
		}
		default:
			return new Response('Invalid key provided', { status: 400 });
	}

	return new Response(null, {
		status: 204,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
