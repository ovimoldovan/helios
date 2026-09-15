import {useNavigate} from "react-router-dom";

let refreshPromise: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Session expired');
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function request(url: string, init: RequestInit, isRetry = false): Promise<Response> {
  const response = await fetch(url, {
    credentials: 'include',
    ...init,
  });

  if (response.status === 401 && !isRetry && !url.includes('/api/auth/')) {
    try {
      await refreshSession();
    } catch {
      const navigate = useNavigate();
      try {
        const logoutResponse = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (logoutResponse.status == 400)
          navigate('/login');
      } catch {
        navigate('/login');
      }
      
      return new Promise<Response>(() => {});
    }

    return request(url, init, true);
  }

  return response;
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await request(url, { method: 'GET' });
  return parseJsonResponse<T>(response);
}

export async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return parseJsonResponse<TResponse>(response);
}

export async function putJson<TResponse>(url: string, body?: unknown): Promise<TResponse> {
  const response = await request(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseJsonResponse<TResponse>(response);
}

export async function putJsonWithBody<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await request(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return parseJsonResponse<TResponse>(response);
}

export async function patchJson<TResponse>(url: string): Promise<TResponse> {
  const response = await request(url, { method: 'PATCH' });
  return parseJsonResponse<TResponse>(response);
}

export async function deleteJson(url: string): Promise<void> {
  const response = await request(url, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }
}

export async function postFormData<TResponse>(url: string, formData: FormData): Promise<TResponse> {
  const response = await request(url, {
    method: 'POST',
    body: formData,
  });

  return parseJsonResponse<TResponse>(response);
}