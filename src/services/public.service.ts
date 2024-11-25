import { Access, AuthRequest, AuthResponse, AuthType, Refresh, Sliding } from "@/models";
import { UserResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

const api = import.meta.env.VITE_BACKEND;

export const getUserDetails = () =>
  createAxiosCall<UserResponse>("GET", `${api}/api/users/detail/`);

export const login = (name: string, password: string, authType: AuthType) =>
  createAxiosCall<AuthResponse, AuthRequest>("POST", `${api}/api/${authType}/`, { name, password });

export const logout = (data: Refresh) => createAxiosCall("POST", `${api}/api/logout/`, data);

export const refreshAccessToken = (data: Refresh | Sliding, authType: AuthType) =>
  createAxiosCall<Access | Sliding, Refresh | Sliding>(
    "POST",
    `${api}/api/${authType}/refresh/`,
    data
  );

export const tokenVerification = (data: Sliding) =>
  createAxiosCall("POST", `${api}/api/verify-token/`, data);
