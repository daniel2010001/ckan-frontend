import { AxiosCall, ValueOf } from ".";
import { User } from "./ckan";

export type Access = { access: string };
export type Refresh = { refresh: string };
export type Sliding = { token: string };

export type AccessAndRefresh = Access & Refresh;
export type AuthResponse = AccessAndRefresh | Sliding;
export type AuthRequest = { name: string; password: string };

export type Auth = { accessToken: string; refreshToken?: string };
export const inicialAuth: Auth = { accessToken: "" };

export const AuthType = { ACCESS_AND_REFRESH: "login", TOKEN: "sliding" } as const;
export type AuthType = ValueOf<typeof AuthType> | null;

export interface AuthStore {
  auth: Auth;
  type: AuthType;
  setAuth: (auth: Auth, type: AuthType) => void;
  updateAuth: (newAuth: Partial<Auth>) => void;
  reset: () => void;
  __generic: <T, D = any>(
    axiosCallGenerator: (auth: Auth, type: AuthType) => AxiosCall<T, D>,
    newValueGenerator: (auth: Auth, type: AuthType, data?: T) => [Auth, AuthType]
  ) => Promise<boolean>;
  login: (props: {
    username: string;
    password: string;
    authType: NonNullable<AuthType>;
  }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  verifyToken: () => Promise<boolean>;
}

export interface UserStore {
  user: User;
  fetchUserDetails: () => Promise<boolean>;
  setUser: (user: User) => void;
  reset: () => void;
}
