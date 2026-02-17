import type {
  Invoice,
  InvoiceLineItem,
  VatPeriod,
  FiscalizationStatus,
  VatCategory,
  ClaimableStatus,
  ReasonCode,
  InvoiceType,
  PaymentStatus,
} from "./types";

function generateIRN(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NRS-${timestamp}-${random}`;
}

function generateQRCode(): string {
  return `QR-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
}

function calculateVatAmount(netAmount: number, vatRate: number): number {
  return Number((netAmount * (vatRate / 100)).toFixed(2));
}

function createLineItem(
  description: string,
  quantity: number,
  unitPrice: number,
  vatCategory: VatCategory,
  vatRate: number,
): InvoiceLineItem {
  const netAmount = Number((quantity * unitPrice).toFixed(2));
  const vatAmount = calculateVatAmount(netAmount, vatRate);
  const totalAmount = Number((netAmount + vatAmount).toFixed(2));

  return {
    id: `line-${Math.random().toString(36).substring(2, 11)}`,
    description,
    quantity,
    unitPrice,
    netAmount,
    vatAmount,
    vatCategory,
    vatRate,
    totalAmount,
  };
}

function createInvoice(
  invoiceType: InvoiceType,
  invoiceDate: string,
  lineItems: InvoiceLineItem[],
  fiscalizationStatus: FiscalizationStatus,
  supplierName: string,
  customerName: string,
  options: {
    claimableStatus?: ClaimableStatus;
    claimablePercent?: number;
    reasonCode?: ReasonCode;
    reasonDescription?: string;
    paymentStatus?: PaymentStatus;
  } = {},
): Invoice {
  const subtotal = lineItems.reduce((sum, item) => sum + item.netAmount, 0);
  const totalVat = lineItems.reduce((sum, item) => sum + item.vatAmount, 0);
  const totalAmount = Number((subtotal + totalVat).toFixed(2));

  // Calculate claimable amount for purchases
  let claimableAmount: number | undefined;
  if (invoiceType === "PURCHASE" && options.claimableStatus) {
    if (options.claimableStatus === "CLAIMABLE") {
      claimableAmount = totalVat;
    } else if (
      options.claimableStatus === "PARTIALLY_CLAIMABLE" &&
      options.claimablePercent
    ) {
      claimableAmount = Number(
        (totalVat * (options.claimablePercent / 100)).toFixed(2),
      );
    } else if (
      options.claimableStatus === "NOT_CLAIMABLE" ||
      options.claimableStatus === "REVIEW_REQUIRED"
    ) {
      claimableAmount = 0;
    }
  }

  const invoice: Invoice = {
    id: `inv-${Math.random().toString(36).substring(2, 11)}`,
    invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    invoiceType,
    irn: fiscalizationStatus === "VALIDATED" ? generateIRN() : null,
    qrCodeReference:
      fiscalizationStatus === "VALIDATED" ? generateQRCode() : null,
    fiscalizationStatus,
    invoiceDate,
    supplierName,
    supplierTaxId: `TAX-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    customerName,
    customerTaxId: `TAX-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    lineItems,
    subtotal: Number(subtotal.toFixed(2)),
    totalVat: Number(totalVat.toFixed(2)),
    totalAmount,
    paymentStatus: options.paymentStatus || "PAID",
    ...(invoiceType === "PURCHASE" && {
      claimableStatus: options.claimableStatus,
      claimablePercent: options.claimablePercent,
      claimableAmount,
      reasonCode: options.reasonCode,
      reasonDescription: options.reasonDescription,
    }),
  };

  return invoice;
}

