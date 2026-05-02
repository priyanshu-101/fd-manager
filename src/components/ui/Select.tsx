import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-400 uppercase tracking-wider">{label}</label>
      <select
        ref={ref}
        className={`w-full bg-ink-900 border border-ink-600/60 rounded-xl px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-gold-500/70 focus:bg-ink-800 transition-all appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
);
Select.displayName = 'Select';
