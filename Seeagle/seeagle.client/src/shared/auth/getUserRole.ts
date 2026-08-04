export function getUserRole(token: string): string | null {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

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