import { AUTH_CONNECTION, WEB3AUTH_NETWORK } from "@web3auth/auth";
import { CHAIN_NAMESPACES, WALLET_CONNECTORS } from "@web3auth/no-modal";
import { base } from "viem/chains";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID?.trim() ?? "";
const networkName = import.meta.env.VITE_WEB3AUTH_NETWORK?.trim() ?? "SAPPHIRE_DEVNET";

const web3AuthNetwork =
  WEB3AUTH_NETWORK[networkName as keyof typeof WEB3AUTH_NETWORK] ??
  WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;

export const web3AuthEnabled = clientId !== "";

type BaseChain = {
  id: number;
  name: string;
  rpcUrls: { default: { http: string[] } };
  blockExplorers?: { default?: { url?: string } };
  nativeCurrency: { symbol: string; name: string; decimals: number };
};

const baseChain = base as BaseChain;

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork,
    chains: [
      {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: `0x${baseChain.id.toString(16)}`,
        rpcTarget: baseChain.rpcUrls.default.http[0] ?? "https://mainnet.base.org",
        displayName: baseChain.name,
        blockExplorerUrl: baseChain.blockExplorers?.default?.url ?? "https://basescan.org",
        logo: "https://basescan.org/images/svg/brands/main.svg",
        ticker: baseChain.nativeCurrency.symbol,
        tickerName: baseChain.nativeCurrency.name,
        decimals: baseChain.nativeCurrency.decimals,
      },
    ],
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "Social login",
          loginMethods: {
            [AUTH_CONNECTION.GOOGLE]: {
              name: "Google",
              showOnModal: true,
            },
          },
        },
      },
      hideWalletDiscovery: false,
    },
  },
};

export { AUTH_CONNECTION, WALLET_CONNECTORS };
