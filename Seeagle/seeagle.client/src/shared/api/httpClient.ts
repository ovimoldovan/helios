export async function getJson<T>(url: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function postJson<TResponse>(url: string, body: unknown, token?: string): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}

export async function putJson<TResponse>(url: string, token?: string, body?: unknown): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json' 
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}

export async function patchJson<TResponse>(url: string, token?: string): Promise<TResponse> {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers: headers,
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}