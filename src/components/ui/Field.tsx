import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface LabelProps {
  htmlFor: string
  children: ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
    </label>
  )
}

const controlClass =
  'w-full rounded-[10px] border border-line bg-surface px-3 py-2.5 text-base text-ink placeholder:text-muted/80 transition-colors duration-150 focus:border-accent'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function TextField({ label, id, error, className = '', ...props }: TextFieldProps) {
  const fieldId = id ?? props.name
  const errorId = error && fieldId ? `${fieldId}-error` : undefined

  return (
    <div>
      <Label htmlFor={fieldId ?? ''}>{label}</Label>
      <input
        id={fieldId}
        className={`${controlClass} ${error ? 'border-danger' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextAreaField({ label, id, className = '', ...props }: TextAreaFieldProps) {
  const fieldId = id ?? props.name

  return (
    <div>
      <Label htmlFor={fieldId ?? ''}>{label}</Label>
      <textarea
        id={fieldId}
        className={`${controlClass} min-h-24 resize-y ${className}`}
        {...props}
      />
    </div>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  children: ReactNode
}

export function SelectField({ label, id, children, className = '', ...props }: SelectFieldProps) {
  const fieldId = id ?? props.name

  return (
    <div>
      <Label htmlFor={fieldId ?? ''}>{label}</Label>
      <select id={fieldId} className={`${controlClass} ${className}`} {...props}>
        {children}
      </select>
    </div>
  )
}
