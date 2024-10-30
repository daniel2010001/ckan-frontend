import { UserState, inicialUser, LocalStorageKeys } from "@/models";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: inicialUser,
      setUser: (updatedUser) => set((state) => ({ user: { ...state.user, ...updatedUser } })),
      resetUser: () => set({ user: inicialUser }),
    }),
    { name: LocalStorageKeys.USER }
  )
);
