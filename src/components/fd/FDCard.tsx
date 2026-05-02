import { useState } from 'react';
import { Building2, Pencil, Trash2, ChevronDown, ChevronUp, RotateCw } from 'lucide-react';
import { FD } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Timeline } from '@/components/ui/Timeline';
import { FDForm } from './FDForm';
import { daysLeft, getAlertLevel, calcMaturityAmount, formatINR, formatDate, tenureProgress } from '@/utils';
import { useStore } from '@/store';

export function FDCard({ fd }: { fd: FD }) {
  const { fds, deleteFD } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const days = daysLeft(fd.maturityDate);
  const level = getAlertLevel(days);
  const matAmt = calcMaturityAmount(fd);
  const gain = matAmt - fd.amount;
  const progress = tenureProgress(fd.startDate, fd.maturityDate);

  // Build renewal history
  const getHistory = () => {
    const history: any[] = [];
    
    // Find all ancestors
    let current = fd;
    while (current.parentId) {
      const parent = fds.find(f => f.id === current.parentId);
      if (parent) {
        history.unshift({
          id: parent.id,
          label: parent.bank,
          sub: parent.holder,
          date: parent.maturityDate,
          amount: calcMaturityAmount(parent),
          details: [
            { label: 'Principal', value: formatINR(parent.amount) },
            { label: 'Rate', value: `${parent.rate}%` },
            { label: 'Start', value: formatDate(parent.startDate) },
            { label: 'Type', value: parent.fdType },
          ]
        });
        current = parent;
      } else break;
    }

    // Add current
    history.push({
      id: fd.id,
      label: fd.bank,
      sub: fd.holder,
      date: fd.maturityDate,
      amount: matAmt,
      current: true,
      details: [
        { label: 'Principal', value: formatINR(fd.amount) },
        { label: 'Rate', value: `${fd.rate}%` },
        { label: 'Start', value: formatDate(fd.startDate) },
        { label: 'Type', value: fd.fdType },
      ]
    });

    // Find all descendants (future renewals)
    current = fd;
    let child = fds.find(f => f.parentId === current.id);
    while (child) {
      history.push({
        id: child.id,
        label: child.bank,
        sub: child.holder,
        date: child.maturityDate,
        amount: calcMaturityAmount(child),
        details: [
          { label: 'Principal', value: formatINR(child.amount) },
          { label: 'Rate', value: `${child.rate}%` },
          { label: 'Start', value: formatDate(child.startDate) },
          { label: 'Type', value: child.fdType },
        ]
      });
      current = child;
      child = fds.find(f => f.parentId === current.id);
    }

    return history;
  };

  const history = getHistory();

  return (
    <>
      <div className="bg-ink-800/70 border border-ink-600/30 rounded-2xl overflow-hidden hover:border-ink-500/50 transition-all duration-300 animate-fade-up group">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gold-600/10 border border-gold-600/20 rounded-xl mt-0.5">
                <Building2 size={18} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink-50">{fd.bank}</h3>
                <p className="text-ink-400 text-sm">
                  {fd.holder || 'No holder'}
                  {fd.fdNumber && <span className="text-ink-600"> · #{fd.fdNumber}</span>}
                </p>
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
              <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Principal</p>
              <p className="font-mono text-ink-100 font-medium">{formatINR(fd.amount)}</p>
            </div>
            <div>
              <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Maturity Value</p>
              <p className="font-mono text-emerald-400 font-medium">{formatINR(matAmt)}</p>
            </div>
            <div>
              <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Interest Gain</p>
              <p className="font-mono text-gold-400 font-medium">+{formatINR(gain)}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-ink-500 mb-1.5 gap-1">
              <span>{formatDate(fd.startDate)}</span>
              <span className={days < 0 ? 'text-ink-400' : days <= 30 ? 'text-crimson-500' : 'text-ink-400'}>
                {days < 0 ? 'Matured' : `${days} days left`}
              </span>
              <span>{formatDate(fd.maturityDate)}</span>
            </div>
            <ProgressBar value={progress} level={level} />
          </div>
        </div>

        {expanded && (
          <div className="px-6 pb-5 border-t border-ink-700/40 pt-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
              <div className="flex justify-between"><span className="text-ink-500">Rate</span><span className="text-ink-200 font-mono">{fd.rate}% p.a.</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Type</span><span className="text-ink-200">{fd.fdType}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Nominee</span><span className="text-ink-200">{fd.nominee || '—'}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Tenure progress</span><span className="text-ink-200 font-mono">{progress}%</span></div>
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

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Fixed Deposit">
        <FDForm initial={fd} onClose={() => setEditing(false)} />
      </Modal>

      <Modal open={renewing} onClose={() => setRenewing(false)} title="Renew Fixed Deposit">
        <FDForm initial={fd} isRenewal onClose={() => setRenewing(false)} />
      </Modal>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Fixed Deposit">
        <div className="space-y-4">
          <p className="text-ink-200">Are you sure you want to delete this FD for <span className="text-gold-400 font-medium">{fd.bank}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>Cancel</Button>
            <Button
              variant="danger"
              disabled={isDeleting}
              onClick={async () => {
                try {
                  setIsDeleting(true);
                  await deleteFD(fd.id);
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
