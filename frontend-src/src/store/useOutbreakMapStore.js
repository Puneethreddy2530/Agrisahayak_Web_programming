import { create } from 'zustand'

export const useOutbreakMapStore = create((set) => ({
  search: '',
  stateFilter: 'all',
  statusFilter: 'all',
  setSearch: (search) => set({ search }),
  setStateFilter: (stateFilter) => set({ stateFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  resetFilters: () => set({ search: '', stateFilter: 'all', statusFilter: 'all' }),
}))
