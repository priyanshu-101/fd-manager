import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FD, Insurance } from '@/types';

interface Store {
  fds: FD[];
  insurances: Insurance[];
  addFD: (fd: FD) => void;
  updateFD: (id: string, fd: Partial<FD>) => void;
  deleteFD: (id: string) => void;
  addInsurance: (ins: Insurance) => void;
  updateInsurance: (id: string, ins: Partial<Insurance>) => void;
  deleteInsurance: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      fds: [],
      insurances: [],
      addFD: (fd) => set((s) => ({ fds: [...s.fds, fd] })),
      updateFD: (id, data) =>
        set((s) => ({ fds: s.fds.map((f) => (f.id === id ? { ...f, ...data } : f)) })),
      deleteFD: (id) => set((s) => ({ fds: s.fds.filter((f) => f.id !== id) })),
      addInsurance: (ins) => set((s) => ({ insurances: [...s.insurances, ins] })),
      updateInsurance: (id, data) =>
        set((s) => ({ insurances: s.insurances.map((i) => (i.id === id ? { ...i, ...data } : i)) })),
      deleteInsurance: (id) =>
        set((s) => ({ insurances: s.insurances.filter((i) => i.id !== id) })),
    }),
    { name: 'vaultwise-store' }
  )
);
