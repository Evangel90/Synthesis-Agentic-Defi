import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { Implementation, toMetaMaskSmartAccount } from '@metamask/delegation-toolkit'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { type SignedDelegationPayload } from '../components/delegate/types'

interface DelegationContextType {
  smartAccountAddress: string | null
  delegationPayload: SignedDelegationPayload | null
  setDelegationPayload: (payload: SignedDelegationPayload | null) => void
  isCalculatingSA: boolean
}

const DelegationContext = createContext<DelegationContextType | undefined>(undefined)

const DEPLOY_SALT = '0x0000000000000000000000000000000000000000000000000000000000000000' as const

export const DelegationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address: eoaAddress, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null)
  const [delegationPayload, setDelegationPayload] = useState<SignedDelegationPayload | null>(null)
  const [isCalculatingSA, setIsCalculatingSA] = useState(false)

  useEffect(() => {
    const calculateSA = async () => {
      if (isConnected && eoaAddress && walletClient) {
        setIsCalculatingSA(true)
        try {
          // Use public client for Base Sepolia as SA kit requires it
          const bSepoliaPublicClient = createPublicClient({
            chain: baseSepolia,
            transport: http(),
          })

          const userSmartAccount = await toMetaMaskSmartAccount({
            client: bSepoliaPublicClient as any,
            implementation: Implementation.Hybrid,
            signer: { walletClient: walletClient as any },
            deployParams: [eoaAddress as `0x${string}`, [], [], []],
            deploySalt: DEPLOY_SALT,
          })
          
          console.log("🔗 [DelegationContext] Calculated Smart Account:", userSmartAccount.address);
          setSmartAccountAddress(userSmartAccount.address)
        } catch (error) {
          console.error("❌ [DelegationContext] Failed to calculate Smart Account:", error)
        } finally {
          setIsCalculatingSA(false)
        }
      } else {
        // We don't necessarily want to clear SA address if wallet client is temporarily null
        // but if disconnected, we should.
        if (!isConnected) {
            setSmartAccountAddress(null)
            setDelegationPayload(null)
        }
      }
    }

    calculateSA()
  }, [isConnected, eoaAddress, walletClient])

  return (
    <DelegationContext.Provider 
      value={{ 
        smartAccountAddress, 
        delegationPayload, 
        setDelegationPayload,
        isCalculatingSA
      }}
    >
      {children}
    </DelegationContext.Provider>
  )
}

export const useDelegation = () => {
  const context = useContext(DelegationContext)
  if (context === undefined) {
    throw new Error('useDelegation must be used within a DelegationProvider')
  }
  return context
}
