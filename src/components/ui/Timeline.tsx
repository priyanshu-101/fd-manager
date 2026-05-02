import { ArrowDown } from 'lucide-react';
import { formatDate, formatINR } from '@/utils';

interface TimelineItem {
  id: string;
  label: string;
  sub: string;
  date: string;
  amount: number;
  current?: boolean;
  details?: { label: string; value: string }[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  if (items.length <= 1) return null;

  return (
    <div className="mt-6 border-t border-ink-700/40 pt-5">
      <h4 className="text-xs uppercase tracking-wider text-ink-500 font-semibold mb-4">Renewal History</h4>
      <div className="space-y-0 relative">
        {items.map((item, idx) => (
          <div key={item.id} className="relative pl-8 pb-6 last:pb-0 group">
            {/* Vertical Line */}
            {idx !== items.length - 1 && (
              <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-ink-700 group-hover:bg-ink-600 transition-colors" />
            )}
            
            {/* Dot */}
            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
              item.current 
                ? 'bg-gold-500/20 border-gold-500 text-gold-400' 
                : 'bg-ink-800 border-ink-600 text-ink-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${item.current ? 'bg-gold-400' : 'bg-ink-500'}`} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${item.current ? 'text-ink-50' : 'text-ink-300'}`}>
                    {item.label}
                  </p>
                  {item.current && (
                    <span className="text-[10px] bg-gold-600/20 text-gold-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Current</span>
                  )}
                </div>
                <p className="text-xs text-ink-500">{item.sub} · {formatDate(item.date)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className={`font-mono text-sm ${item.current ? 'text-emerald-400' : 'text-ink-400'}`}>
                  {formatINR(item.amount)}
                </p>
              </div>
            </div>

            {item.details && (
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-ink-900/30 rounded-lg p-2 border border-ink-700/20">
                {item.details.map((detail, dIdx) => (
                  <div key={dIdx}>
                    <p className="text-[10px] uppercase tracking-tighter text-ink-600">{detail.label}</p>
                    <p className="text-xs text-ink-300 font-mono">{detail.value}</p>
                  </div>
                ))}
              </div>
            )}
            
            {idx !== items.length - 1 && (
              <div className="absolute left-2.5 bottom-[-14px] z-20 text-ink-600">
                <ArrowDown size={10} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
