import type { FD, Insurance, NewFD, NewInsurance } from '@/types';

function baseUrl(): string {
  return import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('authToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl()}${path}`, {
    headers,
    ...init,
  });

  // Handle 401 Unauthorized (token expired)
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = (await res.json()) as { error?: string; message?: string };
      if (j?.error) msg = j.error;
      if (j?.message) msg = j.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function listFDs(): Promise<FD[]> {
  return request<FD[]>('/api/fds');
}

export async function createFD(body: NewFD): Promise<FD> {
  return request<FD>('/api/fds', { method: 'POST', body: JSON.stringify(body) });
}

export async function patchFD(id: string, body: Partial<FD>): Promise<FD> {
  return request<FD>(`/api/fds/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteFDApi(id: string): Promise<void> {
  await request<void>(`/api/fds/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function listInsurances(): Promise<Insurance[]> {
  return request<Insurance[]>('/api/insurances');
}

export async function createInsurance(body: NewInsurance): Promise<Insurance> {
  return request<Insurance>('/api/insurances', { method: 'POST', body: JSON.stringify(body) });
}

export async function patchInsurance(id: string, body: Partial<Insurance>): Promise<Insurance> {
  return request<Insurance>(`/api/insurances/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteInsuranceApi(id: string): Promise<void> {
  await request<void>(`/api/insurances/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
