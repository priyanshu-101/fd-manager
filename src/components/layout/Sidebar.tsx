import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Shield, TrendingUp, Bell } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/fd', icon: Building2, label: 'Fixed Deposits' },
  { to: '/insurance', icon: Shield, label: 'Insurance' },
];

export function Sidebar() {
  const alerts = useAlerts();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-ink-900 border-r border-ink-700/50 flex flex-col z-30">
      <div className="px-6 py-7 border-b border-ink-700/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold-shimmer bg-gold-500 flex items-center justify-center shadow-glow-gold">
            <TrendingUp size={18} className="text-ink-950" />
          </div>
          <div>
            <h1 className="font-display text-lg text-ink-50 leading-none">Vaultwise</h1>
            <p className="text-ink-500 text-xs mt-0.5">Portfolio Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-gold-600/15 text-gold-400 border border-gold-600/20'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-ink-700/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-gold-400' : 'text-ink-500 group-hover:text-ink-300'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {alerts.length > 0 && (
        <div className="mx-3 mb-4 p-3.5 bg-amber-700/10 border border-amber-700/25 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Bell size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Alerts</span>
          </div>
          <p className="text-xs text-ink-400">{alerts.length} item{alerts.length !== 1 ? 's' : ''} need attention</p>
        </div>
      )}

      <div className="px-6 py-5 border-t border-ink-700/40">
        <p className="text-ink-600 text-xs">© 2024 Vaultwise</p>
      </div>
    </aside>
  );
}
