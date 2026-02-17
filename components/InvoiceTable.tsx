"use client";

import { useState, Fragment } from "react";
import { Info, ChevronDown, ChevronUp, QrCode } from "lucide-react";
import type { Invoice, InvoiceFilter } from "@/lib/types";
import { formatCurrency, formatDate, getReasonCodeLabel } from "@/lib/utils";
import { FiscalizationBadge, ClaimableStatusBadge } from "./ComplianceBadge";
import { QRCodeModal } from "./QRCodeModal";

interface InvoiceTableProps {
  invoices: Invoice[];
  type: "SALES" | "PURCHASE";
}

export function InvoiceTable({ invoices, type }: InvoiceTableProps) {
  const [filter, setFilter] = useState<InvoiceFilter>("ALL");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [qrModalInvoice, setQrModalInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    if (type === "SALES") return true;

    if (filter === "ALL") return true;
    if (filter === "CLAIMABLE") {
      return (
        inv.claimableStatus === "CLAIMABLE" ||
        inv.claimableStatus === "PARTIALLY_CLAIMABLE"
      );
    }
    if (filter === "REVIEW_REQUIRED") {
      return inv.claimableStatus === "REVIEW_REQUIRED";
    }
    if (filter === "NOT_CLAIMABLE") {
      return inv.claimableStatus === "NOT_CLAIMABLE";
    }
    return true;
  });

  const toggleRow = (invoiceId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedRows(newExpanded);
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <p className="text-slate-500 text-sm">
          No {type.toLowerCase()} invoices found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs (for Purchase invoices only) */}
      {type === "PURCHASE" && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === "ALL"
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            All ({invoices.length})
          </button>
          <button
            onClick={() => setFilter("CLAIMABLE")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === "CLAIMABLE"
                ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Claimable (
            {
              invoices.filter(
                (inv) =>
                  inv.claimableStatus === "CLAIMABLE" ||
                  inv.claimableStatus === "PARTIALLY_CLAIMABLE",
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter("REVIEW_REQUIRED")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === "REVIEW_REQUIRED"
                ? "bg-amber-50 text-amber-700 border-b-2 border-amber-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Review Required (
            {
              invoices.filter(
                (inv) => inv.claimableStatus === "REVIEW_REQUIRED",
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter("NOT_CLAIMABLE")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              filter === "NOT_CLAIMABLE"
                ? "bg-slate-50 text-slate-700 border-b-2 border-slate-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Not Claimable (
            {
              invoices.filter((inv) => inv.claimableStatus === "NOT_CLAIMABLE")
                .length
            }
            )
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                {type === "SALES" ? "Customer" : "Supplier"}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Invoice #
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                IRN
              </th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">
                QR
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">
                Subtotal
              </th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">
                VAT
              </th>
              {type === "PURCHASE" && (
                <th className="px-4 py-3 text-right font-semibold text-slate-700">
                  Claimable
                </th>
              )}
              <th className="px-4 py-3 text-center font-semibold text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((invoice) => {
              const isExpanded = expandedRows.has(invoice.id);
              const hasDetails =
                type === "PURCHASE" &&
                (invoice.reasonCode || invoice.reasonDescription);

              return (
                <Fragment key={invoice.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(invoice.invoiceDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-medium">
                      {type === "SALES"
                        ? invoice.customerName
                        : invoice.supplierName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3">
                      {invoice.irn ? (
                        <span className="font-mono text-xs text-slate-600">
                          {invoice.irn}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {invoice.irn && invoice.qrCodeReference ? (
                        <button
                          onClick={() => setQrModalInvoice(invoice)}
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View QR Code"
                          aria-label="View QR Code"
                        >
                          <QrCode className="h-5 w-5" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-900 font-medium">
                      {formatCurrency(invoice.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-900 font-medium">
                      {formatCurrency(invoice.totalVat)}
                    </td>
                    {type === "PURCHASE" && (
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-semibold ${
                            (invoice.claimableAmount || 0) > 0
                              ? "text-emerald-700"
                              : "text-slate-400"
                          }`}
                        >
                          {formatCurrency(invoice.claimableAmount || 0)}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col gap-1.5 items-center">
                        <FiscalizationBadge
                          status={invoice.fiscalizationStatus}
                        />
                        {type === "PURCHASE" && invoice.claimableStatus && (
                          <ClaimableStatusBadge
                            status={invoice.claimableStatus}
                            percent={invoice.claimablePercent}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasDetails && (
                        <button
                          onClick={() => toggleRow(invoice.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                          aria-label="Toggle details"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row Details */}
                  {isExpanded && hasDetails && (
                    <tr className="bg-amber-50 border-l-4 border-amber-400">
                      <td
                        colSpan={type === "PURCHASE" ? 9 : 8}
                        className="px-4 py-4"
                      >
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            {invoice.reasonCode && (
                              <p className="text-sm font-semibold text-amber-900 mb-1">
                                {getReasonCodeLabel(invoice.reasonCode)}
                              </p>
                            )}
                            {invoice.reasonDescription && (
                              <p className="text-sm text-amber-800 leading-relaxed">
                                {invoice.reasonDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-500 text-center">
        Showing {filteredInvoices.length} of {invoices.length} invoices
      </div>

      {/* QR Code Modal */}
      {qrModalInvoice && (
        <QRCodeModal
          isOpen={true}
          onClose={() => setQrModalInvoice(null)}
          irn={qrModalInvoice.irn || ''}
          qrCodeReference={qrModalInvoice.qrCodeReference || ''}
          invoiceNumber={qrModalInvoice.invoiceNumber}
          fiscalizationStatus={qrModalInvoice.fiscalizationStatus}
        />
      )}
    </div>
  );
}
