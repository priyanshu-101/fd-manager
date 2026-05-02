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
  fdNumber: string;
  createdAt: string;
  history?: HistoryEntry[];
}

export type NewFD = Omit<FD, 'id'>;

export interface HistoryEntry {
  id: string;
  amount: number;
  rate: number;
  startDate: string;
  maturityDate: string;
  fdType: string;
  updatedAt: string;
}

export interface Insurance {
  id: string;
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
  history?: any[];
}

export type NewInsurance = Omit<Insurance, 'id'>;

export type AlertLevel = 'critical' | 'warning' | 'safe' | 'matured';

export interface MaturityAlert {
  id: string;
  type: 'FD' | 'Insurance' | 'Premium';
  name: string;
  daysLeft: number;
  level: AlertLevel;
  amount?: number;
}
