import { Shield, AlertTriangle, XCircle, Clock, CheckCircle } from 'lucide-react';
import type { FiscalizationStatus, ClaimableStatus } from '@/lib/types';

interface FiscalizationBadgeProps {
  status: FiscalizationStatus;
  showIcon?: boolean;
}

export function FiscalizationBadge({ status, showIcon = true }: FiscalizationBadgeProps) {
  const variants = {
    VALIDATED: {
      label: 'Fiscalized',
      icon: Shield,
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    REJECTED: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-red-100 text-red-700 border-red-200',
    },
    CANCELLED: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    PENDING: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-amber-100 text-amber-700 border-amber-200',
    },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${variant.className}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {variant.label}
    </span>
  );
}

interface ClaimableStatusBadgeProps {
  status: ClaimableStatus;
  percent?: number;
  showIcon?: boolean;
}

export function ClaimableStatusBadge({
  status,
  percent,
  showIcon = true,
}: ClaimableStatusBadgeProps) {
  const variants = {
    CLAIMABLE: {
      label: 'Claimable',
      icon: CheckCircle,
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    PARTIALLY_CLAIMABLE: {
      label: percent ? `${percent}% Claimable` : 'Partially Claimable',
      icon: CheckCircle,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    NOT_CLAIMABLE: {
      label: 'Not Claimable',
      icon: XCircle,
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    REVIEW_REQUIRED: {
      label: 'Review Required',
      icon: AlertTriangle,
      className: 'bg-amber-100 text-amber-700 border-amber-200',
    },
  };

  const variant = variants[status];
  const Icon = variant.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${variant.className}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {variant.label}
    </span>
  );
}
