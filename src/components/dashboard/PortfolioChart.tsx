import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useStore } from '@/store';
import { formatINR, calcMaturityAmount } from '@/utils';

const COLORS = ['#D4A017', '#0EA5E9', '#34D399', '#E8B84B'];

export function PortfolioChart() {
  const { fds, insurances } = useStore();

  const totalFD = fds.reduce((s, f) => s + f.amount, 0);
  const totalCover = insurances.reduce((s, i) => s + i.sumAssured, 0);
  const totalMaturity = fds.reduce((s, f) => s + calcMaturityAmount(f), 0);
  const totalPremium = insurances.reduce((s, i) => s + i.annualPremium, 0);

  const data = [
    { name: 'FD Principal', value: totalFD },
    { name: 'Insurance Cover', value: totalCover },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <div className="bg-ink-800/70 border border-ink-600/30 rounded-2xl p-6 flex items-center justify-center h-64">
        <p className="text-ink-500 text-sm">Add assets to see portfolio breakdown</p>
      </div>
    );
  }

  return (
    <div className="bg-ink-800/70 border border-ink-600/30 rounded-2xl p-6">
      <h3 className="font-display text-lg text-ink-100 mb-1">Portfolio Overview</h3>
      <p className="text-ink-500 text-xs mb-5">Asset allocation at a glance</p>
      <div className="flex items-center gap-6">
        <div className="h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => formatINR(v)}
                contentStyle={{ background: '#1E1E2E', border: '1px solid #3D3D5C', borderRadius: 12, fontSize: 12 }}
                itemStyle={{ color: '#C2C2D6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-ink-400 text-sm">{d.name}</span>
              </div>
              <span className="font-mono text-ink-200 text-sm">{formatINR(d.value)}</span>
            </div>
          ))}
          <div className="border-t border-ink-700/40 pt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-ink-500">Expected FD returns</span>
              <span className="font-mono text-emerald-400">{formatINR(totalMaturity)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-ink-500">Annual premiums</span>
              <span className="font-mono text-sky-400">{formatINR(totalPremium)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
