import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store';
import { generateId, calcMaturityAmount } from '@/utils';
import { FD } from '@/types';

interface FDFormProps {
  initial?: FD;
  isRenewal?: boolean;
  onClose: () => void;
}

export function FDForm({ initial, isRenewal, onClose }: FDFormProps) {
  const { addFD, updateFD } = useStore();
  const [form, setForm] = useState({
    bank: initial?.bank ?? '',
    holder: initial?.holder ?? '',
    amount: (isRenewal ? calcMaturityAmount(initial!) : initial?.amount)?.toString() ?? '',
    rate: initial?.rate?.toString() ?? '',
    startDate: isRenewal ? initial?.maturityDate ?? '' : initial?.startDate ?? '',
    maturityDate: isRenewal ? '' : initial?.maturityDate ?? '',
    fdType: initial?.fdType ?? 'Cumulative',
    nominee: initial?.nominee ?? '',
    reference: initial?.reference ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.bank) e.bank = 'Required';
    if (!form.amount || isNaN(Number(form.amount))) e.amount = 'Valid amount required';
    if (!form.rate || isNaN(Number(form.rate))) e.rate = 'Valid rate required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.maturityDate) e.maturityDate = 'Required';
    if (form.startDate && form.maturityDate && form.startDate >= form.maturityDate)
      e.maturityDate = 'Must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const isEdit = initial && !isRenewal;
    
    let history = initial?.history || [];
    if (isRenewal && initial) {
      // Capture current state before updating for renewal
      const historyEntry = {
        id: generateId(),
        amount: initial.amount,
        rate: initial.rate,
        startDate: initial.startDate,
        maturityDate: initial.maturityDate,
        fdType: initial.fdType,
        updatedAt: new Date().toISOString()
      };
      history = [...history, historyEntry];
    }

    const fd: FD = {
      id: (isEdit || isRenewal) ? initial!.id : generateId(),
      parentId: initial?.parentId, // Keep parentId if it exists
      bank: form.bank,
      holder: form.holder,
      amount: Number(form.amount),
      rate: Number(form.rate),
      startDate: form.startDate,
      maturityDate: form.maturityDate,
      fdType: form.fdType as FD['fdType'],
      nominee: form.nominee,
      reference: form.reference,
      createdAt: isEdit ? initial.createdAt : (initial?.createdAt || new Date().toISOString()),
      history: history
    };

    if (isEdit || isRenewal) updateFD(initial!.id, fd);
    else addFD(fd);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Bank / Institution *" value={form.bank} onChange={(e) => set('bank', e.target.value)} placeholder="e.g. SBI, HDFC" error={errors.bank} />
        <Input label="Account Holder" value={form.holder} onChange={(e) => set('holder', e.target.value)} placeholder="Full name" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Principal Amount (₹) *" type="number" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="500000" error={errors.amount} />
        <Input label="Interest Rate (% p.a.) *" type="number" step="0.01" value={form.rate} onChange={(e) => set('rate', e.target.value)} placeholder="7.5" error={errors.rate} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Start Date *" type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} error={errors.startDate} />
        <Input label="Maturity Date *" type="date" value={form.maturityDate} onChange={(e) => set('maturityDate', e.target.value)} error={errors.maturityDate} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="FD Type" value={form.fdType} onChange={(e) => set('fdType', e.target.value)} options={[{ value: 'Cumulative', label: 'Cumulative' }, { value: 'Non-Cumulative', label: 'Non-Cumulative' }]} />
        <Input label="Nominee" value={form.nominee} onChange={(e) => set('nominee', e.target.value)} placeholder="Nominee name" />
      </div>
      <Input label="FD Number / Reference" value={form.reference} onChange={(e) => set('reference', e.target.value)} placeholder="Optional reference number" />
      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} className="flex-1">
          {isRenewal ? 'Renew FD' : initial ? 'Update FD' : 'Add FD'}
        </Button>
      </div>
    </div>
  );
}
