export function getAuthToken(): string | null {
    const tokenCookie = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('authToken='));

    return tokenCookie?.split('=')[1] ?? null;
}