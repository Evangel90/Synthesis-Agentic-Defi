declare module 'viem' {
  export function createWalletClient(config: unknown): {
    requestAddresses: () => Promise<string[]>
    signTypedData: (args: unknown) => Promise<string>
  }

  export function custom(provider: unknown): unknown
}

declare module 'viem/chains' {
  export const base: {
    id: number
  }
}
