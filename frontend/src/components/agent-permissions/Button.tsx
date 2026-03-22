import type { ButtonProps } from './types'
import Icon from './Icon'

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-headline font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg shadow-blue-500/30',
    ghost:
      'bg-transparent text-white/60 hover:bg-white/5',
  }

  const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-3 text-base',
    lg: 'w-full py-4 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <Icon name={icon} />}
    </button>
  )
}
