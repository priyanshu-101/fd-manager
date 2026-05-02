import { Building2, Shield, TrendingUp, Wallet } from 'lucide-react';
import { useStore } from '@/store';
import { calcMaturityAmount, formatINR } from '@/utils';
import { StatCard } from '@/components/ui/StatCard';
import { AlertsBanner } from '@/components/dashboard/AlertsBanner';
import { PortfolioChart } from '@/components/dashboard/PortfolioChart';
import { UpcomingList } from '@/components/dashboard/UpcomingList';

export function DashboardPage() {
  const { fds, insurances } = useStore();

  const totalFD = fds.reduce((s, f) => s + f.amount, 0);
  const totalMaturity = fds.reduce((s, f) => s + calcMaturityAmount(f), 0);
  const totalCover = insurances.reduce((s, i) => s + i.sumAssured, 0);
  const totalPremium = insurances.reduce((s, i) => s + i.annualPremium, 0);

  return (
    <div>
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-3xl text-ink-50">Portfolio Overview</h1>
        <p className="text-ink-400 mt-1 text-sm">Track your fixed deposits and insurance policies in one place.</p>
      </div>

      <AlertsBanner />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total FD Investment" value={formatINR(totalFD)} sub={`${fds.length} active FD${fds.length !== 1 ? 's' : ''}`} icon={<Building2 size={18} />} accent="gold" delay={0} />
        <StatCard label="Expected Returns" value={formatINR(totalMaturity)} sub="On full maturity" icon={<TrendingUp size={18} />} accent="emerald" delay={60} />
        <StatCard label="Insurance Cover" value={formatINR(totalCover)} sub={`${insurances.length} polic${insurances.length !== 1 ? 'ies' : 'y'}`} icon={<Shield size={18} />} accent="sky" delay={120} />
        <StatCard label="Annual Premiums" value={formatINR(totalPremium)} sub="Total yearly outflow" icon={<Wallet size={18} />} accent="crimson" delay={180} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PortfolioChart />
        <UpcomingList />
      </div>
    </div>
  );
}
