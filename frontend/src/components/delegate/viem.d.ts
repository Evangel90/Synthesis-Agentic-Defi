declare module 'viem' {
  export function createWalletClient(config: unknown): any
  export function createPublicClient(config: unknown): any
  export function custom(provider: unknown): any
  export function http(url?: string): any
}

declare module 'viem/chains' {
  export const base: {
    id: number
  }

  export const baseSepolia: unknown
}
