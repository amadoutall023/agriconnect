import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  note: string
  icon: LucideIcon
  tone?: 'green' | 'orange' | 'blue'
}

const tones = {
  green: 'bg-green-soft text-brand-green',
  orange: 'bg-orange-50 text-orange-ink',
  blue: 'bg-blue-soft text-trust-blue',
}

export function StatCard({ label, value, note, icon: Icon, tone = 'green' }: StatCardProps) {
  return (
    <article className="flex min-w-0 items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <p className="mt-1 truncate text-2xl font-extrabold tabular-nums text-ink sm:text-3xl">{value}</p>
        <p className="mt-1 text-xs text-muted">{note}</p>
      </div>
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon size={20} aria-hidden="true" /></span>
    </article>
  )
}
