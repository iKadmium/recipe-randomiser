import { env } from '$env/dynamic/private';

export function isLoggedIn(cookies: { get: (name: string) => string | undefined }): boolean {
	const authCookie = cookies.get('auth');

	const authDisabled =
		env.AUTH_DISABLED !== undefined && env.AUTH_DISABLED !== '' && env.AUTH_DISABLED === 'true';

	return authDisabled || authCookie === env.PASSWORD;
}
