import { FileX, Calendar, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-invoices' | 'no-period' | 'error';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  type = 'no-invoices',
  title,
  description,
  action,
}: EmptyStateProps) {
  const variants = {
    'no-invoices': {
      icon: FileX,
      defaultTitle: 'No Invoices Found',
      defaultDescription:
        'There are no invoices for the selected period. Try selecting a different reporting period.',
      iconColor: 'text-slate-400',
      bgColor: 'bg-slate-50',
    },
    'no-period': {
      icon: Calendar,
      defaultTitle: 'No Period Selected',
      defaultDescription: 'Please select a VAT reporting period to view your calculations.',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-50',
    },
    error: {
      icon: AlertCircle,
      defaultTitle: 'Something Went Wrong',
      defaultDescription:
        'We encountered an error while loading your data. Please try again or contact support.',
      iconColor: 'text-red-400',
      bgColor: 'bg-red-50',
    },
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${variant.bgColor} mb-6`}
        >
          <Icon className={`h-10 w-10 ${variant.iconColor}`} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          {title || variant.defaultTitle}
        </h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          {description || variant.defaultDescription}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
