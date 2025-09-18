import { createContext, useState } from "react";

import { IAuthUser } from "../types/auth";
import { PropLayout } from "../types/base";

interface AuthState {
  token: string | null;
  expired: number | null;
  user: IAuthUser | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

type AuthProviderProp = PropLayout;

export const AuthProvider = ({ children }: AuthProviderProp) => {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    expired: null,
    user: null,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
