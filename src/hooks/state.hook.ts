import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthAdapter, UserAdapter } from "@/adapters";
import {
  Auth,
  AuthState,
  AuthType,
  AxiosCall,
  inicialAuth,
  LocalStorageKeys,
  UserState,
} from "@/models";
import { inicialUser } from "@/models/ckan";
import { getUserDetails, login, logout, refreshAccessToken, tokenVerification } from "@/services";
import { loadAbortable } from "@/utils";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: inicialUser,
      fetchUserDetails: async () => {
        const response = await loadAbortable(getUserDetails());
        if (response instanceof Error) throw response;
        set({ user: UserAdapter.toUser(response.data) });
      },
      reset: () => set({ user: inicialUser }),
    }),
    { name: LocalStorageKeys.USER }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: inicialAuth,
      type: null,
      _generic: async <T, D = any>(
        axiosCallGenerator: (auth: Auth, type: AuthType) => AxiosCall<T, D>,
        newValueGenerator: (auth: Auth, type: AuthType, data: T | undefined) => [Auth, AuthType]
      ) => {
        const { auth, type } = get();
        const response = await loadAbortable<T, D>(axiosCallGenerator(auth, type));
        if (response instanceof Error) throw response;
        const [newAuth, authType] = newValueGenerator(auth, type, response?.data);
        set({ auth: newAuth, type: authType });
      },

      login: ({ username, password, authType }) =>
        get()._generic(
          (_auth, _type) => login(username, password, authType),
          (_auth, _type, data) => [AuthAdapter.toAuth(data), authType]
        ),

      logout: () =>
        get()._generic(
          (auth, type) => {
            const authResponse = AuthAdapter.toAuthResponse(auth);
            return type && AuthAdapter.isRefresh(authResponse)
              ? logout(authResponse)
              : ({} as ReturnType<typeof logout>);
          },
          (_auth, _type, _data) => [inicialAuth, null]
        ),

      refreshAccessToken: () =>
        get()._generic(
          (auth, type) =>
            type && auth.refreshToken
              ? refreshAccessToken(AuthAdapter.toRefresh(auth), type)
              : ({} as ReturnType<typeof refreshAccessToken>),
          (auth, type, data) => [{ ...auth, ...AuthAdapter.toAPartialAuth(data) }, type]
        ),

      verifyToken: () =>
        get()._generic(
          (auth, type) =>
            type && auth.refreshToken
              ? tokenVerification(AuthAdapter.toSliding(auth))
              : ({} as ReturnType<typeof tokenVerification>),
          (auth, type, _data) => [auth, type]
        ),
    }),
    {
      name: LocalStorageKeys.AUTH,
      onRehydrateStorage: () => async (state) => {
        if (state && state.type)
          try {
            await state.verifyToken();
          } catch (errorVerify) {
            try {
              await state.logout();
            } catch (errorLogout) {}
          }
      },
    }
  )
);
