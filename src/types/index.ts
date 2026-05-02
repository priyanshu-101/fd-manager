export interface FD {
  id: string;
  parentId?: string;
  bank: string;
  holder: string;
  amount: number;
  rate: number;
  startDate: string;
  maturityDate: string;
  fdType: 'Cumulative' | 'Non-Cumulative';
  nominee: string;
  reference: string;
  createdAt: string;
}

export interface Insurance {
  id: string;
  parentId?: string;
  name: string;
  company: string;
  policyType: 'Life' | 'Health' | 'Term' | 'ULIP' | 'Vehicle' | 'Other';
  policyNumber: string;
  sumAssured: number;
  annualPremium: number;
  startDate: string;
  maturityDate: string;
  premiumDueDate: string;
  nominee: string;
  createdAt: string;
}

export type AlertLevel = 'critical' | 'warning' | 'safe' | 'matured';

export interface MaturityAlert {
  id: string;
  type: 'FD' | 'Insurance' | 'Premium';
  name: string;
  daysLeft: number;
  level: AlertLevel;
  amount?: number;
}
