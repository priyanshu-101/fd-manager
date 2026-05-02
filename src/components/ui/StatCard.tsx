import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  accent?: 'gold' | 'emerald' | 'sky' | 'crimson';
  delay?: number;
}

const accents = {
  gold: 'text-gold-400 bg-gold-600/10 border-gold-600/20',
  emerald: 'text-emerald-400 bg-emerald-700/10 border-emerald-700/20',
  sky: 'text-sky-500 bg-sky-700/10 border-sky-700/20',
  crimson: 'text-crimson-500 bg-crimson-700/10 border-crimson-700/20',
};

export function StatCard({ label, value, sub, icon, accent = 'gold', delay = 0 }: StatCardProps) {
  return (
    <div
      className="relative bg-card-surface bg-ink-800/80 border border-ink-600/30 rounded-2xl p-6 overflow-hidden group hover:border-ink-500/50 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${accents[accent]}`}>
          {icon}
        </div>
      </div>
      <p className="text-ink-400 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display text-2xl font-semibold text-ink-50 leading-tight">{value}</p>
      {sub && <p className="text-ink-500 text-xs mt-1.5">{sub}</p>}
    </div>
  );
}
