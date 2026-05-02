import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store';
import { Insurance, NewInsurance } from '@/types';

interface InsFormProps {
  initial?: Insurance;
  isRenewal?: boolean;
  onClose: () => void;
}

const policyTypes = ['Life', 'Health', 'Term', 'ULIP', 'Vehicle', 'Other'].map((v) => ({ value: v, label: v }));

export function InsuranceForm({ initial, isRenewal, onClose }: InsFormProps) {
  const { addInsurance, updateInsurance } = useStore();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    company: initial?.company ?? '',
    policyType: initial?.policyType ?? 'Life',
    policyNumber: initial?.policyNumber ?? '',
    sumAssured: initial?.sumAssured?.toString() ?? '',
    annualPremium: initial?.annualPremium?.toString() ?? '',
    startDate: isRenewal ? initial?.maturityDate ?? '' : initial?.startDate ?? '',
    maturityDate: isRenewal ? '' : initial?.maturityDate ?? '',
    premiumDueDate: isRenewal ? '' : initial?.premiumDueDate ?? '',
    nominee: initial?.nominee ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Required';
    if (!form.company) e.company = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.maturityDate) e.maturityDate = 'Required';
    if (form.startDate && form.maturityDate && form.startDate >= form.maturityDate)
      e.maturityDate = 'Must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const isEdit = initial && !isRenewal;
    const ins: NewInsurance = {
      name: form.name,
      company: form.company,
      policyType: form.policyType as Insurance['policyType'],
      policyNumber: form.policyNumber,
      sumAssured: Number(form.sumAssured) || 0,
      annualPremium: Number(form.annualPremium) || 0,
      startDate: form.startDate,
      maturityDate: form.maturityDate,
      premiumDueDate: form.premiumDueDate,
      nominee: form.nominee,
      createdAt: isEdit ? initial.createdAt : new Date().toISOString(),
    };
    try {
      if (isEdit) await updateInsurance(initial.id, ins);
      else await addInsurance(ins);
      onClose();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not save policy');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Policy Name *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. LIC Jeevan Anand" error={errors.name} />
        <Input label="Insurance Company *" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="e.g. LIC, Max Life" error={errors.company} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Policy Type" value={form.policyType} onChange={(e) => set('policyType', e.target.value)} options={policyTypes} />
        <Input label="Policy Number" value={form.policyNumber} onChange={(e) => set('policyNumber', e.target.value)} placeholder="Policy number" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Sum Assured (₹)" type="number" value={form.sumAssured} onChange={(e) => set('sumAssured', e.target.value)} placeholder="1000000" />
        <Input label="Annual Premium (₹)" type="number" value={form.annualPremium} onChange={(e) => set('annualPremium', e.target.value)} placeholder="25000" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Policy Start Date *" type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} error={errors.startDate} />
        <Input label="Maturity / Renewal Date *" type="date" value={form.maturityDate} onChange={(e) => set('maturityDate', e.target.value)} error={errors.maturityDate} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Next Premium Due Date" type="date" value={form.premiumDueDate} onChange={(e) => set('premiumDueDate', e.target.value)} />
        <Input label="Nominee" value={form.nominee} onChange={(e) => set('nominee', e.target.value)} placeholder="Nominee name" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} className="flex-1">
          {isRenewal ? 'Renew Policy' : initial ? 'Update Policy' : 'Add Policy'}
        </Button>
      </div>
    </div>
  );
}
