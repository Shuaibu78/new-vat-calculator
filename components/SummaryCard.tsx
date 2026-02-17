import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  description?: string;
  badge?: string;
}

export function SummaryCard({
  title,
  amount,
  icon: Icon,
  variant = 'default',
  description,
  badge,
}: SummaryCardProps) {
  const variantStyles = {
    default: {
      container: 'bg-white border-slate-200',
      icon: 'bg-slate-100 text-slate-600',
      amount: 'text-slate-900',
      title: 'text-slate-600',
    },
    success: {
      container: 'bg-white border-emerald-200',
      icon: 'bg-emerald-100 text-emerald-600',
      amount: 'text-emerald-700',
      title: 'text-slate-600',
    },
    warning: {
      container: 'bg-white border-amber-200',
      icon: 'bg-amber-100 text-amber-600',
      amount: 'text-amber-700',
      title: 'text-slate-600',
    },
    danger: {
      container: 'bg-white border-red-200',
      icon: 'bg-red-100 text-red-600',
      amount: 'text-red-700',
      title: 'text-slate-600',
    },
    primary: {
      container: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      amount: 'text-blue-900',
      title: 'text-slate-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 ${styles.container} p-6 shadow-sm transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-medium ${styles.title}`}>{title}</p>
            {badge && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                {badge}
              </span>
            )}
          </div>
          <p className={`text-3xl font-bold ${styles.amount} tracking-tight`}>
            {formatCurrency(amount)}
          </p>
          {description && (
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className={`shrink-0 rounded-lg ${styles.icon} p-3`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
