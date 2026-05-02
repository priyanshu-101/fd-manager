import { useState } from 'react';
import { Shield, Pencil, Trash2, ChevronDown, ChevronUp, Calendar, RotateCw } from 'lucide-react';
import { Insurance } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Timeline } from '@/components/ui/Timeline';
import { InsuranceForm } from './InsuranceForm';
import { daysLeft, getAlertLevel, formatINR, formatDate, tenureProgress } from '@/utils';
import { useStore } from '@/store';

const typeColors: Record<string, string> = {
  Life: 'text-sky-500 bg-sky-700/10 border-sky-700/20',
  Health: 'text-emerald-400 bg-emerald-700/10 border-emerald-700/20',
  Term: 'text-gold-400 bg-gold-600/10 border-gold-600/20',
  ULIP: 'text-ink-300 bg-ink-600/20 border-ink-500/20',
  Vehicle: 'text-amber-500 bg-amber-700/10 border-amber-700/20',
  Other: 'text-ink-300 bg-ink-600/20 border-ink-500/20',
};

export function InsuranceCard({ ins }: { ins: Insurance }) {
  const { deleteInsurance } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const days = daysLeft(ins.maturityDate);
  const level = getAlertLevel(days);
  const progress = tenureProgress(ins.startDate, ins.maturityDate);
  const premiumDays = ins.premiumDueDate ? daysLeft(ins.premiumDueDate) : null;

  // Build renewal history
  const getHistory = () => {
    return [
      {
      id: ins.id,
      label: ins.name,
      sub: ins.company,
      date: ins.maturityDate,
      amount: ins.sumAssured,
      current: true,
      details: [
        { label: 'Premium', value: formatINR(ins.annualPremium) },
        { label: 'Type', value: ins.policyType },
        { label: 'Start', value: formatDate(ins.startDate) },
        { label: 'Nominee', value: ins.nominee || '—' },
      ]
      },
    ];
  };

  const history = getHistory();

  return (
    <>
      <div className="bg-ink-800/70 border border-ink-600/30 rounded-2xl overflow-hidden hover:border-ink-500/50 transition-all duration-300 animate-fade-up group">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-sky-700/10 border border-sky-700/20 rounded-xl mt-0.5">
                <Shield size={18} className="text-sky-500" />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink-50">{ins.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-ink-400 text-sm">{ins.company}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeColors[ins.policyType] ?? typeColors.Other}`}>{ins.policyType}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge level={level} days={days} />
              <button onClick={() => setExpanded((e) => !e)} className="p-1.5 text-ink-500 hover:text-ink-200 transition-colors">
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Sum Assured</p>
              <p className="font-mono text-ink-100 font-medium">{formatINR(ins.sumAssured)}</p>
            </div>
            <div>
              <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Annual Premium</p>
              <p className="font-mono text-sky-400 font-medium">{formatINR(ins.annualPremium)}</p>
            </div>
            <div>
              <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Next Premium</p>
              {premiumDays !== null ? (
                <p className={`font-mono font-medium text-sm ${premiumDays <= 30 ? 'text-crimson-400' : premiumDays <= 90 ? 'text-amber-400' : 'text-ink-300'}`}>
                  {premiumDays < 0 ? 'Overdue' : `${premiumDays}d`}
                </p>
              ) : (
                <p className="text-ink-600 text-sm">—</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-ink-500 mb-1.5 gap-1">
              <span>{formatDate(ins.startDate)}</span>
              <span className={days < 0 ? 'text-ink-400' : days <= 30 ? 'text-crimson-500' : 'text-ink-400'}>
                {days < 0 ? 'Matured' : `${days} days left`}
              </span>
              <span>{formatDate(ins.maturityDate)}</span>
            </div>
            <ProgressBar value={progress} level={level} />
          </div>

          {premiumDays !== null && premiumDays >= 0 && premiumDays <= 30 && (
            <div className="mt-3 flex items-center gap-2 bg-crimson-700/10 border border-crimson-700/20 rounded-xl px-3 py-2">
              <Calendar size={13} className="text-crimson-400" />
              <p className="text-xs text-crimson-300">Premium due in <strong>{premiumDays}</strong> days — {ins.premiumDueDate ? formatDate(ins.premiumDueDate) : ''}</p>
            </div>
          )}
        </div>

        {expanded && (
          <div className="px-6 pb-5 border-t border-ink-700/40 pt-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
              <div className="flex justify-between"><span className="text-ink-500">Policy No.</span><span className="text-ink-200 font-mono">{ins.policyNumber || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Nominee</span><span className="text-ink-200">{ins.nominee || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Tenure progress</span><span className="text-ink-200 font-mono">{progress}%</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Premium due</span><span className="text-ink-200">{ins.premiumDueDate ? formatDate(ins.premiumDueDate) : '—'}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setRenewing(true)}><RotateCw size={13} />Renew</Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil size={13} />Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}><Trash2 size={13} />Delete</Button>
            </div>

            <Timeline items={history} />
          </div>
        )}
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Insurance Policy">
        <InsuranceForm initial={ins} onClose={() => setEditing(false)} />
      </Modal>

      <Modal open={renewing} onClose={() => setRenewing(false)} title="Renew Insurance Policy">
        <InsuranceForm initial={ins} isRenewal onClose={() => setRenewing(false)} />
      </Modal>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Insurance Policy">
        <div className="space-y-4">
          <p className="text-ink-200">Are you sure you want to delete <span className="text-sky-400 font-medium">{ins.name}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>Cancel</Button>
            <Button
              variant="danger"
              disabled={isDeleting}
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  await deleteInsurance(ins.id);
                  setConfirmDelete(false);
                } catch (err) {
                  window.alert(err instanceof Error ? err.message : 'Delete failed');
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting && <Spinner />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
