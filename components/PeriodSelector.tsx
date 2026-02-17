'use client';

import { Calendar } from 'lucide-react';
import type { VatPeriod } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface PeriodSelectorProps {
  periods: VatPeriod[];
  selectedPeriod: VatPeriod;
  onPeriodChange: (period: VatPeriod) => void;
}

export function PeriodSelector({
  periods,
  selectedPeriod,
  onPeriodChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-slate-600">
        <Calendar className="h-5 w-5" />
        <span className="text-sm font-medium">Reporting Period:</span>
      </div>
      <select
        value={selectedPeriod.id}
        onChange={(e) => {
          const period = periods.find((p) => p.id === e.target.value);
          if (period) onPeriodChange(period);
        }}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-slate-300"
      >
        {periods.map((period) => (
          <option key={period.id} value={period.id}>
            {period.label} ({formatDate(period.startDate)} - {formatDate(period.endDate)})
          </option>
        ))}
      </select>
    </div>
  );
}
