import { InputHTMLAttributes } from 'react'

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function TextInput({ label, error, className = '', ...props }: TextInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="pixel-label">{label}</label>
      )}
      <input
        type="text"
        className={`pixel-input ${error ? 'border-pixel-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="pixel-error">{error}</p>
      )}
    </div>
  )
} 