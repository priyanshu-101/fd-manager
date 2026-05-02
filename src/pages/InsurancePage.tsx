import { useState } from 'react';
import { Plus, Shield, Search } from 'lucide-react';
import { useStore } from '@/store';
import { InsuranceCard } from '@/components/insurance/InsuranceCard';
import { InsuranceForm } from '@/components/insurance/InsuranceForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatINR } from '@/utils';

export function InsurancePage() {
  const { insurances } = useStore();
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matchingPolicies = search.trim()
    ? Array.from(new Set(insurances.filter((ins) => ins.name?.toLowerCase().includes(search.toLowerCase())).map((ins) => ins.name)))
    : [];

  const filteredInsurances = insurances.filter((ins) =>
    [ins.name, ins.company, ins.policyNumber, ins.policyType, ins.nominee].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalCover = filteredInsurances.reduce((s, i) => s + i.sumAssured, 0);
  const totalPremium = filteredInsurances.reduce((s, i) => s + i.annualPremium, 0);

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
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '30ms' }}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" />
            <Input
              placeholder="Search policies by name, company, policy number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10"
            />
            {showSuggestions && matchingPolicies.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-ink-800 border border-ink-600/30 rounded-xl overflow-hidden shadow-lg z-10 animate-fade-in">
                <div className="p-2">
                  <p className="text-xs font-medium text-ink-500 uppercase tracking-wider px-3 py-1.5">Matching Policies</p>
                  {matchingPolicies.map((policyName) => {
                    const policyInsurances = insurances.filter((ins) => ins.name === policyName);
                    return (
                      <button
                        key={policyName}
                        onClick={() => {
                          setSearch(policyName);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-ink-700/60 transition-colors rounded-lg text-ink-200 flex justify-between items-center"
                      >
                        <span>{policyName}</span>
                        <span className="text-xs text-ink-500">({policyInsurances.length})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredInsurances.length > 0 && (
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
      ) : filteredInsurances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="p-5 bg-ink-800 border border-ink-600/30 rounded-2xl mb-4">
            <Search size={32} className="text-ink-500" />
          </div>
          <h3 className="font-display text-xl text-ink-300 mb-2">No Policies Found</h3>
          <p className="text-ink-500 text-sm mb-6 max-w-xs">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInsurances.map((ins) => <InsuranceCard key={ins.id} ins={ins} />)}
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Insurance Policy">
        <InsuranceForm onClose={() => setAdding(false)} />
      </Modal>
    </div>
  );
}
