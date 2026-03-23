export interface DevDelegationConfig {
  spendingLimit: number
  allowStaking: boolean
  allowSwaps: boolean
  allowGasSponsorship: boolean
}

export type DevDelegationStatus = 'idle' | 'signing' | 'success' | 'error'

export interface SignedDelegationPayload {
  delegate: string
  delegator: string
  authority: string
  salt: string
  caveats: Array<{ enforcer: string; terms: string }>
  signature: string
}
