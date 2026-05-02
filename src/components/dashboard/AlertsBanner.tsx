import { AlertTriangle, Clock, Bell } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';

export function AlertsBanner() {
  const alerts = useAlerts();
  if (!alerts.length) return null;

  const critical = alerts.filter((a) => a.level === 'critical');
  const warning = alerts.filter((a) => a.level === 'warning');

  return (
    <div className="mb-8 space-y-3 animate-fade-up">
      {critical.length > 0 && (
        <div className="flex items-start gap-3 bg-crimson-700/10 border border-crimson-700/25 rounded-2xl px-5 py-4">
          <AlertTriangle size={18} className="text-crimson-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-crimson-300 font-semibold text-sm">Critical — Action Required</p>
            <p className="text-crimson-400/80 text-xs mt-0.5">
              {critical.map((a) => `${a.name} matures in ${a.daysLeft} days`).join(' · ')}
            </p>
          </div>
        </div>
      )}
      {warning.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-700/10 border border-amber-700/25 rounded-2xl px-5 py-4">
          <Clock size={18} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-300 font-semibold text-sm">Upcoming Maturities</p>
            <p className="text-amber-400/80 text-xs mt-0.5">
              {warning.map((a) => `${a.name} in ${a.daysLeft} days`).join(' · ')}
            </p>
          </div>
        </div>
      )}
      {!critical.length && !warning.length && alerts.length > 0 && (
        <div className="flex items-center gap-3 bg-sky-700/10 border border-sky-700/20 rounded-2xl px-5 py-3">
          <Bell size={16} className="text-sky-400" />
          <p className="text-sky-300 text-sm">{alerts.length} premium payment{alerts.length > 1 ? 's' : ''} due soon</p>
        </div>
      )}
    </div>
  );
}
