interface ProgressBarProps {
  value: number;
  level?: 'safe' | 'warning' | 'critical' | 'matured';
  className?: string;
}

const colors = {
  safe: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-crimson-500',
  matured: 'bg-ink-400',
};

export function ProgressBar({ value, level = 'safe', className = '' }: ProgressBarProps) {
  return (
    <div className={`h-1 bg-ink-700 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${colors[level]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
