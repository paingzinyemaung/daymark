import { Search } from 'lucide-react'
import type { TaskFilter } from '../../types/task.ts'

interface TaskFiltersProps {
  filter: TaskFilter
  query: string
  onFilterChange: (filter: TaskFilter) => void
  onQueryChange: (query: string) => void
}

const FILTERS: { id: TaskFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export function TaskFilters({ filter, query, onFilterChange, onQueryChange }: TaskFiltersProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label="Filter tasks" className="flex rounded-[10px] border border-line bg-surface p-1">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onFilterChange(item.id)}
            aria-pressed={filter === item.id}
            className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium sm:flex-none ${
              filter === item.id ? 'bg-accent-soft text-accent-strong' : 'text-muted hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative min-w-0 sm:w-72">
        <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          id="task-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by title"
          aria-label="Search tasks by title"
          className="min-h-11 w-full rounded-[10px] border border-line bg-surface py-2 pr-3 pl-9 text-base text-ink placeholder:text-muted/80"
        />
      </div>
    </div>
  )
}
