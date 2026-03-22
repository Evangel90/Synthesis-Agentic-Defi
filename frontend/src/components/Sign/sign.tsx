import { useEffect, useMemo, useState } from "react";
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { useAuthSession } from "../../auth-session";
import { AUTH_CONNECTION, WALLET_CONNECTORS, web3AuthEnabled } from "../../web3auth";

type GoogleProfile = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
};

type SignInLayoutProps = {
  googleButton?: React.ReactNode;
  googleContent: React.ReactNode;
  walletStatus: string;
  isConnected: boolean;
  address?: string;
  chainId: string;
  walletBadge: string;
  walletSubLabel: string;
  walletButtonLabel: string;
  walletButtonDisabled: boolean;
  onWalletClick: () => void | Promise<void>;
};

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatChainId(chainId: string) {
  const parsed = Number.parseInt(chainId, 16);
  return Number.isNaN(parsed) ? chainId : `${parsed} (${chainId})`;
}

function SignInLayout({
  googleButton,
  googleContent,
  walletStatus,
  isConnected,
  address,
  chainId,
  walletBadge,
  walletSubLabel,
  walletButtonLabel,
  walletButtonDisabled,
  onWalletClick,
}: SignInLayoutProps) {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col justify-center items-center selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="w-full max-w-md px-6 py-12 mx-auto">
        <div className="bg-surface-container-lowest rounded-xl soft-shadow p-10 flex flex-col items-center text-center space-y-8 border border-outline-variant/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
              <span
                className="material-symbols-outlined text-on-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock
              </span>
            </div>
            <h1 className="font-headline font-black text-2xl tracking-tight text-on-surface">
              Vault.AI
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-on-surface-variant/80 font-medium leading-relaxed">
              Your AI-powered gateway to decentralized finance.
            </p>
            <div className="h-0.5 w-8 bg-primary/20 mx-auto rounded-full" />
          </div>

          <div className="w-full flex flex-col space-y-4 pt-4">
            {googleButton}
            <button
              onClick={onWalletClick}
              disabled={walletButtonDisabled}
              className="w-full bg-surface-container-lowest hover:bg-surface-container-low text-primary border-2 border-primary/10 hover:border-primary/30 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">
                {isConnected ? "wallet" : "account_balance_wallet"}
              </span>
              <span>{walletButtonLabel}</span>
            </button>
          </div>

          <div className="w-full space-y-3 text-left">
            {googleContent}
            {walletStatus !== "" && (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                <p className="text-[11px] font-label font-semibold uppercase tracking-[0.14em] text-on-surface-variant/70">
                  Wallet
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">{walletStatus}</p>
                {isConnected && address ? (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {shortenAddress(address)}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Chain {formatChainId(chainId)}
                      </p>
                      <p className="text-xs text-on-surface-variant">{walletSubLabel}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      {walletBadge}
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <p className="text-xs text-on-surface-variant/60 font-body">
            Both authentication paths expose the connected wallet address after login.
          </p>
        </div>

        <footer className="mt-8 flex justify-center space-x-6">
          <a
            href="#"
            className="text-xs font-label font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Terms of Service
          </a>
          <span className="w-1 h-1 bg-outline-variant rounded-full self-center" />
          <a
            href="#"
            className="text-xs font-label font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Privacy Policy
          </a>
        </footer>
      </main>

      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

export function SignIn() {
  const [walletError, setWalletError] = useState("");
  const [walletMessage, setWalletMessage] = useState("");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    connectAsync,
    connectors,
    isPending: metamaskLoading,
    error: metamaskConnectError,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { markSignedIn } = useAuthSession();

  const walletStatus = useMemo(() => {
    if (isConnected && address) {
      return `MetaMask connected on chain ${formatChainId(`0x${chainId.toString(16)}`)}`;
    }

    if (walletError) {
      return walletError;
    }

    if (walletMessage) {
      return walletMessage;
    }

    if (metamaskLoading) {
      return "Connecting to your wallet...";
    }

    if (metamaskConnectError instanceof Error) {
      return metamaskConnectError.message;
    }

    return "";
  }, [address, chainId, isConnected, metamaskConnectError, metamaskLoading, walletError, walletMessage]);

  const handleConnectWallet = async () => {
    if (isConnected) {
      disconnect();
      setWalletError("");
      setWalletMessage("");
      return;
    }

    setWalletError("");
    setWalletMessage("");

    try {
      const injectedConnector =
        connectors.find((connector) => connector.id === "injected") ||
        connectors[0];

      if (!injectedConnector) {
        throw new Error("No wallet connector is configured.");
      }

      setWalletMessage("Requesting MetaMask connection...");
      await connectAsync({ connector: injectedConnector });
      markSignedIn("metamask");
      setWalletMessage("");
    } catch (error) {
      setWalletError(
        error instanceof Error ? error.message : "Wallet connection was rejected.",
      );
      setWalletMessage("");
    }
  };

  return (
    <SignInLayout
      googleContent={null}
      walletStatus={walletStatus}
      isConnected={isConnected}
      address={address}
      chainId={`0x${chainId.toString(16)}`}
      walletBadge="MetaMask"
      walletSubLabel="Authenticated with MetaMask"
      walletButtonLabel={
        metamaskLoading ? "Connecting..." : isConnected ? "Disconnect" : "Connect with MetaMask"
      }
      walletButtonDisabled={metamaskLoading}
      onWalletClick={handleConnectWallet}
    />
  );
}

export function SignInWithWeb3Auth() {
  const [googleMessage, setGoogleMessage] = useState("");
  const [walletError, setWalletError] = useState("");
  const [walletMessage, setWalletMessage] = useState("");
  const { address: metamaskAddress, isConnected: metamaskConnected } = useAccount();
  const metamaskChainId = useChainId();
  const {
    connectAsync,
    connectors,
    isPending: metamaskLoading,
    error: metamaskConnectError,
  } = useConnect();
  const { disconnect: disconnectInjected } = useDisconnect();
  const { provider, isConnected: web3AuthConnected } = useWeb3Auth();
  const {
    connectTo,
    loading: googleLoading,
    error: googleConnectError,
  } = useWeb3AuthConnect();
  const { disconnect: disconnectWeb3Auth, loading: disconnectLoading } =
    useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { markSignedIn } = useAuthSession();
  const [googleAddress, setGoogleAddress] = useState<`0x${string}` | null>(null);
  const [googleChainId, setGoogleChainId] = useState("");

  const googleProfile = useMemo<GoogleProfile | null>(() => {
    if (!userInfo?.email) {
      return null;
    }

    return {
      sub: userInfo.email,
      name: userInfo.name ?? userInfo.email,
      email: userInfo.email,
      picture: userInfo.profileImage ?? undefined,
    };
  }, [userInfo]);

  useEffect(() => {
    let cancelled = false;

    async function syncGoogleWallet() {
      if (!provider || !web3AuthConnected) {
        if (!cancelled) {
          setGoogleAddress(null);
          setGoogleChainId("");
        }
        return;
      }

      try {
        const [accounts, chainIdHex] = await Promise.all([
          provider.request({ method: "eth_accounts" }) as Promise<string[]>,
          provider.request({ method: "eth_chainId" }) as Promise<string>,
        ]);

        if (!cancelled) {
          setGoogleAddress((accounts[0] as `0x${string}` | undefined) ?? null);
          setGoogleChainId(chainIdHex ?? "");
        }
      } catch {
        if (!cancelled) {
          setGoogleAddress(null);
          setGoogleChainId("");
        }
      }
    }

    void syncGoogleWallet();

    return () => {
      cancelled = true;
    };
  }, [provider, web3AuthConnected]);

  const isGoogleConnected = Boolean(googleProfile && web3AuthConnected && googleAddress);
  const isConnected = metamaskConnected || isGoogleConnected;
  const activeAddress = isGoogleConnected ? googleAddress : metamaskAddress;
  const activeChainId = isGoogleConnected
    ? googleChainId
    : `0x${metamaskChainId.toString(16)}`;
  const isBusy = metamaskLoading || googleLoading || disconnectLoading;

  const googleStatus = useMemo(() => {
    if (googleProfile) {
      return `Connected with Google as ${googleProfile.email}`;
    }

    if (googleLoading) {
      return "Opening Google social login...";
    }

    if (googleMessage) {
      return googleMessage;
    }

    if (!web3AuthEnabled) {
      return "Set VITE_WEB3AUTH_CLIENT_ID to enable Google social login.";
    }

    if (googleConnectError instanceof Error) {
      return googleConnectError.message;
    }

    return "";
  }, [googleConnectError, googleLoading, googleMessage, googleProfile]);

  const walletStatus = useMemo(() => {
    if (isConnected && activeAddress) {
      return isGoogleConnected
        ? `Google wallet connected on chain ${formatChainId(activeChainId)}`
        : `MetaMask connected on chain ${formatChainId(activeChainId)}`;
    }

    if (walletError) {
      return walletError;
    }

    if (walletMessage) {
      return walletMessage;
    }

    if (metamaskLoading || disconnectLoading) {
      return "Connecting to your wallet...";
    }

    if (metamaskConnectError instanceof Error) {
      return metamaskConnectError.message;
    }

    return "";
  }, [
    activeAddress,
    activeChainId,
    disconnectLoading,
    isConnected,
    isGoogleConnected,
    metamaskConnectError,
    metamaskLoading,
    walletError,
    walletMessage,
  ]);

  const handleGoogleSignIn = async () => {
    if (isConnected && !isGoogleConnected) {
      setGoogleMessage("Disconnect your current wallet before starting Google login.");
      return;
    }

    if (!web3AuthEnabled) {
      setGoogleMessage("Missing VITE_WEB3AUTH_CLIENT_ID for Google social login.");
      return;
    }

    setGoogleMessage("");
    setWalletError("");
    setWalletMessage("");

    try {
      await connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.GOOGLE,
      });
      markSignedIn("google");
    } catch (error) {
      setGoogleMessage(
        error instanceof Error ? error.message : "Google sign-in was cancelled.",
      );
    }
  };

  const handleConnectWallet = async () => {
    if (isConnected) {
      if (isGoogleConnected) {
        await disconnectWeb3Auth();
        setGoogleAddress(null);
        setGoogleChainId("");
      } else {
        disconnectInjected();
      }

      setWalletError("");
      setWalletMessage("");
      setGoogleMessage("");
      return;
    }

    setWalletError("");
    setWalletMessage("");
    setGoogleMessage("");

    try {
      const injectedConnector =
        connectors.find((connector) => connector.id === "injected") ||
        connectors[0];

      if (!injectedConnector) {
        throw new Error("No wallet connector is configured.");
      }

      setWalletMessage("Requesting MetaMask connection...");
      await connectAsync({ connector: injectedConnector });
      markSignedIn("metamask");
      setWalletMessage("");
    } catch (error) {
      setWalletError(
        error instanceof Error ? error.message : "Wallet connection was rejected.",
      );
      setWalletMessage("");
    }
  };

  return (
    <SignInLayout
      googleButton={
        <button
          onClick={handleGoogleSignIn}
          disabled={isBusy || (isConnected && !isGoogleConnected)}
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-[0.98] shadow-md shadow-primary/10"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="currentColor"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="currentColor"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="currentColor"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="currentColor"
            />
          </svg>
          <span>
            {googleLoading
              ? "Connecting..."
              : googleProfile
                ? "Reconnect Google"
                : "Sign up with Google"}
          </span>
        </button>
      }
      googleContent={
        googleStatus !== "" ? (
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
            <p className="text-[11px] font-label font-semibold uppercase tracking-[0.14em] text-on-surface-variant/70">
              Google
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">{googleStatus}</p>
            {googleProfile ? (
              <div className="mt-3 flex items-center gap-3">
                {googleProfile.picture ? (
                  <img
                    src={googleProfile.picture}
                    alt={googleProfile.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-on-surface">{googleProfile.name}</p>
                  <p className="text-xs text-on-surface-variant">{googleProfile.email}</p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null
      }
      walletStatus={walletStatus}
      isConnected={isConnected}
      address={activeAddress ?? undefined}
      chainId={activeChainId}
      walletBadge={isGoogleConnected ? "Google" : "MetaMask"}
      walletSubLabel={
        isGoogleConnected ? "Authenticated with Google" : "Authenticated with MetaMask"
      }
      walletButtonLabel={
        metamaskLoading || disconnectLoading
          ? "Connecting..."
          : isConnected
            ? "Disconnect"
            : "Connect with MetaMask"
      }
      walletButtonDisabled={isBusy}
      onWalletClick={handleConnectWallet}
    />
  );
}
