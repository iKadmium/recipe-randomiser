import { ingredientsDataSource } from '$lib/server';

export async function PUT({ params, request }) {
	const body = await request.json();
	const { id } = params;
	const { name, unit, fresh } = body;
	const ingredient = {
		name,
		unit,
		fresh
	};

	await ingredientsDataSource.put(id, ingredient);
	return new Response(JSON.stringify(ingredient));
}

export async function DELETE({ params }) {
	const { id } = params;
	await ingredientsDataSource.delete(id);
	return new Response(JSON.stringify({ id }));
}
