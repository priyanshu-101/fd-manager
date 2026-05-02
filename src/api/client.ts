import type { FD, Insurance, NewFD, NewInsurance } from '@/types';

function baseUrl(): string {
  return import.meta.env.VITE_API_URL ?? '';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) },
    ...init,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) msg = j.error;
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
