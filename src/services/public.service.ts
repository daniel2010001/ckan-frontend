import {
  Access,
  AuthRequest,
  AuthResponse,
  AuthType,
  NoticesResponse,
  Refresh,
  Sliding,
} from "@/models";
import { UserRegister, UserResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const getUserDetails = () => createAxiosCall<UserResponse>("GET", "/api/users/detail/");

export const login = (name: string, password: string, authType: NonNullable<AuthType>) =>
  createAxiosCall<AuthResponse, AuthRequest>("POST", `/api/${authType}/`, { name, password });

export const logout = (data: Refresh) => createAxiosCall("POST", "/api/logout/", data);

export const refreshAccessToken = (data: Refresh | Sliding, authType: NonNullable<AuthType>) =>
  createAxiosCall<Access | Sliding, Refresh | Sliding>("POST", `/api/${authType}/refresh/`, data);

export const tokenVerification = (data: Sliding) =>
  createAxiosCall("POST", "/api/verify-token/", data);

export const register = (data: UserRegister) =>
  createAxiosCall<UserResponse, UserRegister>("POST", "/api/users/register/", data);

export const lastNotices = () =>
  createAxiosCall<Array<NoticesResponse>>("GET", "/api/noticias/ultimas", undefined, {
    baseURL: "https://cochabamba.bo",
  });
