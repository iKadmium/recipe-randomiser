import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	// Clear authentication cookie
	cookies.delete('auth', { path: '/' });

	return json({ success: true });
}
