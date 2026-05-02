import { useState } from 'react';
import { Plus, Building2, Search } from 'lucide-react';
import { useStore } from '@/store';
import { FDCard } from '@/components/fd/FDCard';
import { FDForm } from '@/components/fd/FDForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { calcMaturityAmount, formatINR } from '@/utils';

export function FDPage() {
  const { fds } = useStore();
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matchingHolders = search.trim()
    ? Array.from(new Set(fds.filter((fd) => fd.holder?.toLowerCase().includes(search.toLowerCase())).map((fd) => fd.holder)))
    : [];

  const filteredFds = fds.filter((fd) =>
    [fd.bank, fd.holder, fd.reference, fd.fdType, fd.nominee].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPrincipal = filteredFds.reduce((s, f) => s + f.amount, 0);
  const totalMaturity = filteredFds.reduce((s, f) => s + calcMaturityAmount(f), 0);
  const totalGain = totalMaturity - totalPrincipal;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl text-ink-50">Fixed Deposits</h1>
          <p className="text-ink-400 mt-1 text-sm">Manage all your FD accounts and maturity dates.</p>
        </div>
        <Button variant="primary" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add FD
        </Button>
      </div>

      {fds.length > 0 && (
        <div className="mb-6 animate-fade-up" style={{ animationDelay: '30ms' }}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-500" />
            <Input
              placeholder="Search FDs by bank, holder, reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10"
            />
            {showSuggestions && matchingHolders.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-ink-800 border border-ink-600/30 rounded-xl overflow-hidden shadow-lg z-10 animate-fade-in">
                <div className="p-2">
                  <p className="text-xs font-medium text-ink-500 uppercase tracking-wider px-3 py-1.5">Matching Holders</p>
                  {matchingHolders.map((holder) => {
                    const holderFds = fds.filter((fd) => fd.holder === holder);
                    return (
                      <button
                        key={holder}
                        onClick={() => {
                          setSearch(holder);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-ink-700/60 transition-colors rounded-lg text-ink-200 flex justify-between items-center"
                      >
                        <span>{holder}</span>
                        <span className="text-xs text-ink-500">({holderFds.length})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredFds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="bg-ink-800/60 border border-ink-600/30 rounded-xl px-5 py-4">
            <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Total Invested</p>
            <p className="font-mono text-xl text-ink-100 font-medium">{formatINR(totalPrincipal)}</p>
          </div>
          <div className="bg-ink-800/60 border border-ink-600/30 rounded-xl px-5 py-4">
            <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Total Maturity</p>
            <p className="font-mono text-xl text-emerald-400 font-medium">{formatINR(totalMaturity)}</p>
          </div>
          <div className="bg-ink-800/60 border border-ink-600/30 rounded-xl px-5 py-4">
            <p className="text-ink-500 text-xs uppercase tracking-wider mb-1">Interest Gain</p>
            <p className="font-mono text-xl text-gold-400 font-medium">+{formatINR(totalGain)}</p>
          </div>
        </div>
      )}

      {fds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="p-5 bg-ink-800 border border-ink-600/30 rounded-2xl mb-4">
            <Building2 size={32} className="text-ink-500" />
          </div>
          <h3 className="font-display text-xl text-ink-300 mb-2">No Fixed Deposits</h3>
          <p className="text-ink-500 text-sm mb-6 max-w-xs">Add your first FD to start tracking maturity dates and returns.</p>
          <Button variant="primary" onClick={() => setAdding(true)}><Plus size={16} />Add First FD</Button>
        </div>
      ) : filteredFds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="p-5 bg-ink-800 border border-ink-600/30 rounded-2xl mb-4">
            <Search size={32} className="text-ink-500" />
          </div>
          <h3 className="font-display text-xl text-ink-300 mb-2">No FDs Found</h3>
          <p className="text-ink-500 text-sm mb-6 max-w-xs">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFds.map((fd) => <FDCard key={fd.id} fd={fd} />)}
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Fixed Deposit">
        <FDForm onClose={() => setAdding(false)} />
      </Modal>
    </div>
  );
}
