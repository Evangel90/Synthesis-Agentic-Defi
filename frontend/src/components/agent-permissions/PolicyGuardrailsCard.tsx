import Icon from './Icon'
import Toggle from './Toggle'
import type { ToggleItem } from './types'
import Card from './Card'

interface PolicyGuardrailsCardProps {
  items: ToggleItem[]
}

export default function PolicyGuardrailsCard({ items }: PolicyGuardrailsCardProps) {
  return (
    <Card padding={false} className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 md:px-8 md:py-6 border-b border-outline-variant/10">
        <h3 className="font-headline text-base font-bold text-on-surface">Policy Guardrails</h3>
        <p className="text-xs text-on-surface-variant/70 mt-0.5">
          Define what actions your AI agent can take
        </p>
      </div>

      {/* Toggle rows */}
      <div className="divide-y divide-outline-variant/10">
        {items.map((item) => (
          <div
            key={item.label}
            className="px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 hover:bg-surface-container/30 transition-colors"
          >
            <div className="flex gap-4 items-center min-w-0">
              {/* Icon box */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: item.iconBg, color: item.iconColor }}
              >
                <Icon name={item.icon} className="text-[18px]" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="font-bold text-on-surface text-sm">{item.label}</p>
                <p className="text-xs text-on-surface-variant/70 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>

            <Toggle checked={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>
    </Card>
  )
}