export function generateMockInvoices(): Invoice[] {
  const invoices: Invoice[] = [];

  invoices.push(
    createInvoice(
      "SALES",
      "2026-01-08",
      [createLineItem("Consulting Services", 5, 10000, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Your Company Ltd",
      "Small Client Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-01-22",
      [
        createLineItem(
          "Software Maintenance",
          10,
          10000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Tech Startup Inc",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-05",
      [
        createLineItem(
          "Manufacturing Equipment",
          1,
          5000000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Installation & Setup",
          1,
          500000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Industrial Equipment Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-10",
      [
        createLineItem(
          "Raw Materials - Batch A",
          500,
          2000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Raw Materials - Batch B",
          300,
          3000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Materials Supplier Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-12",
      [
        createLineItem("Office Furniture", 50, 15000, "STANDARD_RATED", 7.5),
        createLineItem("Computer Systems", 20, 80000, "STANDARD_RATED", 7.5),
      ],
      "VALIDATED",
      "Office Solutions Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-15",
      [
        createLineItem("Factory Rent", 1, 300000, "STANDARD_RATED", 7.5),
        createLineItem("Electricity", 1, 80000, "STANDARD_RATED", 7.5),
      ],
      "VALIDATED",
      "Property Management Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-18",
      [createLineItem("Delivery Van", 1, 2000000, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Auto Dealers Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "PARTIALLY_CLAIMABLE",
        claimablePercent: 80,
        reasonCode: "MIXED_USE_ACTIVITY",
        reasonDescription:
          "Vehicle primarily used for business deliveries. 80% of VAT is claimable.",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-25",
      [createLineItem("Consulting Services", 10, 20000, "STANDARD_RATED", 7.5)],
      "PENDING",
      "Advisory Services Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "REVIEW_REQUIRED",
        reasonCode: "MISSING_IRN",
        reasonDescription:
          "Invoice has not been fiscalized by NRS. Obtain fiscalized invoice from supplier to claim VAT.",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-01-28",
      [createLineItem("Client Dinner", 1, 40000, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Restaurant Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "NOT_CLAIMABLE",
        reasonCode: "ENTERTAINMENT_EXPENSE",
        reasonDescription:
          "Entertainment expenses are not eligible for VAT recovery under NRS regulations.",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-03",
      [
        createLineItem(
          "Finished Products - Batch 1",
          500,
          15000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Finished Products - Batch 2",
          400,
          12000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Wholesale Distributor Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-08",
      [
        createLineItem(
          "Custom Manufacturing Services",
          100,
          30000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Installation Services",
          50,
          20000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Corporate Client Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-12",
      [
        createLineItem(
          "Enterprise Software License",
          1,
          5000000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Implementation & Training",
          1,
          1000000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Large Enterprise Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-15",
      [
        createLineItem(
          "Finished Products - Batch 3",
          800,
          18000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Premium Product Line",
          200,
          25000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Retail Chain Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-18",
      [
        createLineItem(
          "Industrial Equipment Sales",
          10,
          350000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Maintenance Contract (Annual)",
          1,
          500000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Manufacturing Corp Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-20",
      [
        createLineItem(
          "Consulting & Support Services",
          200,
          15000,
          "STANDARD_RATED",
          7.5,
        ),
        createLineItem(
          "Project Management Services",
          1,
          800000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "Enterprise Client Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-25",
      [
        createLineItem(
          "Bulk Product Sales - Domestic",
          1000,
          12000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Your Company Ltd",
      "National Distributor Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "SALES",
      "2026-02-28",
      [createLineItem("Export Products", 200, 8000, "ZERO_RATED", 0)],
      "VALIDATED",
      "Your Company Ltd",
      "International Buyer Ltd",
      { paymentStatus: "PAID" },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-02-05",
      [
        createLineItem(
          "Raw Materials - Replenishment",
          100,
          2000,
          "STANDARD_RATED",
          7.5,
        ),
      ],
      "VALIDATED",
      "Materials Supplier Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-02-10",
      [
        createLineItem("Factory Rent", 1, 300000, "STANDARD_RATED", 7.5),
        createLineItem("Utilities", 1, 60000, "STANDARD_RATED", 7.5),
      ],
      "VALIDATED",
      "Property Management Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-02-15",
      [createLineItem("Packaging Materials", 500, 500, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Packaging Supplies Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-02-20",
      [createLineItem("Marketing Services", 1, 100000, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Marketing Agency Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-02-25",
      [createLineItem("Maintenance Services", 1, 80000, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Maintenance Services Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "CLAIMABLE",
        paymentStatus: "PAID",
      },
    ),
  );

  invoices.push(
    createInvoice(
      "PURCHASE",
      "2026-02-28",
      [createLineItem("Team Building Event", 1, 60000, "STANDARD_RATED", 7.5)],
      "VALIDATED",
      "Events Company Ltd",
      "Your Company Ltd",
      {
        claimableStatus: "NOT_CLAIMABLE",
        reasonCode: "ENTERTAINMENT_EXPENSE",
        reasonDescription:
          "Entertainment expenses are not eligible for VAT recovery under NRS regulations.",
        paymentStatus: "PAID",
      },
    ),
  );

  return invoices;
}

export const mockVatPeriods: VatPeriod[] = [
  {
    id: "feb-2026",
    label: "February 2026",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
  },
  {
    id: "jan-2026",
    label: "January 2026",
    startDate: "2026-01-01",
    endDate: "2026-01-31",
  },
  {
    id: "dec-2025",
    label: "December 2025",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
  },
];

export const mockInvoices = generateMockInvoices();

export const previousPeriodCredits: Record<string, number> = {
  "jan-2026": 0,
  "feb-2026": 868500,
  "dec-2025": 0,
};
