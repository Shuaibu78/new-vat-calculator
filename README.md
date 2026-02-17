# VAT Calculator - NRS Compliance Dashboard

A comprehensive VAT (Value Added Tax) calculator for Nigerian businesses complying with the Nigerian Revenue Service (NRS) e-invoice requirements. This dashboard helps VAT-registered businesses calculate VAT Payable, understand claimable input VAT, manage VAT credits, and maintain compliance with NRS fiscalization requirements.

## 🎯 Overview

The VAT Calculator is a **read-only interpretation layer** that pulls fiscalized invoice data and helps businesses understand their VAT obligations for a selected reporting period. It calculates:

- **Output VAT**: VAT collected from sales invoices
- **Claimable Input VAT**: VAT that can be recovered from purchase invoices
- **Current Month Liability**: Output VAT minus Claimable Input VAT
- **Credit Brought Forward**: VAT credits from previous periods
- **Net VAT Payable**: Final amount owed after applying credits (or credit to carry forward)

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (with persistence)
- **Icons**: Lucide React
- **Runtime**: Node.js

## 📋 Features

### Core Functionality

1. **Period Selection**: Choose VAT reporting periods (monthly)
2. **VAT Calculation**: Automatic calculation based on fiscalized invoices only
3. **Credit Carry Forward**: Automatic tracking and application of VAT credits across periods
4. **Compliance Tracking**: Visual indicators for NRS fiscalization status
5. **Claimability Analysis**: Breakdown of fully claimable, partially claimable, and non-claimable VAT
6. **Review Alerts**: Highlights invoices requiring action
7. **CSV Export**: Export complete VAT summary for filing or record-keeping

### NEW: VAT Credit Carry Forward

The system now handles **VAT credits** (when input VAT exceeds output VAT):
- **January 2026**: Demonstrates a credit scenario (heavy equipment purchase)
- **February 2026**: Shows credit offset against future liability
- **Automatic Calculation**: Credits automatically carry forward
- **Visual Indicators**: Green for credits (asset), Blue for payables (liability)
- **Full Transparency**: Step-by-step calculation breakdown

See **[CREDIT_CARRY_FORWARD.md](./CREDIT_CARRY_FORWARD.md)** for detailed documentation.

### NEW: QR Code Verification

Invoice tables now include a **QR Code** column for easy verification:
- **Clickable QR Icon**: Opens modal with scannable QR code
- **Full IRN Display**: Copy IRN for records
- **NRS Verification**: View fiscalization details
- **Print Capability**: Print QR codes for physical records
- **Mobile Scanning**: Scan with NRS mobile app

See **[QR_CODE_FEATURE.md](./QR_CODE_FEATURE.md)** for detailed documentation.

### Invoice Management

- **Sales Invoices (AR)**: Track output VAT from fiscalized sales
- **Purchase Invoices (AP)**: Track input VAT with claimability status
- **Filtering**: View all invoices, claimable only, review required, or not claimable
- **Drill-down Details**: Expandable rows showing reason codes and descriptions

### Compliance Features

- **IRN Validation**: Only invoices with valid Invoice Reference Numbers count
- **Fiscalization Status**: Clear badges for validated, rejected, pending, or cancelled invoices
- **Reason Codes**: Detailed explanations for non-claimable or review-required VAT
- **Trust Signals**: Visual compliance indicators throughout the UI

## 🏗️ Project Structure

```
new-vat-calculator/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (renders VatDashboard)
│   └── globals.css         # Global styles
├── components/
│   ├── VatDashboard.tsx    # Main dashboard component
│   ├── SummaryCard.tsx     # Metric cards (VAT Payable, Output VAT, etc.)
│   ├── PeriodSelector.tsx  # Period dropdown selector
│   ├── InvoiceTable.tsx    # Detailed invoice list with filtering
│   ├── QRCodeModal.tsx     # QR code verification modal
│   ├── ComplianceBadge.tsx # Status badges (fiscalization, claimability)
│   ├── LoadingState.tsx    # Loading skeletons
│   └── EmptyState.tsx      # Empty state handlers
├── hooks/
│   └── useVatCalculator.ts # Core VAT calculation logic
├── store/
│   └── vatStore.ts         # Zustand global state
├── lib/
│   ├── types.ts            # TypeScript interfaces and types
│   ├── mockData.ts         # Mock invoice generator
│   └── utils.ts            # Utility functions (formatting, export)
└── README.md               # This file
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 20+ or compatible version
- Yarn package manager

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

The application will be available at `http://localhost:3000` (or the next available port).

## 📊 Data Model

### Key Entities

#### Invoice
- **Invoice Type**: SALES (AR) or PURCHASE (AP)
- **Fiscalization Status**: VALIDATED, REJECTED, CANCELLED, PENDING
- **IRN**: Invoice Reference Number (required for compliance)
- **QR Code**: NRS validation reference
- **Line Items**: Individual products/services with VAT breakdown

#### VAT Categories
1. **Standard-Rated (7.5%)**: Most goods and services
2. **Zero-Rated (0%)**: Exports, basic food, medical supplies
3. **Exempt**: Financial services, insurance, education

#### Claimable Status (Purchase Invoices)
- **CLAIMABLE**: 100% of VAT can be recovered
- **PARTIALLY_CLAIMABLE**: Percentage-based recovery (e.g., 50% for mixed-use)
- **NOT_CLAIMABLE**: No VAT recovery (exempt activities, entertainment)
- **REVIEW_REQUIRED**: Action needed (missing IRN, supplier issues)

### Reason Codes

When VAT is not fully claimable, the system provides reason codes:

