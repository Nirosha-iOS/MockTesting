import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../api/authApi";
import type { AuthUserProfile } from "../../api/types";
import { ACCESS_TOKEN_KEY, USER_KEY } from "../../session/storageKeys";

interface AuthState {
  isReady: boolean;
  isAuthenticated: boolean;
  user: AuthUserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function readStoredUser(): AuthUserProfile | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUserProfile;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<AuthUserProfile | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = readStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      navigate("/login", { replace: true });
    };
    window.addEventListener("lms:unauthorized", onUnauthorized);
    return () => window.removeEventListener("lms:unauthorized", onUnauthorized);
  }, [navigate]);

  const login = useCallback(async (email: string, password: string) => {
    const body = await loginRequest(email, password);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, body.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(body.user));
    setUser(body.user);
    navigate("/", { replace: true });
  }, [navigate]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({
      isReady,
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    }),
    [isReady, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
