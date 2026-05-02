import { useState } from 'react';
import { Plus, Shield } from 'lucide-react';
import { useStore } from '@/store';
import { InsuranceCard } from '@/components/insurance/InsuranceCard';
import { InsuranceForm } from '@/components/insurance/InsuranceForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatINR } from '@/utils';

export function InsurancePage() {
  const { insurances } = useStore();
  const [adding, setAdding] = useState(false);

  const totalCover = insurances.reduce((s, i) => s + i.sumAssured, 0);
  const totalPremium = insurances.reduce((s, i) => s + i.annualPremium, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-ink-50">Insurance Policies</h1>
          <p className="text-ink-400 mt-1 text-sm">Track all your insurance policies and premium due dates.</p>
        </div>
        <Button variant="primary" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add Policy
        </Button>
      </div>

      {insurances.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="bg-ink-800/60 border border-ink-600/30 rounded-xl px-5 py-4">
            <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Total Coverage</p>
            <p className="font-mono text-xl text-sky-400 font-medium">{formatINR(totalCover)}</p>
          </div>
          <div className="bg-ink-800/60 border border-ink-600/30 rounded-xl px-5 py-4">
            <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Annual Premiums</p>
            <p className="font-mono text-xl text-ink-100 font-medium">{formatINR(totalPremium)}</p>
          </div>
        </div>
      )}

      {insurances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="p-5 bg-ink-800 border border-ink-600/30 rounded-2xl mb-4">
            <Shield size={32} className="text-ink-500" />
          </div>
          <h3 className="font-display text-xl text-ink-300 mb-2">No Insurance Policies</h3>
          <p className="text-ink-500 text-sm mb-6 max-w-xs">Add your first policy to track coverage, premiums, and maturity dates.</p>
          <Button variant="primary" onClick={() => setAdding(true)}><Plus size={16} />Add First Policy</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {insurances.map((ins) => <InsuranceCard key={ins.id} ins={ins} />)}
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Insurance Policy">
        <InsuranceForm onClose={() => setAdding(false)} />
      </Modal>
    </div>
  );
}
