import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3AuthProvider } from '@web3auth/modal/react'
import { WagmiProvider } from 'wagmi'
import './polyfills'
import './index.css'
import App, { AppWithWeb3Auth } from './App.tsx'
import { wagmiConfig } from './wagmi'
import { web3AuthContextConfig, web3AuthEnabled } from './web3auth'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {web3AuthEnabled ? (
          <Web3AuthProvider config={web3AuthContextConfig}>
            <AppWithWeb3Auth />
          </Web3AuthProvider>
        ) : (
          <App />
        )}
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>,
)
