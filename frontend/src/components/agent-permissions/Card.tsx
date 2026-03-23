import type { CardProps } from './types'

export default function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`
        bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm
        ${padding ? 'p-6 md:p-8' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
