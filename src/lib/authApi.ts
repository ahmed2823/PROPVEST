const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api').replace(/\/+$/, '');

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export class AuthApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const payload = await response.json() as { error?: string } & T;

  if (!response.ok) {
    throw new AuthApiError(payload.error ?? 'The request could not be completed.', response.status);
  }
  return payload;
}

export async function signUpRequest(name: string, email: string, password: string) {
  return request<AuthSession>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function signInRequest(email: string, password: string) {
  return request<AuthSession>('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function currentUserRequest(token: string) {
  return request<{ user: AuthUser }>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
