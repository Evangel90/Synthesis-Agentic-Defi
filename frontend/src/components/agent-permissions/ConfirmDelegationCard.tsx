import Button from './Button'
import Card from './Card'
import { SUMMARY_ROWS } from './constants'

export default function ConfirmDelegationCard() {
  return (
    <Card className="border border-slate-200">
      {/* Badge + heading */}
      <div className="mb-6">
        <span className="bg-[#2563eb]/20 text-[#4d9fff] text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded">
          EIP-4337 SECURE
        </span>
        <h2 className="font-headline text-lg font-bold mt-3 text-slate-900">
          Confirm Delegation
        </h2>
        <p className="text-slate-500 mt-1.5 text-xs leading-relaxed">
          Deploy your session keys to the blockchain to activate these permissions.
        </p>
      </div>

      {/* Summary rows */}
      <div className="space-y-3 mb-6">
        {SUMMARY_ROWS.map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-slate-500 text-xs">{row.label}</span>
            <span className={`font-bold text-xs ${row.valueColor}`}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        icon="edit_note"
        className="font-bold text-sm py-3 rounded-xl shadow-lg shadow-blue-500/25"
      >
        Sign Delegation Transaction
      </Button>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-[#2563eb] to-[#7c3aed]" />
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          Powered by Safe Smart Wallet / Account Abstraction
        </span>
      </div>
    </Card>
  )
}
