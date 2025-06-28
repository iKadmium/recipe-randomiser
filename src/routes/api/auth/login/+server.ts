import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
	try {
		const { password } = await request.json();

		if (!password) {
			return json({ error: 'Password is required' }, { status: 400 });
		}

		// Hash the provided password
		const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
		const hashArray = Array.from(new Uint8Array(passwordHash));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		// Compare with the hashed password from environment variable
		if (hashHex !== env.PASSWORD) {
			return json({ error: 'Invalid password' }, { status: 401 });
		}

		// Set authentication cookie with the password hash
		cookies.set('auth', hashHex, {
			path: '/',
			httpOnly: true,
			secure: false, // Set to true in production with HTTPS
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		return json({ success: true });
	} catch (error) {
		console.error(error);
		return json({ error: 'Login failed' }, { status: 500 });
	}
}
