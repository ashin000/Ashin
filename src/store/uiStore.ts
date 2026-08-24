import { create } from 'zustand';

interface UIState {
  loading: boolean;
  loadingProgress: number;
  terminalOpen: boolean;
  theme: 'dark' | 'light';
  cursorMode: 'default' | 'hover' | 'magnetic' | 'text';
  cursorLabel: string;
  activeSection: string;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number | ((prev: number) => number)) => void;
  setTerminalOpen: (open: boolean) => void;
  toggleTerminal: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setCursorMode: (mode: 'default' | 'hover' | 'magnetic' | 'text') => void;
  setCursorLabel: (label: string) => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  loading: true,
  loadingProgress: 0,
  terminalOpen: false,
  theme: 'dark',
  cursorMode: 'default',
  cursorLabel: '',
  activeSection: 'home',

  setLoading: (loading) => set({ loading }),
  setLoadingProgress: (progress) =>
    set((state) => ({
      loadingProgress: typeof progress === 'function' ? progress(state.loadingProgress) : progress,
    })),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setCursorMode: () => {},
  setCursorLabel: () => {},
  setActiveSection: (section) => set({ activeSection: section }),
}));
