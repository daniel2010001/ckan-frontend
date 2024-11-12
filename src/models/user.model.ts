export interface UserState {
  user: User;
  setUser: (updatedUser: Partial<User>) => void;
  resetUser: () => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export const inicialUser: User = {
  id: "",
  name: "",
  email: "",
  accessToken: "",
  refreshToken: "",
};
