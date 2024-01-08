import { create } from 'zustand';

type State = {
  email: string;
  setEmail: (emails: string) => void;
};

export const useStore = create<State>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
}));