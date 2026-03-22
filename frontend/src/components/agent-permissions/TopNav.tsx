import { Link } from 'react-router-dom'
import Icon from './Icon'

interface TopNavProps {
  onMenuClick: () => void
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="bg-white/95 backdrop-blur-md flex justify-between items-center w-full px-6 md:px-8 h-16 fixed top-0 z-50 border-b border-slate-200">
      <div className="flex items-center gap-6 md:gap-8">
        {/* Hamburger mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Icon name="menu" />
        </button>

        {/* Logo */}
        <Link to="/" className="text-xl font-black text-slate-900 font-headline tracking-tight">
          Vault.AI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          <Link
            to="/"
            className="text-slate-500 font-headline font-bold tracking-tight hover:text-slate-900 transition-colors text-sm"
          >
            Dashboard
          </Link>
          {['Assets', 'Swap', 'Invest'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-slate-500 font-headline font-bold tracking-tight hover:text-slate-900 transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
          <Icon name="notifications" />
        </button>
        <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
          <Icon name="account_balance_wallet" />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-200">
          <div className="w-full h-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
        </div>
      </div>
    </header>
  )
}
