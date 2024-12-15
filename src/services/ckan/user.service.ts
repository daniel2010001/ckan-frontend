import { UserRegister, UserResponse } from "@/models/ckan";
import { createAxiosCall } from "@/utils";

export const register = (props: UserRegister) =>
  createAxiosCall<UserResponse, UserRegister>("POST", `api/users/create/`, props, {
    headers: { "Content-Type": "multipart/form-data" },
  });
