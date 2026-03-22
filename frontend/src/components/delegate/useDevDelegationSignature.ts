import { useMemo, useState } from 'react'
import { createWalletClient, custom } from 'viem'
import type { DevDelegationConfig, DevDelegationStatus } from './types'

type EthereumWindow = Window & {
  ethereum?: {
    request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  }
}

const DUMMY_AGENT = '0x0000000000000000000000000000000000000000'

const DUMMY_DELEGATION_TYPES = {
  DummyDelegation: [
    { name: 'agent', type: 'address' },
    { name: 'spendingLimit', type: 'uint256' },
    { name: 'allowStaking', type: 'bool' },
    { name: 'allowSwaps', type: 'bool' },
    { name: 'allowGasSponsorship', type: 'bool' },
    { name: 'expiry', type: 'uint256' },
    { name: 'note', type: 'string' },
  ],
} as const

function parseChainId(chainId: unknown) {
  if (typeof chainId === 'string') {
    return chainId.startsWith('0x') ? Number.parseInt(chainId, 16) : Number(chainId)
  }

  if (typeof chainId === 'number') {
    return chainId
  }

  return 1
}

export function useDevDelegationSignature(config: DevDelegationConfig) {
  const [status, setStatus] = useState<DevDelegationStatus>('idle')
  const [error, setError] = useState('')
  const [signature, setSignature] = useState('')

  const buttonLabel = useMemo(() => {
    switch (status) {
      case 'signing':
        return 'Opening MetaMask...'
      case 'success':
        return 'Signature Captured'
      case 'error':
        return 'Retry Delegation Signature'
      default:
        return 'Sign Delegation Transaction'
    }
  }, [status])

  async function signDelegation() {
    const browserWindow = window as EthereumWindow

    if (!browserWindow.ethereum) {
      setStatus('error')
      setError('MetaMask not installed')
      setSignature('')
      return
    }

    setStatus('signing')
    setError('')

    try {
      const walletClient = createWalletClient({
        transport: custom(browserWindow.ethereum),
      })

      let accounts = await walletClient.requestAddresses()

      // MetaMask/providers can occasionally reject viem's wallet action wrapper
      // even though direct account request succeeds. Keep viem as primary path.
      if ((!accounts || accounts.length === 0) && browserWindow.ethereum.request) {
        const fallbackAccounts = await browserWindow.ethereum.request({
          method: 'eth_requestAccounts',
        })

        if (Array.isArray(fallbackAccounts)) {
          accounts = fallbackAccounts.filter(
            (account): account is string => typeof account === 'string',
          )
        }
      }

      const [account] = accounts

      if (!account) {
        throw new Error('No wallet account available')
      }

      const activeChainId = browserWindow.ethereum.request
        ? parseChainId(
            await browserWindow.ethereum.request({
              method: 'eth_chainId',
            }),
          )
        : 1

      const nextSignature = await walletClient.signTypedData({
        account,
        domain: {
          name: 'Vault.AI Dev',
          version: '1',
          chainId: activeChainId,
        },
        types: DUMMY_DELEGATION_TYPES,
        primaryType: 'DummyDelegation',
        message: {
          agent: DUMMY_AGENT,
          spendingLimit: BigInt(Math.max(0, Math.floor(config.spendingLimit))),
          allowStaking: config.allowStaking,
          allowSwaps: config.allowSwaps,
          allowGasSponsorship: config.allowGasSponsorship,
          expiry: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30),
          note: 'DEV ONLY - NOT A REAL DELEGATION',
        },
      })

      setSignature(nextSignature)
      setStatus('success')
    } catch (signError) {
      const message =
        signError instanceof Error ? signError.message : 'Failed to sign delegation'

      const normalizedMessage =
        message.includes('User rejected') || message.includes('denied')
          ? 'Signature request was cancelled'
          : message

      setStatus('error')
      setError(normalizedMessage)
      setSignature('')
    }
  }

  return {
    status,
    error,
    signature,
    buttonLabel,
    signDelegation,
    isBusy: status === 'signing',
  }
}
