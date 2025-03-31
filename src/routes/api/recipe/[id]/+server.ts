import { recipesDataSource } from '$lib/server';

export async function DELETE({ params }) {
	const { id } = params;
	if (!id) {
		return new Response('Missing id', { status: 400 });
	}

	try {
		await recipesDataSource.delete(id);
		return new Response('Deleted successfully', { status: 200 });
	} catch (error) {
		return new Response('Error deleting recipe', { status: 500 });
	}
}

export async function PUT({ params, request }) {
	const { id } = params;
	if (!id) {
		return new Response('Missing id', { status: 400 });
	}

	const data = await request.json();

	try {
		await recipesDataSource.put(id, data);
		return new Response('Updated successfully', { status: 200 });
	} catch (error) {
		return new Response('Error updating recipe', { status: 500 });
	}
}
