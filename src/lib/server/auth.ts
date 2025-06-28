import { AUTH_DISABLED, PASSWORD } from "$env/static/private";

export function isLoggedIn(cookies: { get: (name: string) => string | undefined }): boolean {
    const authCookie = cookies.get('auth');

    const authDisabled = AUTH_DISABLED !== undefined && AUTH_DISABLED !== '' && AUTH_DISABLED === 'true';

    return (authDisabled || authCookie === PASSWORD);
}