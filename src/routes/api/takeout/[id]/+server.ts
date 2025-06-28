import { takeoutDataSource } from '$lib/server';
import type { RequestHandler } from '@sveltejs/kit';

// PUT /api/takeout/[id]
export const PUT: RequestHandler = async ({ params, request }) => {
	const { id } = params;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Takeout ID is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
	const data = await request.json();

	await takeoutDataSource.put(id, data);

	return new Response(JSON.stringify({ message: `Takeout ${id} updated.` }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

// DELETE /api/takeout/[id]
export const DELETE: RequestHandler = async ({ params }) => {
	const { id } = params;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Takeout ID is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	await takeoutDataSource.delete(id);

	return new Response(JSON.stringify({ message: `Takeout ${id} deleted.` }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
