import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: 'bg-gold-shimmer bg-gold-500 text-ink-950 font-semibold hover:opacity-90 shadow-glow-gold',
  secondary: 'bg-ink-700 text-ink-100 border border-ink-600/60 hover:bg-ink-600 hover:border-ink-500',
  ghost: 'text-ink-300 hover:text-ink-100 hover:bg-ink-700/60',
  danger: 'bg-crimson-700/20 text-crimson-400 border border-crimson-700/40 hover:bg-crimson-700/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

export function Button({ variant = 'secondary', size = 'md', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 font-body font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
