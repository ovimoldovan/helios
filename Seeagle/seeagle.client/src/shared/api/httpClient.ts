export async function getJson<T>(url: string, token?: string): Promise<T> {
  let response;
  
  if (token) {
    response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } else {
    response = await fetch(url);
  }
  
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function postJson<TResponse>(url: string, body: unknown, token?: string): Promise<TResponse> {
  let response;
  
  if (token) {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw await response.json();
    }

    throw new Error(`Request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}
