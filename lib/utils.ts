import type { Invoice, VatSummary, ReasonCode } from './types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getReasonCodeLabel(reasonCode: ReasonCode): string {
  const labels: Record<ReasonCode, string> = {
    MISSING_IRN: 'Missing IRN',
    MISSING_FISCALIZED_INVOICE: 'Missing Fiscalized Invoice',
    EXEMPT_ACTIVITY: 'Exempt Activity',
    SUPPLIER_NOT_REGISTERED: 'Supplier Not VAT Registered',
    DUPLICATE_IRN: 'Duplicate IRN',
    INVOICE_REJECTED_BY_NRS: 'Rejected by NRS',
    INVOICE_CANCELLED: 'Invoice Cancelled',
    MIXED_USE_ACTIVITY: 'Mixed Use Activity',
    CAPITAL_EXPENDITURE: 'Capital Expenditure',
    ENTERTAINMENT_EXPENSE: 'Entertainment Expense',
    NON_BUSINESS_USE: 'Non-Business Use',
  };
  return labels[reasonCode] || reasonCode;
}

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function exportVatSummaryToCSV(summary: VatSummary): void {
  const lines: string[] = [];

  lines.push('VAT CALCULATOR SUMMARY');
  lines.push(`Period: ${summary.period.label}`);
  lines.push(`Start Date: ${formatDate(summary.period.startDate)}`);
  lines.push(`End Date: ${formatDate(summary.period.endDate)}`);
  lines.push('');

  lines.push('SUMMARY');
  lines.push('Metric,Amount (NGN)');
  lines.push(`Output VAT,${formatNumber(summary.outputVat)}`);
  lines.push(`Claimable Input VAT,${formatNumber(summary.claimableInputVat)}`);
  lines.push(`Current Month Liability,${formatNumber(summary.currentMonthLiability)}`);
  if (summary.creditBroughtForward > 0) {
    lines.push(`Credit Brought Forward,${formatNumber(summary.creditBroughtForward)}`);
  }
  lines.push(`Net VAT Payable,${formatNumber(summary.netVatPayable)}`);
  lines.push('');

  lines.push('BREAKDOWN');
  lines.push('Category,Amount (NGN)');
  lines.push(`Fully Claimable VAT,${formatNumber(summary.fullyClaimableVat)}`);
  lines.push(`Partially Claimable VAT,${formatNumber(summary.partiallyClaimableVat)}`);
  lines.push(`Review Required VAT,${formatNumber(summary.reviewRequiredVat)}`);
  lines.push(`Not Claimable VAT,${formatNumber(summary.notClaimableVat)}`);
  lines.push('');

  lines.push('COMPLIANCE METRICS');
  lines.push('Metric,Count');
  lines.push(`Fiscalized Sales,${summary.fiscalizedSalesCount}`);
  lines.push(`Fiscalized Purchases,${summary.fiscalizedPurchasesCount}`);
  lines.push(`Non-Fiscalized Sales,${summary.nonFiscalizedSalesCount}`);
  lines.push(`Non-Fiscalized Purchases,${summary.nonFiscalizedPurchasesCount}`);
  lines.push('');

  lines.push('SALES INVOICES');
  lines.push('Date,Invoice Number,Customer,IRN,Fiscalization Status,Subtotal,VAT,Total');
  summary.salesInvoices.forEach((inv) => {
    lines.push(
      [
        escapeCSV(formatDate(inv.invoiceDate)),
        escapeCSV(inv.invoiceNumber),
        escapeCSV(inv.customerName),
        escapeCSV(inv.irn || 'N/A'),
        escapeCSV(inv.fiscalizationStatus),
        escapeCSV(formatNumber(inv.subtotal)),
        escapeCSV(formatNumber(inv.totalVat)),
        escapeCSV(formatNumber(inv.totalAmount)),
      ].join(',')
    );
  });
  lines.push('');

  lines.push('PURCHASE INVOICES');
  lines.push(
    'Date,Invoice Number,Supplier,IRN,Fiscalization Status,Claimable Status,Subtotal,VAT,Claimable VAT,Reason'
  );
  summary.purchaseInvoices.forEach((inv) => {
    lines.push(
      [
        escapeCSV(formatDate(inv.invoiceDate)),
        escapeCSV(inv.invoiceNumber),
        escapeCSV(inv.supplierName),
        escapeCSV(inv.irn || 'N/A'),
        escapeCSV(inv.fiscalizationStatus),
        escapeCSV(inv.claimableStatus || 'N/A'),
        escapeCSV(formatNumber(inv.subtotal)),
        escapeCSV(formatNumber(inv.totalVat)),
        escapeCSV(formatNumber(inv.claimableAmount || 0)),
        escapeCSV(inv.reasonCode ? getReasonCodeLabel(inv.reasonCode) : ''),
      ].join(',')
    );
  });

  const csvContent = lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `vat-summary-${summary.period.id}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
