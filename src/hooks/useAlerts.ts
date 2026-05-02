import { useMemo } from 'react';
import { useStore } from '@/store';
import { daysLeft, getAlertLevel } from '@/utils';
import { MaturityAlert } from '@/types';

export function useAlerts(): MaturityAlert[] {
  const { fds, insurances } = useStore();

  return useMemo(() => {
    const alerts: MaturityAlert[] = [];

    fds.forEach((fd) => {
      const days = daysLeft(fd.maturityDate);
      if (days >= 0 && days <= 90) {
        alerts.push({
          id: fd.id,
          type: 'FD',
          name: `${fd.bank} FD`,
          daysLeft: days,
          level: getAlertLevel(days),
          amount: fd.amount,
        });
      }
    });

    insurances.forEach((ins) => {
      const days = daysLeft(ins.maturityDate);
      if (days >= 0 && days <= 90) {
        alerts.push({
          id: ins.id,
          type: 'Insurance',
          name: ins.name,
          daysLeft: days,
          level: getAlertLevel(days),
          amount: ins.sumAssured,
        });
      }
      if (ins.premiumDueDate) {
        const premiumDays = daysLeft(ins.premiumDueDate);
        if (premiumDays >= 0 && premiumDays <= 30) {
          alerts.push({
            id: ins.id + '-premium',
            type: 'Premium',
            name: `${ins.name} Premium`,
            daysLeft: premiumDays,
            level: getAlertLevel(premiumDays),
            amount: ins.annualPremium,
          });
        }
      }
    });

    return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [fds, insurances]);
}
