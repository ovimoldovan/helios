export function getUserRole(token: string): string | null {
    try {
        const payload = token.split('.')[1];

        const base64 = payload
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(Math.ceil(payload.length / 4) * 4, '=');

        const decodedPayload = JSON.parse(atob(base64));

        return (
            decodedPayload.role ??
            decodedPayload[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] ??
            null
        );
    } catch {
        return null;
    }
}