import { useMemo, useState } from 'react'
import { Greeting } from './components/dashboard/Greeting.tsx'
import { ProgressPanel } from './components/dashboard/ProgressPanel.tsx'
import { SummaryCards } from './components/dashboard/SummaryCards.tsx'
import { AppHeader } from './components/layout/AppHeader.tsx'
import { QuickNotes } from './components/notes/QuickNotes.tsx'
import { TaskFilters } from './components/tasks/TaskFilters.tsx'
import { TaskFormDialog } from './components/tasks/TaskFormDialog.tsx'
import { TaskList } from './components/tasks/TaskList.tsx'
import { ConfirmDialog } from './components/ui/Dialog.tsx'
import { Toast } from './components/ui/Toast.tsx'
import { useNotes } from './hooks/useNotes.ts'
import { useTasks } from './hooks/useTasks.ts'
import { useToast } from './hooks/useToast.ts'
import { todayKey } from './lib/dates.ts'
import { emptyFilterMessage, getTaskStats, getTodayFocus, getVisibleTasks } from './lib/tasks.ts'
import type { AppView, Task, TaskDraft, TaskFilter } from './types/task.ts'

export default function App() {
  const { tasks, storageWarning, addTask, updateTask, toggleTask, deleteTask } = useTasks()
  const notes = useNotes()
  const { toast, show, dismiss } = useToast()
  const [view, setView] = useState<AppView>('today')
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null)

  const today = todayKey()
  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const focusTasks = useMemo(() => getTodayFocus(tasks, today), [tasks, today])
  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks, filter, query),
    [tasks, filter, query],
  )

  function handleViewChange(next: AppView) {
    setView(next)
    if (next === 'all') {
      window.requestAnimationFrame(() => {
        document.getElementById('all-tasks-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openCreate() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function handleSubmit(draft: TaskDraft) {
    if (editingTask) {
      const result = updateTask(editingTask.id, draft)
      if (!result.ok) {
        return { ok: false, error: result.error }
      }
      show('Task updated.')
      return { ok: true }
    }

    const result = addTask(draft)
    if (!result.ok) {
      return { ok: false, error: result.error }
    }
    show('Task added.')
    return { ok: true }
  }

  function handleToggle(id: string) {
    const task = tasks.find((item) => item.id === id)
    const saved = toggleTask(id)
    if (!task) {
      return
    }
    show(task.completed ? 'Task marked active.' : 'Task completed.')
    if (!saved) {
      show('Updated here, but it could not be saved to this device.', 'error')
    }
  }

  function confirmDelete() {
    if (!pendingDelete) {
      return
    }
    const saved = deleteTask(pendingDelete.id)
    setPendingDelete(null)
    show(saved ? 'Task deleted.' : 'Task removed here, but it could not be saved to this device.', saved ? 'success' : 'error')
  }

  const hasQuery = query.trim().length > 0
  const combinedWarning = storageWarning ?? (notes.status === 'error' ? notes.error : null)

  return (
    <div className="min-h-svh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <AppHeader view={view} onViewChange={handleViewChange} onNewTask={openCreate} />

      {combinedWarning ? (
        <div className="border-b border-warning/20 bg-warning-soft px-4 py-2 text-center text-sm text-warning" role="status">
          {combinedWarning}
        </div>
      ) : null}

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Greeting />
        <SummaryCards stats={stats} />
        <ProgressPanel stats={stats} />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-8">
            {view === 'today' ? (
              <section aria-labelledby="today-focus-heading" className="scroll-mt-24">
                <div className="mb-4">
                  <h2 id="today-focus-heading" className="font-editorial text-xl font-medium text-ink">
                    Today’s Focus
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Overdue and due-today tasks, sorted by priority.
                  </p>
                </div>
                <TaskList
                  tasks={focusTasks}
                  today={today}
                  emptyTitle={tasks.length === 0 ? 'Nothing on the list yet' : 'A clear day'}
                  emptyMessage={
                    tasks.length === 0
                      ? 'Add a task with today’s date or an earlier due date to fill this list.'
                      : 'No overdue or due-today work. Enjoy the space, or queue something for later.'
                  }
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={setPendingDelete}
                  onCreate={tasks.length === 0 ? openCreate : undefined}
                />
              </section>
            ) : null}

            <section aria-labelledby="all-tasks-heading" className="scroll-mt-24">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="all-tasks-heading" className="font-editorial text-xl font-medium text-ink">
                    All Tasks
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Active tasks are ordered by priority, then by the soonest due date. Completed tasks stay available in the Completed filter.
                  </p>
                </div>
              </div>
              <TaskFilters
                filter={filter}
                query={query}
                onFilterChange={setFilter}
                onQueryChange={setQuery}
              />
              <TaskList
                tasks={visibleTasks}
                today={today}
                emptyTitle={tasks.length === 0 ? 'Start with one task' : 'Nothing in this view'}
                emptyMessage={emptyFilterMessage(filter, hasQuery)}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={setPendingDelete}
                onCreate={tasks.length === 0 ? openCreate : undefined}
              />
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <QuickNotes
              content={notes.content}
              status={notes.status}
              error={notes.error}
              onChange={notes.setContent}
            />
          </aside>
        </div>
      </main>

      <TaskFormDialog
        open={formOpen}
        task={editingTask}
        onClose={() => {
          setFormOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this task?"
        description={
          pendingDelete
            ? `“${pendingDelete.title}” will be removed from this device. This cannot be undone.`
            : 'This task will be removed from this device.'
        }
        confirmLabel="Delete task"
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  )
}
