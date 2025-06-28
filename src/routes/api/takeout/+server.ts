import type { Takeout } from '$lib/models/takeout';
import { takeoutDataSource } from '$lib/server/index.js';

export async function POST({ request }) {
	const body = await request.json();
	const { name } = body;
	const takeout: Takeout = {
		name
	};

	await takeoutDataSource.post(takeout);

	return new Response(JSON.stringify(takeout), {
		status: 201,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