- `MISSING_IRN`: Invoice not fiscalized by NRS
- `MISSING_FISCALIZED_INVOICE`: Supplier hasn't provided fiscalized invoice
- `EXEMPT_ACTIVITY`: Related to exempt supplies
- `SUPPLIER_NOT_REGISTERED`: Supplier not VAT registered
- `DUPLICATE_IRN`: IRN already used
- `INVOICE_REJECTED_BY_NRS`: Failed NRS validation
- `INVOICE_CANCELLED`: Invoice was cancelled
- `MIXED_USE_ACTIVITY`: Asset used for both business and personal
- `CAPITAL_EXPENDITURE`: Partial recovery on capital assets
- `ENTERTAINMENT_EXPENSE`: Not eligible for recovery
- `NON_BUSINESS_USE`: Personal use, not business-related

## 🧮 VAT Calculation Logic

### Formula

```
Net VAT Payable = (Output VAT - Claimable Input VAT) - Previous Period Credit
```

**Components:**
- **Output VAT**: VAT collected from fiscalized sales
- **Claimable Input VAT**: Recoverable VAT from fiscalized purchases
- **Current Month Liability**: Output VAT - Claimable Input VAT
- **Previous Period Credit**: Credit carried forward from previous period
- **Net VAT Payable**: Final amount (positive = pay, negative = credit)

### Rules

1. **Only fiscalized invoices count**: `fiscalizationStatus === 'VALIDATED'`
2. **Review Required excluded**: Invoices with `REVIEW_REQUIRED` status are isolated
3. **Partial claimability**: Calculated based on `claimablePercent` field
4. **Period filtering**: Only invoices within selected date range

### Example Calculation

```typescript
// Output VAT (from validated sales)
Sales Invoice 1: ₦50,000 (VAT: ₦3,750)
Sales Invoice 2: ₦100,000 (VAT: ₦7,500)
Total Output VAT: ₦11,250

// Claimable Input VAT (from validated purchases)
Purchase 1: ₦30,000 (VAT: ₦2,250) - Fully Claimable
Purchase 2: ₦40,000 (VAT: ₦3,000) - 50% Claimable = ₦1,500
Total Claimable Input VAT: ₦3,750

// VAT Payable
₦11,250 - ₦3,750 = ₦7,500
```

## 🎨 Design Principles

### Color Palette

- **Slate/Gray**: Primary text and neutral elements
- **Emerald/Green**: Positive compliance, claimable VAT
- **Amber/Orange**: Warnings, review required
- **Red**: Errors, rejected invoices, not claimable
- **Blue**: Primary actions, VAT Payable highlight

### UX Principles

1. **Trust First**: Clear, accurate numbers with transparency
2. **Compliance Signals**: Visual indicators for fiscalization status
3. **Actionable Insights**: Highlight issues that need attention
4. **Drill-down Capability**: Summary → Details → Line Items
5. **Export Ready**: One-click CSV export for filing

## 📱 User Flow

### 2-Minute Goal

A user should be able to:

1. **Select Period** (5 seconds): Choose reporting period from dropdown
2. **View VAT Payable** (10 seconds): See net amount owed at a glance
3. **Understand Breakdown** (30 seconds): Review output VAT, claimable input VAT, and at-risk amounts
4. **Identify Issues** (45 seconds): See which invoices need review and why
5. **Export Summary** (30 seconds): Download CSV for records or filing

**Total: ~2 minutes**

## 🔐 Compliance Notes

### NRS Fiscalization

- All compliant invoices must have a valid **IRN** (Invoice Reference Number)
- Invoices must be **validated by NRS** through the MBS platform
- QR codes provide additional verification
- Non-fiscalized invoices are **excluded** from VAT calculations

### Claimability Rules

Input VAT is claimable only when:
- Invoice is fiscalized (validated by NRS)
- Supplier is VAT registered
- Expense is for business purposes
- Not related to exempt activities
- Not entertainment or personal use

## 🧪 Mock Data

The application includes realistic mock data demonstrating a two-month scenario:

### January 2026 - Credit Scenario
- High volume purchases (heavy equipment, inventory stocking)
- Low sales volume
- Result: VAT credit of ₦868,500 carried forward

### February 2026 - Credit Offset Scenario
- High sales volume (₦2,062,500 output VAT)
- Normal operating expenses
- January credit applied, reducing net payable to ₦3,669,750

### Invoice Types
- Standard-rated sales (7.5% VAT)
- Zero-rated exports (0% VAT)
- Fully claimable purchases
- Partially claimable purchases (mixed use, capital expenditure)
- Review required invoices (missing IRN, supplier issues)
- Not claimable invoices (exempt activities, entertainment)
- QR codes for fiscalized invoices

## 🚧 Future Enhancements

### Integration
- Real API integration (replace mock data)
- Integration with accounting software (QuickBooks, Xero)
- Real QR code generation library (e.g., qrcode.react)

### Features
- Multi-currency support
- Historical period comparison
- Advanced filtering and search
- PDF export with NRS-compliant format
- Automated reminders for review-required invoices
- Batch QR code printing
- Email notifications for review-required items

### Technical
- Mobile responsive optimizations
- Role-based access control
- Offline mode support
- Performance optimizations for large datasets

## 📚 Additional Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide for users
- **[CREDIT_CARRY_FORWARD.md](./CREDIT_CARRY_FORWARD.md)** - VAT credit carry forward feature documentation
- **[QR_CODE_FEATURE.md](./QR_CODE_FEATURE.md)** - QR code verification feature documentation
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Initial implementation details
- **[IMPLEMENTATION_UPDATE.md](./IMPLEMENTATION_UPDATE.md)** - Credit carry forward implementation
- **[CALCULATION_AUDIT.md](./CALCULATION_AUDIT.md)** - Calculation verification and audit results

## 📄 License

This project is a prototype for demonstration purposes.

## 👥 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ for Nigerian businesses navigating VAT compliance**
