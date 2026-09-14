export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function putJson<TResponse>(url: string, body?: unknown): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function deleteJson(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }
}

export async function putJsonWithBody<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function patchJson<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export async function postFormData<TRespoonse>(url:string, formData: FormData): Promise<TRespoonse> {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as TRespoonse;
  }

  return (await response.json()) as TRespoonse;
}