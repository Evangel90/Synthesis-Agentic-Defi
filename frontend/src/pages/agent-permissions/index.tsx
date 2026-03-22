import { useState } from 'react'
import type { ToggleItem } from './types'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import SpendingLimitCard from './components/SpendingLimitCard'
import PolicyGuardrailsCard from './components/PolicyGuardrailsCard'
import ConfirmDelegationCard from './components/ConfirmDelegationCard'
import YieldOptimizerCard from './components/YieldOptimizerCard'

export default function AgentPermissions() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [spendingLimit, setSpendingLimit] = useState(100)
  const [autoStaking, setAutoStaking] = useState(true)
  const [stablecoinSwaps, setStablecoinSwaps] = useState(true)
  const [gasSponsorship, setGasSponsorship] = useState(false)

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
    <div
      className="min-h-screen text-slate-900 antialiased"
      style={{
        background: '#ffffff',
        backgroundImage: `radial-gradient(circle, rgba(15,23,42,0.07) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      <TopNav onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex min-h-screen pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className="flex-1 md:ml-60 p-6 md:p-10 w-full">
          {/* Page header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
              AI Agent Permissions &amp;{' '}
              <span className="block md:inline">Smart Wallet</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-xl leading-relaxed">
              Configure your digital proxy. Set the boundaries for autonomous asset
              management and automated yield optimization.
            </p>
          </header>

          {/* Content grid */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left column */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              <SpendingLimitCard value={spendingLimit} onChange={setSpendingLimit} />
              <PolicyGuardrailsCard items={toggleItems} />
            </div>

            {/* Right column */}
            <div className="col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <ConfirmDelegationCard />
              <YieldOptimizerCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
