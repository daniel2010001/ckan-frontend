import { Access, AccessAndRefresh, AuthResponse, Refresh, Sliding, Auth } from "@/models";

export class AuthAdapter {
  static isAccess(refreshResponse: any): refreshResponse is Access {
    return (refreshResponse as Access).access !== undefined;
  }

  static isRefresh(authResponse: any): authResponse is Refresh {
    return (authResponse as Refresh).refresh !== undefined;
  }

  static isSliding(authResponse: any): authResponse is Sliding {
    return (authResponse as Sliding).token !== undefined;
  }

  static isAccessAndRefresh(authResponse: any): authResponse is AccessAndRefresh {
    return AuthAdapter.isAccess(authResponse) && AuthAdapter.isRefresh(authResponse);
  }

  static toAuth(authResponse: any): Auth | never {
    if (AuthAdapter.isSliding(authResponse)) return { accessToken: authResponse.token };
    if (AuthAdapter.isAccessAndRefresh(authResponse))
      return { accessToken: authResponse.access, refreshToken: authResponse.refresh };
    throw new Error("AuthResponse is not valid");
  }

  static toAPartialAuth(authResponse: any): Partial<Auth> {
    const auth: Partial<Auth> = {};
    if (AuthAdapter.isAccess(authResponse)) auth.accessToken = authResponse.access;
    if (AuthAdapter.isRefresh(authResponse)) auth.refreshToken = authResponse.refresh;
    if (AuthAdapter.isSliding(authResponse)) auth.accessToken = authResponse.token;
    return auth;
  }

  static toAuthResponse(auth: Auth): AuthResponse | never {
    if (!auth.accessToken) throw new Error("Auth is not valid");
    else if (!auth.refreshToken) return { token: auth.accessToken };
    else return { access: auth.accessToken, refresh: auth.refreshToken };
  }

  static toRefresh(auth: Auth): Refresh | never {
    if (!auth.accessToken) throw new Error("Auth is not valid");
    else if (!auth.refreshToken) return { refresh: auth.accessToken };
    else return { refresh: auth.refreshToken };
  }

  static toSliding(auth: Auth): Sliding | never {
    if (!auth.accessToken) throw new Error("Auth is not valid");
    else if (!auth.refreshToken) return { token: auth.accessToken };
    else return { token: auth.refreshToken };
  }
}
