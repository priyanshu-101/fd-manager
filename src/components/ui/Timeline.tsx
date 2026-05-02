import { ArrowDown, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { formatDate, formatINR } from '@/utils';

interface TimelineItem {
  id: string;
  label: string;
  sub?: string;
  date: string;
  amount: number;
  rate?: number;
  type?: string;
  current?: boolean;
  details?: { label: string; value: string }[];
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  if (items.length <= 1) return null;

  return (
    <div className="mt-8 border-t border-ink-700/40 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 bg-gold-500/10 rounded-md">
          <TrendingUp size={14} className="text-gold-400" />
        </div>
        <h4 className="text-xs uppercase tracking-widest text-ink-400 font-bold">Investment Timeline</h4>
      </div>
      
      <div className="space-y-0 relative">
        {items.map((item, idx) => (
          <div key={item.id} className="relative pl-10 pb-8 last:pb-2 group">
            {/* Vertical Line */}
            {idx !== items.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-ink-600/50 to-ink-700/20 group-hover:from-gold-500/30 transition-all duration-500" />
            )}
            
            {/* Connection Node */}
            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300 ${
              item.current 
                ? 'bg-gold-500 border-gold-400 shadow-glow-gold scale-110' 
                : 'bg-ink-800 border-ink-600 group-hover:border-ink-500'
            }`}>
              {item.current ? (
                <Wallet size={10} className="text-ink-950" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-ink-500 group-hover:bg-ink-300" />
              )}
            </div>

            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              item.current 
                ? 'bg-gold-500/5 border-gold-500/20 shadow-glass' 
                : 'bg-ink-800/40 border-ink-700/50 hover:border-ink-600/60'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold tracking-tight ${item.current ? 'text-gold-200' : 'text-ink-100'}`}>
                      {item.label}
                    </p>
                    {item.current && (
                      <span className="text-[9px] bg-gold-500 text-ink-950 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">Active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(item.date)}</span>
                    {item.sub && <span>• {item.sub}</span>}
                  </div>
                </div>
                
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <p className={`font-mono text-sm font-bold ${item.current ? 'text-emerald-400' : 'text-ink-300'}`}>
                    {formatINR(item.amount)}
                  </p>
                  {item.rate && (
                    <span className="text-[10px] text-gold-500/80 font-mono bg-gold-500/5 px-2 py-0.5 rounded-lg border border-gold-500/10">
                      {item.rate}% p.a.
                    </span>
                  )}
                </div>
              </div>

              {(item.details || item.type) && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-ink-700/30">
                  {item.type && (
                    <div>
                      <p className="text-[10px] uppercase tracking-tighter text-ink-500 mb-0.5">Type</p>
                      <p className="text-xs text-ink-200">{item.type}</p>
                    </div>
                  )}
                  {item.details?.map((detail, dIdx) => (
                    <div key={dIdx}>
                      <p className="text-[10px] uppercase tracking-tighter text-ink-500 mb-0.5">{detail.label}</p>
                      <p className="text-xs text-ink-200 font-mono">{detail.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {idx !== items.length - 1 && (
              <div className="absolute left-[8px] bottom-[-16px] z-20 text-ink-600/50">
                <ArrowDown size={8} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
