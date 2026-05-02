import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store';
import { daysLeft, getAlertLevel, calcMaturityAmount, formatINR, formatDate } from '@/utils';
import { Badge } from '@/components/ui/Badge';

export function UpcomingList() {
  const { fds, insurances } = useStore();

  const items = [
    ...fds.map((f) => ({
      id: f.id,
      name: f.bank + ' FD',
      sub: f.holder,
      date: f.maturityDate,
      days: daysLeft(f.maturityDate),
      amount: calcMaturityAmount(f),
      type: 'FD' as const,
    })),
    ...insurances.map((i) => ({
      id: i.id,
      name: i.name,
      sub: i.company,
      date: i.maturityDate,
      days: daysLeft(i.maturityDate),
      amount: i.sumAssured,
      type: 'Insurance' as const,
    })),
  ]
    .filter((x) => x.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <div className="bg-ink-800/70 border border-ink-600/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg text-ink-100">Upcoming Maturities</h3>
          <p className="text-ink-500 text-xs mt-0.5">Sorted by earliest maturity date</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="text-ink-500 text-sm text-center py-8">No upcoming maturities. Add your FDs and policies to get started.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-ink-700/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`text-xs font-mono px-2 py-1 rounded-lg ${item.type === 'FD' ? 'bg-gold-600/15 text-gold-400' : 'bg-sky-700/15 text-sky-400'}`}>
                  {item.type}
                </div>
                <div>
                  <p className="text-ink-100 text-sm font-medium">{item.name}</p>
                  <p className="text-ink-500 text-xs">{item.sub} · {formatDate(item.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-mono text-sm text-ink-200">{formatINR(item.amount)}</p>
                </div>
                <Badge level={getAlertLevel(item.days)} days={item.days} />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-3">
        <Link to="/fd" className="flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-300 transition-colors">View FDs <ArrowRight size={12} /></Link>
        <Link to="/insurance" className="flex items-center gap-1.5 text-xs text-sky-500 hover:text-sky-300 transition-colors">View Insurance <ArrowRight size={12} /></Link>
      </div>
    </div>
  );
}
