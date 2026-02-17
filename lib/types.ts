export type FiscalizationStatus = 'VALIDATED' | 'REJECTED' | 'CANCELLED' | 'PENDING';

export type VatCategory = 'STANDARD_RATED' | 'ZERO_RATED' | 'EXEMPT';

export type ClaimableStatus = 
  | 'CLAIMABLE' 
  | 'PARTIALLY_CLAIMABLE' 
  | 'NOT_CLAIMABLE' 
  | 'REVIEW_REQUIRED';

export type InvoiceType = 'SALES' | 'PURCHASE';

export type PaymentStatus = 'PAID' | 'UNPAID' | 'CANCELLED' | 'PARTIAL';

export type ReasonCode =
  | 'MISSING_IRN'
  | 'MISSING_FISCALIZED_INVOICE'
  | 'EXEMPT_ACTIVITY'
  | 'SUPPLIER_NOT_REGISTERED'
  | 'DUPLICATE_IRN'
  | 'INVOICE_REJECTED_BY_NRS'
  | 'INVOICE_CANCELLED'
  | 'MIXED_USE_ACTIVITY'
  | 'CAPITAL_EXPENDITURE'
  | 'ENTERTAINMENT_EXPENSE'
  | 'NON_BUSINESS_USE';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  vatAmount: number;
  vatCategory: VatCategory;
  vatRate: number;
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  irn: string | null;
  qrCodeReference: string | null;
  fiscalizationStatus: FiscalizationStatus;
  invoiceDate: string;
  dueDate?: string;
  supplierName: string;
  supplierTaxId?: string;
  customerName: string;
  customerTaxId?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  totalVat: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  claimableStatus?: ClaimableStatus;
  claimablePercent?: number;
  claimableAmount?: number;
  reasonCode?: ReasonCode;
  reasonDescription?: string;
}

export interface VatPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

export interface VatSummary {
  period: VatPeriod;
  outputVat: number;
  claimableInputVat: number;
  currentMonthLiability: number;
  creditBroughtForward: number;
  netVatPayable: number;
  totalSalesInvoices: number;
  totalPurchaseInvoices: number;
  fullyClaimableVat: number;
  partiallyClaimableVat: number;
  reviewRequiredVat: number;
  notClaimableVat: number;
  fiscalizedSalesCount: number;
  fiscalizedPurchasesCount: number;
  nonFiscalizedSalesCount: number;
  nonFiscalizedPurchasesCount: number;
  salesInvoices: Invoice[];
  purchaseInvoices: Invoice[];
  reviewRequiredInvoices: Invoice[];
}

export type InvoiceFilter = 'ALL' | 'CLAIMABLE' | 'REVIEW_REQUIRED' | 'NOT_CLAIMABLE';

export interface VatCalculatorState {
  selectedPeriod: VatPeriod;
  invoiceFilter: InvoiceFilter;
  isLoading: boolean;
  error: string | null;
}
