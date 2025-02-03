import { State } from ".";

export interface UserResponse {
  id: string;
  name: string;
  fullname: string | null;
  created: string;
  about: string | null;
  last_active: string | null;
  activity_streams_email_notifications: boolean;
  sysadmin: boolean;
  state: State;
  image_url: string | null;
  display_name: string;
  email_hash: string;
  number_created_packages: number;
  apikey: string | null;
  email: string;
  image_display_url: string | null;
}

export interface User {
  id: string;
  name: string;
  fullName: string | null;
  created: string;
  about: string | null;
  lastActive: string | null;
  activityStreamsEmailNotifications: boolean;
  sysadmin: boolean;
  imageUrl: string | null;
  displayName: string;
  emailHash: string;
  numberCreatedPackages: number;
  apiKey: string | null;
  email: string;
  imageDisplayUrl: string | null;
}

export const inicialUser: User = {
  id: "",
  name: "",
  fullName: null,
  created: "",
  about: null,
  lastActive: null,
  activityStreamsEmailNotifications: false,
  sysadmin: false,
  imageUrl: null,
  displayName: "",
  emailHash: "",
  numberCreatedPackages: 0,
  apiKey: null,
  email: "",
  imageDisplayUrl: null,
};

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  fullname?: string;
  about?: string;
  image_url?: string;
  profile_picture?: File;
}

export type UserRole = "admin" | "editor" | "member";
export type UserPermission =
  | "read"
  | "create_dataset"
  | "update_dataset"
  | "delete_dataset"
  | "manage_group";
