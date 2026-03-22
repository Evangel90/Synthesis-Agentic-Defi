import type { ToggleProps } from '../types'

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full flex items-center transition-colors duration-200 flex-shrink-0 ${
        checked ? 'bg-[#2563eb]' : 'bg-white/10'
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute transition-all duration-200 shadow ${
          checked ? 'right-1' : 'left-1'
        }`}
      />
    </button>
  )
}
