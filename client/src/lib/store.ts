import { create } from "zustand";

type AuthState = {
    userId: string
    setUserId: (userId: string) => void
}

export const useAuthStore = create<AuthState>((set, _get) => ({
    userId: "",
    setUserId: (userId: string) => set({ userId }),
}))
