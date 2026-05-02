import { AlertLevel } from '@/types';

interface BadgeProps {
  level: AlertLevel;
  days: number;
  className?: string;
}

const config: Record<AlertLevel, { label: string; classes: string }> = {
  critical: {
    label: 'Critical',
    classes: 'bg-crimson-700/20 text-crimson-500 border border-crimson-700/30',
  },
  warning: {
    label: 'Due Soon',
    classes: 'bg-amber-700/20 text-amber-500 border border-amber-700/30',
  },
  safe: {
    label: 'Active',
    classes: 'bg-emerald-700/20 text-emerald-400 border border-emerald-700/30',
  },
  matured: {
    label: 'Matured',
    classes: 'bg-ink-600/40 text-ink-300 border border-ink-500/30',
  },
};

export function Badge({ level, days, className = '' }: BadgeProps) {
  const { classes } = config[level];
  const label =
    level === 'matured'
      ? 'Matured'
      : level === 'safe'
      ? 'Active'
      : `${days}d left`;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${classes} ${className}`}>
      {label !== 'Active' && level !== 'matured' && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${level === 'critical' ? 'bg-crimson-500 animate-pulse' : 'bg-amber-500'}`} />
      )}
      {label}
    </span>
  );
}
