import { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className={`pixel-checkbox ${className}`}
        {...props}
      />
      <span className="pixel-label mb-0 group-hover:text-pixel-accent transition-colors">
        {label}
      </span>
    </label>
  )
} 