/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type AuthProviderType = "metamask" | "google";

type AuthSessionContextValue = {
  authProvider: AuthProviderType | null;
  isAuthenticated: boolean;
  markSignedIn: (provider: AuthProviderType) => void;
  signOut: () => Promise<void>;
};

type AuthSessionProviderProps = PropsWithChildren<{
  metamaskConnected: boolean;
  googleConnected: boolean;
  onSignOut: () => Promise<void> | void;
}>;

const STORAGE_KEY = "vault-ai-auth-provider";

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function readStoredProvider(): AuthProviderType | null {
  if (typeof window === "undefined") {
    return null;
  }

  const provider = window.sessionStorage.getItem(STORAGE_KEY);
  return provider === "metamask" || provider === "google" ? provider : null;
}

function writeStoredProvider(provider: AuthProviderType | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (provider) {
    window.sessionStorage.setItem(STORAGE_KEY, provider);
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function AuthSessionProvider({
  children,
  metamaskConnected,
  googleConnected,
  onSignOut,
}: AuthSessionProviderProps) {
  const [authProvider, setAuthProvider] = useState<AuthProviderType | null>(() => readStoredProvider());

  useEffect(() => {
    if (!authProvider) {
      return;
    }

    const providerDisconnected =
      (authProvider === "metamask" && !metamaskConnected) ||
      (authProvider === "google" && !googleConnected);

    if (providerDisconnected) {
      writeStoredProvider(null);
    }
  }, [authProvider, googleConnected, metamaskConnected]);

  const markSignedIn = useCallback((provider: AuthProviderType) => {
    setAuthProvider(provider);
    writeStoredProvider(provider);
  }, []);

  const signOut = useCallback(async () => {
    setAuthProvider(null);
    writeStoredProvider(null);
    await onSignOut();
  }, [onSignOut]);

  const effectiveAuthProvider =
    authProvider === "metamask"
      ? metamaskConnected
        ? authProvider
        : null
      : authProvider === "google"
        ? googleConnected
          ? authProvider
          : null
        : null;

  const isAuthenticated =
    effectiveAuthProvider === "metamask"
      ? metamaskConnected
      : effectiveAuthProvider === "google"
        ? googleConnected
        : false;

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      authProvider: effectiveAuthProvider,
      isAuthenticated,
      markSignedIn,
      signOut,
    }),
    [effectiveAuthProvider, isAuthenticated, markSignedIn, signOut],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider.");
  }

  return context;
}
