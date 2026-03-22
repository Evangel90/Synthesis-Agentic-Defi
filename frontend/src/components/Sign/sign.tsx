import { useMemo, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";

type GoogleProfile = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
};

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatChainId(chainId: string) {
  const parsed = Number.parseInt(chainId, 16);
  return Number.isNaN(parsed) ? chainId : `${parsed} (${chainId})`;
}

export function SignIn() {
  const backendAuthBase = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");
  const [googleProfile] = useState<GoogleProfile | null>(null);
  const [walletError, setWalletError] = useState("");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectAsync, connectors, isPending: walletLoading } = useConnect();
  const { disconnect } = useDisconnect();

  const googleStatus = useMemo(() => {
    if (googleProfile) {
      return `Signed in as ${googleProfile.email}`;
    }

    if (googleLoading) {
      return "Redirecting to backend auth...";
    }

    if (googleMessage) {
      return googleMessage;
    }

    return "";
  }, [googleLoading, googleMessage, googleProfile]);

  const walletStatus = useMemo(() => {
    if (isConnected && address) {
      return `Wallet connected on chain ${formatChainId(`0x${chainId.toString(16)}`)}`;
    }

    if (walletError) {
      return walletError;
    }

    if (walletLoading) {
      return "Connecting to your wallet...";
    }

    return "";
  }, [address, chainId, isConnected, walletError, walletLoading]);

  const handleGoogleSignIn = () => {
    if (!backendAuthBase) {
      setGoogleMessage(
        "Backend Google auth is not connected yet. Wire the backend endpoint to enable this action.",
      );
      return;
    }

    setGoogleLoading(true);
    setGoogleMessage("Google sign-in will be completed through the backend auth flow.");
    window.location.href = `${backendAuthBase}/auth/google`;
  };

  const handleConnectWallet = async () => {
    if (isConnected) {
      disconnect();
      setWalletError("");
      return;
    }
    setWalletError("");

    try {
      const injectedConnector =
        connectors.find((connector) => connector.id === "injected") ||
        connectors[0];

      if (!injectedConnector) {
        throw new Error("No wallet connector is configured.");
      }

      await connectAsync({ connector: injectedConnector });
    } catch (error) {
      setWalletError(
        error instanceof Error
          ? error.message
          : "Wallet connection was rejected.",
      );
    }
  };

  return (
    <body className="bg-surface font-body text-on-surface min-h-screen flex flex-col justify-center items-center selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="w-full max-w-md px-6 py-12 mx-auto">
        {/* Auth Card */}
        <div className="bg-surface-container-lowest rounded-xl soft-shadow p-10 flex flex-col items-center text-center space-y-8 border border-outline-variant/20">
          {/* Logo Section */}
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

          {/* Tagline */}
          <div className="space-y-2">
            <p className="text-on-surface-variant/80 font-medium leading-relaxed">
              Your AI-powered gateway to decentralized finance.
            </p>
            <div className="h-0.5 w-8 bg-primary/20 mx-auto rounded-full" />
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col space-y-4 pt-4">
            {/* Primary Action: Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
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
                    : "Sign in with Google"}
              </span>
            </button>

            {/* Secondary Action: Wallet */}
            <button
              onClick={handleConnectWallet}
              disabled={walletLoading}
              className="w-full bg-surface-container-lowest hover:bg-surface-container-low text-primary border-2 border-primary/10 hover:border-primary/30 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">
                {isConnected ? "wallet" : "account_balance_wallet"}
              </span>
              <span>
                {walletLoading
                  ? "Connecting..."
                  : isConnected
                    ? "Disconnect"
                    : "Connect Wallet"}
              </span>
            </button>
          </div>

          <div className="w-full space-y-3 text-left">
            {googleStatus !== "" && (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                <p className="text-[11px] font-label font-semibold uppercase tracking-[0.14em] text-on-surface-variant/70">
                  Google
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {googleStatus}
                </p>
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
                      <p className="text-sm font-semibold text-on-surface">
                        {googleProfile.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {googleProfile.email}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {walletStatus !== "" && (
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                <p className="text-[11px] font-label font-semibold uppercase tracking-[0.14em] text-on-surface-variant/70">
                  Wallet
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {walletStatus}
                </p>
                {isConnected && address ? (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {shortenAddress(address)}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Chain {formatChainId(`0x${chainId.toString(16)}`)}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      Connected
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Context Info */}
          <p className="text-xs text-on-surface-variant/60 font-body">
            By signing in, you agree to our automated risk assessment protocols.
          </p>
        </div>

        {/* Footer Links */}
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

      {/* Visual Background Accents */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    </body>
  );
}
