import { useState } from 'react';
import { Building2, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { FD } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FDForm } from './FDForm';
import { daysLeft, getAlertLevel, calcMaturityAmount, formatINR, formatDate, tenureProgress } from '@/utils';
import { useStore } from '@/store';

export function FDCard({ fd }: { fd: FD }) {
  const { deleteFD } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const days = daysLeft(fd.maturityDate);
  const level = getAlertLevel(days);
  const matAmt = calcMaturityAmount(fd);
  const gain = matAmt - fd.amount;
  const progress = tenureProgress(fd.startDate, fd.maturityDate);

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
                <p className="text-ink-400 text-sm">{fd.holder || 'No holder'}{fd.reference && <span className="text-ink-600"> · #{fd.reference}</span>}</p>
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
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil size={13} />Edit</Button>
              <Button variant="danger" size="sm" onClick={() => confirm('Delete this FD?') && deleteFD(fd.id)}><Trash2 size={13} />Delete</Button>
            </div>
          </div>
        )}
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Fixed Deposit">
        <FDForm initial={fd} onClose={() => setEditing(false)} />
      </Modal>
    </>
  );
}
