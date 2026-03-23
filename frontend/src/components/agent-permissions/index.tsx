import { useState } from 'react'
import type { ToggleItem } from './types'
import Sidebar from '../vault-dashboard/Sidebar'
import SpendingLimitCard from './SpendingLimitCard'
import PolicyGuardrailsCard from './PolicyGuardrailsCard'
import ConfirmDelegationCard from './ConfirmDelegationCard'
import YieldOptimizerCard from './YieldOptimizerCard'
import { useAccount } from 'wagmi'

export default function AgentPermissions() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [spendingLimit, setSpendingLimit] = useState(100)
  const [autoStaking, setAutoStaking] = useState(true)
  const [stablecoinSwaps, setStablecoinSwaps] = useState(true)
  const [gasSponsorship, setGasSponsorship] = useState(false)
  
  const { address } = useAccount()
  const truncatedAddress = address ? address.slice(0, 6) + '...' + address.slice(-4) : '0x00...0000'

  const toggleItems: ToggleItem[] = [
    {
      icon: 'account_balance',
      label: 'Allow auto-staking',
      desc: 'Enable agent to deposit assets into verified yield pools.',
      iconBg: 'rgba(37,99,235,0.15)',
      iconColor: '#4d9fff',
      value: autoStaking,
      onChange: setAutoStaking,
    },
    {
      icon: 'currency_exchange',
      label: 'Allow stablecoin swaps',
      desc: 'Permit rebalancing between USDC, USDT, and DAI.',
      iconBg: 'rgba(148,55,0,0.15)',
      iconColor: '#fb923c',
      value: stablecoinSwaps,
      onChange: setStablecoinSwaps,
    },
    {
      icon: 'local_gas_station',
      label: 'Allow gas sponsorship',
      desc: 'Let the agent pay for user transaction fees via Paymaster.',
      iconBg: 'rgba(73,92,149,0.15)',
      iconColor: '#a5b4fc',
      value: gasSponsorship,
      onChange: setGasSponsorship,
    },
  ]

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden font-body relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex md:ml-64 overflow-hidden relative z-10 w-full">
        <section className="w-full h-full bg-surface p-6 md:p-8 lg:p-10 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <header className="flex justify-between items-center mb-10 md:mb-12">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button 
                className="md:hidden p-2 -ml-2 text-on-surface hover:bg-surface-variant/50 rounded-full transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-surface-container-highest shrink-0">
                <img 
                  className="w-full h-full object-cover" 
                  alt="User profile avatar close up" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ7QqyDETrUCdBg2tJGK8aAOjhQgVpET5tqC7OmByVbW8syVlOje5o4r4gMhSuocmcN7Igk1kPUKajAxCNe_hRFMknl2o2gkkJaS0GojQqStCM5sUav3a2Z5oIHnlhPeBJDOmxgsprBkIl0RNhQp6gZnQl32IOdpMZyuMdNas5Ka8q-5xxNMEfSO0bivaH0_X64akv1lOIr8-wH4ZZXWg815hwgUHfg9eiDsyIZWoJ47-uuztiwKsk_9c-7tWy7SzYd_ZIwlDd4IA"
                />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-semibold text-on-surface-variant/60">Welcome back</p>
                <h2 className="font-headline font-bold text-base md:text-lg">Alex Rivera</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden xs:flex items-center bg-surface-container-low px-3 md:px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-container transition-colors cursor-pointer group">
                <span className="text-[10px] md:text-xs font-mono text-on-surface-variant mr-2 md:mr-3">{truncatedAddress}</span>
                <span className="material-symbols-outlined text-xs md:text-sm text-primary group-hover:scale-110 transition-transform">content_copy</span>
              </div>
            </div>
          </header>

          {/* Page header */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tight mb-3">
              AI Agent Permissions &amp;{' '}
              <span className="block md:inline">Smart Wallet</span>
            </h1>
            <p className="text-on-surface-variant/70 text-sm md:text-base max-w-xl leading-relaxed font-medium">
              Configure your digital proxy. Set the boundaries for autonomous asset
              management and automated yield optimization.
            </p>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left column */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              <SpendingLimitCard value={spendingLimit} onChange={setSpendingLimit} />
              <PolicyGuardrailsCard items={toggleItems} />
            </div>

            {/* Right column */}
            <div className="col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-4">
              <ConfirmDelegationCard
                spendingLimit={spendingLimit}
                allowStaking={autoStaking}
                allowSwaps={stablecoinSwaps}
                allowGasSponsorship={gasSponsorship}
              />
              <YieldOptimizerCard />
            </div>
          </div>
        </section>
      </main>

      {/* Background Decorations */}
      <div className="fixed top-0 right-0 w-full md:w-[60%] h-[40%] bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 md:left-64 w-full md:w-[30%] h-[30%] bg-gradient-to-tr from-secondary/5 to-transparent pointer-events-none z-0"></div>
    </div>
  )
}
