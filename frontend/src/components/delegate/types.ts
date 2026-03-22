export interface DevDelegationConfig {
  spendingLimit: number
  allowStaking: boolean
  allowSwaps: boolean
  allowGasSponsorship: boolean
}

export type DevDelegationStatus = 'idle' | 'signing' | 'success' | 'error'
