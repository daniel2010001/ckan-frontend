import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

import { AuthAdapter, UserAdapter } from "@/adapters";
import {
  Auth,
  AuthStore,
  AuthType,
  AxiosCall,
  inicialAuth,
  LocalStorageKeys,
  UserStore,
} from "@/models";
import { inicialUser } from "@/models/ckan";
import { getUserDetails, login, logout, refreshAccessToken, tokenVerification } from "@/services";
import { loadAbortable } from "@/utils";

const __userStoreMiddleware = (
  initializer: StateCreator<UserStore, [["zustand/persist", unknown]], []>
) => persist(initializer, { name: LocalStorageKeys.USER });

// TODO: Mover las funciones de getUserDetails a un nuevo fichero
export const useUserStore = create<UserStore>()(
  __userStoreMiddleware((set) => ({
    user: inicialUser,
    setUser: (user) => set({ user }),
    fetchUserDetails: async () => {
      const userResponse = await loadAbortable(getUserDetails());
      if (!userResponse || userResponse instanceof Error) return false;
      set({ user: UserAdapter.toUser(userResponse.data) });
      return true;
    },
    reset: () => set({ user: inicialUser }),
  }))
);

const __authStoreMiddleware = (
  initializer: StateCreator<AuthStore, [["zustand/persist", unknown]], []>
) =>
  persist(initializer, {
    name: LocalStorageKeys.AUTH,
    onRehydrateStorage: () => async (state) => {
      if (state && state.type)
        try {
          await state.verifyToken();
        } catch (verifyError) {
          try {
            await state.logout();
          } catch (logoutError) {}
        }
      return state;
    },
  });

// TODO: Mover las funciones de login, logout, refreshToken y verifyToken a un nuevo fichero
export const useAuthStore = create<AuthStore>()(
  __authStoreMiddleware((set, get) => ({
    auth: inicialAuth,
    type: null,
    setAuth: (auth, type) => set({ auth, type }),
    updateAuth: (newAuth) => set(({ auth }) => ({ auth: { ...auth, ...newAuth } })),
    reset: () => set({ auth: inicialAuth, type: null }),
    __generic: async <T, D = any>(
      axiosCallGenerator: (auth: Auth, type: AuthType) => AxiosCall<T, D>,
      newValueGenerator: (auth: Auth, type: AuthType, data?: T) => [Auth, AuthType]
    ) => {
      const { auth, type } = get();
      const response = await loadAbortable<T, D>(axiosCallGenerator(auth, type));
      if (!response || response instanceof Error) return false;
      const [newAuth, authType] = newValueGenerator(auth, type, response.data);
      set({ auth: newAuth, type: authType });
      return true;
    },

    login: ({ username, password, authType }) =>
      get().__generic(
        (_auth, _type) => login(username, password, authType),
        (_auth, _type, data) => [AuthAdapter.toAuth(data), authType]
      ),

    logout: () =>
      get().__generic(
        (_auth, type) => {
          const authResponse = type && AuthAdapter.toAuthResponse(_auth);
          return authResponse && AuthAdapter.isRefresh(authResponse)
            ? logout(authResponse)
            : ({} as ReturnType<typeof logout>);
        },
        (_auth, _type, _data) => [inicialAuth, null]
      ),

    refreshAccessToken: () =>
      get().__generic(
        (auth, type) =>
          type
            ? refreshAccessToken(AuthAdapter.toAuthResponse(auth), type)
            : ({} as ReturnType<typeof refreshAccessToken>),
        (auth, type, data) => [{ ...auth, ...AuthAdapter.toAPartialAuth(data) }, type]
      ),

    verifyToken: () =>
      get().__generic(
        (auth, type) =>
          type
            ? tokenVerification(AuthAdapter.toSliding(auth))
            : ({} as ReturnType<typeof tokenVerification>),
        (auth, type, _data) => [auth, type]
      ),
  }))
);
