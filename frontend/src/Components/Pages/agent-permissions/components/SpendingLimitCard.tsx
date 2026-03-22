import Card from './Card'
import { SLIDER_LABELS, SPENDING_LIMIT_MAX, SPENDING_LIMIT_MIN } from '../constants'

interface SpendingLimitCardProps {
  value: number
  onChange: (v: number) => void
}

export default function SpendingLimitCard({ value, onChange }: SpendingLimitCardProps) {
  const percent = ((value - SPENDING_LIMIT_MIN) / (SPENDING_LIMIT_MAX - SPENDING_LIMIT_MIN)) * 100

  return (
    <Card>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="font-headline text-base font-bold text-slate-900">
            Daily Spending Limit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Max auto-approval threshold per 24h
          </p>
        </div>

        {/* Input box */}
        <div className="flex items-center bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
          <span className="text-slate-500 font-bold mr-1 text-sm">$</span>
          <input
            type="text"
            value={value.toFixed(2)}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value)
              if (!isNaN(parsed))
                onChange(Math.min(SPENDING_LIMIT_MAX, Math.max(SPENDING_LIMIT_MIN, parsed)))
            }}
            className="bg-transparent border-none outline-none p-0 w-20 font-headline font-bold text-slate-900 text-base focus:ring-0"
          />
        </div>
      </div>

      {/* Slider track */}
      <div className="relative py-3">
        <div className="relative h-1.5">
          {/* Base track */}
          <div className="w-full h-full bg-slate-200 rounded-full absolute" />
          {/* Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-[#2563eb] rounded-full pointer-events-none"
            style={{ width: `${percent}%` }}
          />
          {/* Invisible range input for interaction */}
          <input
            type="range"
            min={SPENDING_LIMIT_MIN}
            max={SPENDING_LIMIT_MAX}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#2563eb] rounded-full border-2 border-white shadow-lg pointer-events-none"
            style={{ left: `${percent}%` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-4 text-[10px] font-medium text-slate-400">
          {SLIDER_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}
