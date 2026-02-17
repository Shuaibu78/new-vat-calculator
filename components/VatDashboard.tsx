'use client';

import { useState } from 'react';
import {
  ArrowUpFromLine,
  ArrowDownToLine,
  AlertTriangle,
  FileWarning,
  Scale,
  Download,
  FileText,
  Shield,
  Info,
} from "lucide-react";
import { useVatCalculator } from '@/hooks/useVatCalculator';
import { useVatStore } from '@/store/vatStore';
import { mockVatPeriods, mockInvoices, previousPeriodCredits } from '@/lib/mockData';
import { exportVatSummaryToCSV } from '@/lib/utils';
import { SummaryCard } from './SummaryCard';
import { PeriodSelector } from './PeriodSelector';
import { InvoiceTable } from './InvoiceTable';

export function VatDashboard() {
  const { selectedPeriod, setSelectedPeriod } = useVatStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'sales' | 'purchases'>('summary');

  const previousCredit = previousPeriodCredits[selectedPeriod.id] || 0;

  const vatSummary = useVatCalculator({
    invoices: mockInvoices,
    period: selectedPeriod,
    previousPeriodCredit: previousCredit,
  });

  const handleExport = () => {
    exportVatSummaryToCSV(vatSummary);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                VAT Calculator
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Nigerian Revenue Service (NRS) Compliance Dashboard
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          <PeriodSelector
            periods={mockVatPeriods}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              NRS Fiscalization Compliance
            </p>
            <p className="text-sm text-blue-800 leading-relaxed">
              Only NRS-validated (fiscalized) invoices with valid IRN and QR
              codes are included in VAT calculations. Non-fiscalized invoices
              are excluded from compliance reporting.
            </p>
          </div>
        </div>

        {/* Period-Specific Context */}
        {selectedPeriod.id === "jan-2026" &&
          vatSummary.currentMonthLiability < 0 && (
            <div className="mb-6 bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900 mb-1">
                  VAT Credit Position - January 2026
                </p>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Your business purchased heavy equipment and stocked inventory
                  this month, resulting in high claimable input VAT. Since your
                  claimable input VAT (₦
                  {vatSummary.claimableInputVat.toLocaleString("en-NG")})
                  exceeds your output VAT (₦
                  {vatSummary.outputVat.toLocaleString("en-NG")}), you have a{" "}
                  <span className="font-bold">
                    VAT credit of ₦
                    {Math.abs(vatSummary.currentMonthLiability).toLocaleString(
                      "en-NG",
                    )}
                  </span>{" "}
                  that will be carried forward to offset future VAT liabilities.
                </p>
              </div>
            </div>
          )}

        {selectedPeriod.id === "feb-2026" &&
          vatSummary.creditBroughtForward > 0 && (
            <div className="mb-6 bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-indigo-900 mb-1">
                  Credit Offset Applied - February 2026
                </p>
                <p className="text-sm text-indigo-800 leading-relaxed">
                  Your January VAT credit of ₦
                  {vatSummary.creditBroughtForward.toLocaleString("en-NG")} has
                  been applied to this month&apos;s liability. Your current
                  month liability is ₦
                  {vatSummary.currentMonthLiability.toLocaleString("en-NG")},
                  resulting in a{" "}
                  {vatSummary.netVatPayable < 0 ? (
                    <>
                      remaining credit of{" "}
                      <span className="font-bold">
                        ₦
                        {Math.abs(vatSummary.netVatPayable).toLocaleString(
                          "en-NG",
                        )}
                      </span>
                      to carry forward
                    </>
                  ) : (
                    <>
                      net payable amount of{" "}
                      <span className="font-bold">
                        ₦{vatSummary.netVatPayable.toLocaleString("en-NG")}
                      </span>
                    </>
                  )}
                  .
                </p>
              </div>
            </div>
          )}

        {selectedPeriod.id === "dec-2025" && (
          <div className="mb-6 bg-slate-50 border-2 border-slate-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 mb-1">
                No Data Available - December 2025
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                No invoice data is available for December 2025. Please select
                January 2026 or February 2026 to view the VAT credit carry
                forward demonstration.
              </p>
            </div>
          </div>
        )}

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title={
              vatSummary.netVatPayable < 0
                ? "VAT Credit (Carry Forward)"
                : "Net VAT Payable"
            }
            amount={Math.abs(vatSummary.netVatPayable)}
            icon={Scale}
            variant={vatSummary.netVatPayable < 0 ? "success" : "primary"}
            description={
              vatSummary.netVatPayable < 0
                ? "Credit to carry forward to next period"
                : "Amount owed to NRS after credit offset"
            }
            badge={vatSummary.netVatPayable < 0 ? "Credit" : "Payable"}
          />
          <SummaryCard
            title="Output VAT"
            amount={vatSummary.outputVat}
            icon={ArrowUpFromLine}
            variant="default"
            description={`From ${vatSummary.fiscalizedSalesCount} fiscalized sales invoices`}
          />
          <SummaryCard
            title="Claimable Input VAT"
            amount={vatSummary.claimableInputVat}
            icon={ArrowDownToLine}
            variant="default"
            description={`From ${vatSummary.fiscalizedPurchasesCount} fiscalized purchase invoices`}
          />
          <SummaryCard
            title="Review Required"
            amount={vatSummary.reviewRequiredVat}
            icon={FileWarning}
            variant="warning"
            description={`${vatSummary.reviewRequiredInvoices.length} invoices need attention`}
          />
        </div>

        {/* VAT Calculation Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            VAT Calculation
          </h2>
          <div className="space-y-3">
            {/* Output VAT */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Output VAT
                </p>
                <p className="text-xs text-slate-500">
                  VAT collected from sales
                </p>
              </div>
              <p className="text-lg font-bold text-slate-900">
                ₦
                {vatSummary.outputVat.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* Claimable Input VAT */}
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Less: Claimable Input VAT
                </p>
                <p className="text-xs text-slate-500">
                  VAT recoverable from purchases
                </p>
              </div>
              <p className="text-lg font-bold text-red-600">
                (₦
                {vatSummary.claimableInputVat.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
                )
              </p>
            </div>

            {/* Current Month Liability */}
            <div className="flex items-center justify-between py-3 border-b-2 border-slate-300 bg-slate-50 px-3 -mx-3 rounded">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Current Month Liability
                </p>
                <p className="text-xs text-slate-500">Before credit offset</p>
              </div>
              <p
                className={`text-lg font-bold ${
                  vatSummary.currentMonthLiability < 0
                    ? "text-emerald-600"
                    : "text-slate-900"
                }`}
              >
                {vatSummary.currentMonthLiability < 0 ? "(" : ""}₦
                {Math.abs(vatSummary.currentMonthLiability).toLocaleString(
                  "en-NG",
                  { minimumFractionDigits: 2 },
                )}
                {vatSummary.currentMonthLiability < 0 ? ")" : ""}
              </p>
            </div>

            {/* Credit Brought Forward */}
            {vatSummary.creditBroughtForward > 0 && (
              <div className="flex items-center justify-between py-3 border-b border-slate-100 bg-emerald-50 px-3 -mx-3 rounded">
                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    Less: Credit Brought Forward
                  </p>
                  <p className="text-xs text-emerald-700">
                    From previous period
                  </p>
                </div>
                <p className="text-lg font-bold text-emerald-600">
                  (₦
                  {vatSummary.creditBroughtForward.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                  )
                </p>
              </div>
            )}

            {/* Net VAT Payable */}
            <div className="flex items-center justify-between py-4 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 -mx-3 rounded-lg border-2 border-blue-200">
              <div>
                <p className="text-base font-bold text-slate-900">
                  {vatSummary.netVatPayable < 0
                    ? "VAT Credit (Carry Forward)"
                    : "Net VAT Payable"}
                </p>
                <p className="text-xs text-slate-600">
                  {vatSummary.netVatPayable < 0
                    ? "To be offset against future liability"
                    : "Final amount due to NRS"}
                </p>
              </div>
              <p
                className={`text-2xl font-bold ${
                  vatSummary.netVatPayable < 0
                    ? "text-emerald-700"
                    : "text-blue-900"
                }`}
              >
                {vatSummary.netVatPayable < 0 ? "(" : ""}₦
                {Math.abs(vatSummary.netVatPayable).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
                {vatSummary.netVatPayable < 0 ? ")" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Input VAT Breakdown Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            Input VAT Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-xs font-medium text-emerald-700 mb-1">
                Fully Claimable
              </p>
              <p className="text-2xl font-bold text-emerald-900">
                ₦
                {vatSummary.fullyClaimableVat.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-medium text-blue-700 mb-1">
                Partially Claimable
              </p>
              <p className="text-2xl font-bold text-blue-900">
                ₦
                {vatSummary.partiallyClaimableVat.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs font-medium text-amber-700 mb-1">
                Review Required
              </p>
              <p className="text-2xl font-bold text-amber-900">
                ₦
                {vatSummary.reviewRequiredVat.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-700 mb-1">
                Not Claimable
              </p>
              <p className="text-2xl font-bold text-slate-900">
                ₦
                {vatSummary.notClaimableVat.toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* At-Risk Alert */}
        {vatSummary.reviewRequiredVat > 0 && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-lg p-5 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900 mb-1">
                Action Required
              </p>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                You have{" "}
                <span className="font-semibold">
                  {vatSummary.reviewRequiredInvoices.length} purchase invoices
                </span>{" "}
                totaling{" "}
                <span className="font-semibold">
                  ₦
                  {vatSummary.reviewRequiredVat.toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                  })}
                </span>{" "}
                in VAT that require review. Resolving these issues could reduce
                your VAT payable amount.
              </p>
              <button
                onClick={() => setActiveTab("purchases")}
                className="text-sm font-semibold text-amber-900 underline hover:text-amber-700 transition-colors cursor-pointer"
              >
                View Purchase Invoices →
              </button>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <div className="flex">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "summary"
                    ? "bg-white text-blue-700 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "sales"
                    ? "bg-white text-blue-700 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Sales Invoices ({vatSummary.salesInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "purchases"
                    ? "bg-white text-blue-700 border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Purchase Invoices ({vatSummary.purchaseInvoices.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Compliance Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 mb-1">
                        Fiscalized Sales Invoices
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {vatSummary.fiscalizedSalesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">
                        Fiscalized Purchase Invoices
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {vatSummary.fiscalizedPurchasesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">
                        Non-Fiscalized Sales
                      </p>
                      <p className="text-2xl font-bold text-amber-700">
                        {vatSummary.nonFiscalizedSalesCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-1">
                        Non-Fiscalized Purchases
                      </p>
                      <p className="text-2xl font-bold text-amber-700">
                        {vatSummary.nonFiscalizedPurchasesCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800 leading-relaxed">
                    <p className="font-semibold mb-2">
                      Understanding Your VAT Calculation
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        <strong>Output VAT:</strong> VAT collected from your
                        fiscalized sales invoices
                      </li>
                      <li>
                        <strong>Claimable Input VAT:</strong> VAT you can
                        recover from fiscalized purchase invoices
                      </li>
                      <li>
                        <strong>Current Month Liability:</strong> Output VAT
                        minus Claimable Input VAT
                      </li>
                      {vatSummary.creditBroughtForward > 0 && (
                        <li>
                          <strong>Credit Brought Forward:</strong> VAT credit
                          from previous period (₦
                          {vatSummary.creditBroughtForward.toLocaleString(
                            "en-NG",
                          )}
                          )
                        </li>
                      )}
                      <li>
                        <strong>Net VAT Payable:</strong> Final amount after
                        applying previous period credit
                      </li>
                      <li>
                        <strong>VAT Credit:</strong> When claimable input
                        exceeds output, the negative balance carries forward
                      </li>
                      <li>
                        <strong>Review Required:</strong> Invoices that need
                        action before VAT can be claimed
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sales" && (
              <InvoiceTable invoices={vatSummary.salesInvoices} type="SALES" />
            )}

            {activeTab === "purchases" && (
              <InvoiceTable
                invoices={vatSummary.purchaseInvoices}
                type="PURCHASE"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
