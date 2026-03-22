import { Link } from 'react-router-dom'
import Icon from './Icon'
import Button from './Button'
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from './constants'
import type { NavItem } from './types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-white/95 backdrop-blur-md h-screen w-60 fixed left-0 top-0 pt-20
          flex flex-col text-sm font-medium z-40 border-r border-slate-200
          transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* User info */}
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              V
            </div>
            <div>
              <p className="font-headline font-bold text-slate-900 text-sm">The Digital Vault</p>
              <p className="text-xs text-slate-500">Institutional Grade</p>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 space-y-0.5 px-2">
          {NAV_ITEMS.map((item: NavItem) => (
            <Link
              key={item.label}
              to={item.path || '#'}
              onClick={onClose}
              className={`
                px-4 py-2.5 flex items-center gap-3 rounded-lg transition-all text-sm
                ${
                  item.active
                    ? 'bg-blue-50 text-[#2563eb] font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <Icon name={item.icon} className="text-[18px]" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* New Transaction CTA */}
        <div className="px-4 mb-6">
          <Button variant="primary" size="lg" icon="add" className="py-3 text-sm rounded-xl">
            New Transaction
          </Button>
        </div>

        {/* Bottom nav */}
        <div className="pb-6 space-y-0.5 border-t border-slate-200 pt-4 px-2">
          {BOTTOM_NAV_ITEMS.map((item: NavItem) => (
            <a
              key={item.label}
              href="#"
              onClick={onClose}
              className="text-slate-500 px-4 py-2.5 flex items-center gap-3 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <Icon name={item.icon} className="text-[18px]" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </aside>
    </>
  )
}
