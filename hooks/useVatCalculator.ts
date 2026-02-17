import { useMemo } from 'react';
import type { Invoice, VatPeriod, VatSummary } from '@/lib/types';

interface UseVatCalculatorProps {
  invoices: Invoice[];
  period: VatPeriod;
  previousPeriodCredit?: number;
}

export function useVatCalculator({ 
  invoices, 
  period, 
  previousPeriodCredit = 0 
}: UseVatCalculatorProps): VatSummary {
  return useMemo(() => {
    const isInPeriod = (invoiceDate: string): boolean => {
      const date = new Date(invoiceDate);
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      return date >= start && date <= end;
    };

    const invoicesInPeriod = invoices.filter((inv) => isInPeriod(inv.invoiceDate));

    const salesInvoices = invoicesInPeriod.filter((inv) => inv.invoiceType === 'SALES');
    const purchaseInvoices = invoicesInPeriod.filter((inv) => inv.invoiceType === 'PURCHASE');

    const fiscalizedSales = salesInvoices.filter(
      (inv) => inv.fiscalizationStatus === 'VALIDATED'
    );

    const outputVat = fiscalizedSales.reduce((sum, inv) => sum + inv.totalVat, 0);

    const fiscalizedPurchases = purchaseInvoices.filter(
      (inv) => inv.fiscalizationStatus === 'VALIDATED'
    );

    const fullyClaimableInvoices = fiscalizedPurchases.filter(
      (inv) => inv.claimableStatus === 'CLAIMABLE'
    );
    const fullyClaimableVat = fullyClaimableInvoices.reduce(
      (sum, inv) => sum + (inv.claimableAmount || inv.totalVat),
      0
    );

    const partiallyClaimableInvoices = fiscalizedPurchases.filter(
      (inv) => inv.claimableStatus === 'PARTIALLY_CLAIMABLE'
    );
    const partiallyClaimableVat = partiallyClaimableInvoices.reduce(
      (sum, inv) => sum + (inv.claimableAmount || 0),
      0
    );

    const claimableInputVat = fullyClaimableVat + partiallyClaimableVat;

    const reviewRequiredInvoices = purchaseInvoices.filter(
      (inv) => inv.claimableStatus === 'REVIEW_REQUIRED'
    );

    const reviewRequiredVat = reviewRequiredInvoices.reduce(
      (sum, inv) => sum + inv.totalVat,
      0
    );

    const notClaimableInvoices = fiscalizedPurchases.filter(
      (inv) => inv.claimableStatus === 'NOT_CLAIMABLE'
    );

    const notClaimableVat = notClaimableInvoices.reduce(
      (sum, inv) => sum + inv.totalVat,
      0
    );

    const currentMonthLiability = outputVat - claimableInputVat;
    const netVatPayable = currentMonthLiability - previousPeriodCredit;

    const fiscalizedSalesCount = fiscalizedSales.length;
    const fiscalizedPurchasesCount = fiscalizedPurchases.length;
    const nonFiscalizedSalesCount = salesInvoices.length - fiscalizedSalesCount;
    const nonFiscalizedPurchasesCount = purchaseInvoices.length - fiscalizedPurchasesCount;

    const summary: VatSummary = {
      period,
      outputVat: Number(outputVat.toFixed(2)),
      claimableInputVat: Number(claimableInputVat.toFixed(2)),
      currentMonthLiability: Number(currentMonthLiability.toFixed(2)),
      creditBroughtForward: Number(previousPeriodCredit.toFixed(2)),
      netVatPayable: Number(netVatPayable.toFixed(2)),
      totalSalesInvoices: salesInvoices.length,
      totalPurchaseInvoices: purchaseInvoices.length,
      fullyClaimableVat: Number(fullyClaimableVat.toFixed(2)),
      partiallyClaimableVat: Number(partiallyClaimableVat.toFixed(2)),
      reviewRequiredVat: Number(reviewRequiredVat.toFixed(2)),
      notClaimableVat: Number(notClaimableVat.toFixed(2)),
      fiscalizedSalesCount,
      fiscalizedPurchasesCount,
      nonFiscalizedSalesCount,
      nonFiscalizedPurchasesCount,
      salesInvoices,
      purchaseInvoices,
      reviewRequiredInvoices,
    };

    return summary;
  }, [invoices, period, previousPeriodCredit]);
}
