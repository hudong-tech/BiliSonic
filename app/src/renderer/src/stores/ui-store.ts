import { create } from 'zustand'

export interface UIState {
  siderCollapsed: boolean
  theme: 'light' | 'dark' | 'auto'
  loading: boolean
  setSiderCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  setLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  siderCollapsed: false,
  theme: 'auto',
  loading: false,
  setSiderCollapsed: (collapsed) => set({ siderCollapsed: collapsed }),
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ loading }),
}))
