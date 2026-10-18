import { CheckCircle2, CircleDashed, ListTodo } from 'lucide-react'
import type { TaskStats } from '../../types/task.ts'

interface SummaryCardsProps {
  stats: TaskStats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total tasks',
      value: stats.total,
      hint: 'Everything on your list',
      icon: ListTodo,
    },
    {
      label: 'Completed',
      value: stats.completed,
      hint: 'Finished and still available',
      icon: CheckCircle2,
    },
    {
      label: 'Remaining',
      value: stats.remaining,
      hint: 'Still waiting on you',
      icon: CircleDashed,
    },
  ] as const

  return (
    <section aria-label="Task summary" className="mb-5 grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[14px] border border-line bg-surface p-4 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-muted">{card.label}</p>
            <card.icon size={18} className="text-accent" aria-hidden="true" />
          </div>
          <p className="font-editorial mt-3 text-3xl font-medium tracking-tight text-ink">
            {card.value}
          </p>
          <p className="mt-1 text-sm text-muted">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
