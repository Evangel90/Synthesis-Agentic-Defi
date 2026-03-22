import type { NavItem, SummaryRow } from './types'

export const NAV_ITEMS: NavItem[] = [
  { icon: 'grid_view', label: 'Overview' },
  { icon: 'smart_toy', label: 'Agent Permissions', active: true },
  { icon: 'shield', label: 'Wallet Security' },
  { icon: 'history', label: 'Transaction History' },
  { icon: 'fingerprint', label: 'Identity' },
]

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { icon: 'help', label: 'Support' },
  { icon: 'logout', label: 'Sign Out' },
]

export const SUMMARY_ROWS: SummaryRow[] = [
  { label: 'Session Duration', value: '30 Days', valueColor: 'text-slate-900' },
  { label: 'Network Fee', value: 'Sponsored', valueColor: 'text-[#2563eb]' },
]

export const SLIDER_LABELS = ['$0', '$1,000', '$2,500', '$5,000']
export const SPENDING_LIMIT_MIN = 0
export const SPENDING_LIMIT_MAX = 5000
