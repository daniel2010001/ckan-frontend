import { AxiosCall, ValueOf } from ".";
import { User } from "./ckan";

export const AuthType = { ACCESS_AND_REFRESH: "login", TOKEN: "sliding" } as const;
export type AuthType = ValueOf<typeof AuthType> | null;

export type Access = { access: string };
export type Refresh = { refresh: string };
export type Sliding = { token: string };

export type AccessAndRefresh = Access & Refresh;
export type AuthResponse = AccessAndRefresh | Sliding;

export type Auth = { accessToken: string; refreshToken?: string };
export const inicialAuth: Auth = { accessToken: "" };

export interface AuthState {
  auth: Auth;
  type: AuthType;
  _generic: <T, D = any>(
    axiosCallGenerator: (auth: Auth, type: AuthType) => AxiosCall<T, D>,
    newValueGenerator: (auth: Auth, type: AuthType, data: T | undefined) => [Auth, AuthType]
  ) => Promise<void> | never;
  login: (props: {
    username: string;
    password: string;
    authType: AuthType;
  }) => Promise<void> | never;
  logout: () => Promise<void> | never;
  refreshAccessToken: () => Promise<void> | never;
  verifyToken: () => Promise<void> | never;
}

export interface UserState {
  user: User;
  fetchUserDetails: () => Promise<void> | never;
  reset: () => void;
}
