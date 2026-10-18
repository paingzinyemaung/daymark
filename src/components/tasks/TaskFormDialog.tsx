import { useState, type FormEvent } from 'react'
import { todayKey } from '../../lib/dates.ts'
import type { Priority, Task, TaskDraft } from '../../types/task.ts'
import { Button } from '../ui/Button.tsx'
import { Dialog } from '../ui/Dialog.tsx'
import { SelectField, TextAreaField, TextField } from '../ui/Field.tsx'

interface TaskFormDialogProps {
  open: boolean
  task: Task | null
  onClose: () => void
  onSubmit: (draft: TaskDraft) => { ok: boolean; error?: string }
}

function emptyDraft(): TaskDraft {
  return {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: todayKey(),
  }
}

function fromTask(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
  }
}

export function TaskFormDialog({ open, task, onClose, onSubmit }: TaskFormDialogProps) {
  if (!open) {
    return null
  }

  return (
    <TaskFormBody
      key={task?.id ?? 'new-task'}
      task={task}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

interface TaskFormBodyProps {
  task: Task | null
  onClose: () => void
  onSubmit: (draft: TaskDraft) => { ok: boolean; error?: string }
}

function TaskFormBody({ task, onClose, onSubmit }: TaskFormBodyProps) {
  const [draft, setDraft] = useState<TaskDraft>(task ? fromTask(task) : emptyDraft)
  const [titleError, setTitleError] = useState('')
  const isEditing = Boolean(task)

  function handleClose() {
    setTitleError('')
    onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.title.trim()) {
      setTitleError('Enter a task title before saving.')
      return
    }

    const result = onSubmit(draft)
    if (!result.ok) {
      setTitleError(result.error ?? 'This task could not be saved.')
      return
    }

    handleClose()
  }

  return (
    <Dialog
      open
      title={isEditing ? 'Edit task' : 'New task'}
      description={
        isEditing
          ? 'Update the details, then save. Cancel discards unsaved changes.'
          : 'Give the task a title. Description, priority, and due date help you stay organized.'
      }
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="task-title"
          name="title"
          label="Title"
          value={draft.title}
          onChange={(event) => {
            setDraft((current) => ({ ...current, title: event.target.value }))
            if (titleError) {
              setTitleError('')
            }
          }}
          error={titleError}
          required
          autoComplete="off"
          placeholder="Write the next meaningful step"
        />
        <TextAreaField
          id="task-description"
          name="description"
          label="Description (optional)"
          value={draft.description}
          onChange={(event) =>
            setDraft((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Add context if you need it"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="task-priority"
            name="priority"
            label="Priority"
            value={draft.priority}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                priority: event.target.value as Priority,
              }))
            }
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </SelectField>
          <TextField
            id="task-due-date"
            name="dueDate"
            label="Due date"
            type="date"
            value={draft.dueDate}
            onChange={(event) =>
              setDraft((current) => ({ ...current, dueDate: event.target.value }))
            }
            required
          />
        </div>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? 'Save changes' : 'Add task'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
