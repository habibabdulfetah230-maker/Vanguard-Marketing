import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";

interface AdminInfo {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
}

interface AdminAuthContextValue {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: { token: string; admin: AdminInfo }) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const STORAGE_KEY = "vanguard-admin-auth";

type AdminAuthProviderProps = {
  children: ReactNode;
};

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for secret token in URL on mount and when URL changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const secretToken = urlParams.get('token');
      
      if (secretToken === 'vanguard-admin-secret-2024') {
        // Set mock admin for secret token access
        setToken('secret-token');
        setAdmin({
          id: 'secret-admin',
          email: 'admin@vanguard.com',
          name: 'Secret Admin',
          role: 'superadmin'
        });
        setIsLoading(false);
        return;
      }

      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored) as { token?: string; admin?: AdminInfo };
        if (parsed?.token) {
          setToken(parsed.token);
          setAdmin(parsed.admin ?? null);
        }
      } catch (error) {
        console.warn("[AdminAuth] Failed to parse stored auth state", error);
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for URL changes (for single-page navigation)
    const handleLocationChange = () => checkAuth();
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (token) {
      const payload = JSON.stringify({ token, admin });
      window.localStorage.setItem(STORAGE_KEY, payload);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [token, admin]);

  const login = ({ token: nextToken, admin: adminInfo }: { token: string; admin: AdminInfo }) => {
    setToken(nextToken);
    setAdmin(adminInfo);
    setIsLoading(false);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      admin,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [token, admin, isLoading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
