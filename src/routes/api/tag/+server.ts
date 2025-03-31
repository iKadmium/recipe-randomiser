import { tagsDataSource } from '$lib/server/index.js';

export async function POST({ request }) {
	const body = await request.json();
	const { name, description } = body;
	const tag = {
		name,
		description
	};

	await tagsDataSource.post(tag);

	return new Response(JSON.stringify(tag), {
		status: 201,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
