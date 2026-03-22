export interface NavItem {
  icon: string
  label: string
  active?: boolean
}

export interface ToggleItem {
  icon: string
  label: string
  desc: string
  iconBg: string
  iconColor: string
  value: boolean
  onChange: (v: boolean) => void
}

export interface SummaryRow {
  label: string
  value: string
  valueColor: string
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  children: React.ReactNode
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}