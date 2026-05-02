import { differenceInDays, parseISO } from 'date-fns';
import { AlertLevel, FD } from '@/types';

export function daysLeft(dateStr: string): number {
  return differenceInDays(parseISO(dateStr), new Date());
}

export function getAlertLevel(days: number): AlertLevel {
  if (days < 0) return 'matured';
  if (days <= 30) return 'critical';
  if (days <= 90) return 'warning';
  return 'safe';
}

export function calcMaturityAmount(fd: FD): number {
  const years = differenceInDays(parseISO(fd.maturityDate), parseISO(fd.startDate)) / 365;
  return Math.round(fd.amount * Math.pow(1 + fd.rate / 100, years));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(parseISO(dateStr));
}

export function tenureProgress(startDate: string, endDate: string): number {
  const total = differenceInDays(parseISO(endDate), parseISO(startDate));
  const elapsed = differenceInDays(new Date(), parseISO(startDate));
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function clsx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
