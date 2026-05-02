import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-ink-400 uppercase tracking-wider">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-ink-900 border ${error ? 'border-crimson-600' : 'border-ink-600/60'} rounded-xl px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 focus:outline-none focus:border-gold-500/70 focus:bg-ink-800 transition-all ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-crimson-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
