import { create } from 'zustand';
import { FD, Insurance, NewFD, NewInsurance } from '@/types';
import * as api from '@/api/client';

interface Store {
  fds: FD[];
  insurances: Insurance[];
  hydrationStatus: 'idle' | 'loading' | 'ready' | 'error';
  hydrateError: string | null;
  hydrate: () => Promise<void>;

  addFD: (fd: NewFD) => Promise<void>;
  updateFD: (id: string, fd: Partial<FD>) => Promise<void>;
  deleteFD: (id: string) => Promise<void>;
  addInsurance: (ins: NewInsurance) => Promise<void>;
  updateInsurance: (id: string, ins: Partial<Insurance>) => Promise<void>;
  deleteInsurance: (id: string) => Promise<void>;
}

export const useStore = create<Store>((set) => ({
  fds: [],
  insurances: [],
  hydrationStatus: 'idle',
  hydrateError: null,

  hydrate: async () => {
    set({ hydrationStatus: 'loading', hydrateError: null });
    try {
      const [fds, insurances] = await Promise.all([api.listFDs(), api.listInsurances()]);
      set({ fds, insurances, hydrationStatus: 'ready', hydrateError: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      set({ hydrationStatus: 'error', hydrateError: message });
    }
  },

  addFD: async (fd) => {
    const created = await api.createFD(fd);
    set((s) => ({ fds: [...s.fds, created] }));
  },

  updateFD: async (id, data) => {
    const updated = await api.patchFD(id, data);
    set((s) => ({ fds: s.fds.map((f) => (f.id === id ? updated : f)) }));
  },

  deleteFD: async (id) => {
    await api.deleteFDApi(id);
    set((s) => ({ fds: s.fds.filter((f) => f.id !== id) }));
  },

  addInsurance: async (ins) => {
    const created = await api.createInsurance(ins);
    set((s) => ({ insurances: [...s.insurances, created] }));
  },

  updateInsurance: async (id, data) => {
    const updated = await api.patchInsurance(id, data);
    set((s) => ({ insurances: s.insurances.map((i) => (i.id === id ? updated : i)) }));
  },

  deleteInsurance: async (id) => {
    await api.deleteInsuranceApi(id);
    set((s) => ({ insurances: s.insurances.filter((i) => i.id !== id) }));
  },
}));
