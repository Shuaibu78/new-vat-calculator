"use client";

import { X, Shield, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  irn: string;
  qrCodeReference: string;
  invoiceNumber: string;
  fiscalizationStatus: string;
}

export function QRCodeModal({
  isOpen,
  onClose,
  irn,
  qrCodeReference,
  invoiceNumber,
  fiscalizationStatus,
}: QRCodeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [qrPattern] = useState(() => 
    Array.from({ length: 64 }).map(() => Math.random() > 0.5)
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">NRS Verification</h2>
              <p className="text-xs text-blue-100">
                Fiscalized Invoice QR Code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* QR Code Display */}
          <div className="flex flex-col items-center">
            <div className="bg-white border-4 border-slate-200 rounded-lg p-4 shadow-inner">
              {/* QR Code Placeholder - In production, use a QR code library like qrcode.react */}
              <div className="w-48 h-48 bg-linear-to-br from-slate-100 to-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                {/* QR Code Pattern Simulation */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-2">
                  {qrPattern.map((isDark, i) => (
                    <div
                      key={i}
                      className={`${
                        isDark ? "bg-slate-800" : "bg-white"
                      } rounded-sm`}
                    />
                  ))}
                </div>
                {/* Center Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-2 shadow-lg border-2 border-slate-300">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Scan this code with NRS mobile app to verify invoice authenticity
            </p>
          </div>

          {/* Invoice Details */}
          <div className="space-y-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">
                Invoice Number
              </p>
              <p className="text-sm font-mono font-semibold text-slate-900">
                {invoiceNumber}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-medium text-slate-600 mb-1">
                Invoice Reference Number (IRN)
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono font-semibold text-blue-700 break-all">
                  {irn}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(irn);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                  title="Copy IRN"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-medium text-slate-600 mb-1">
                QR Code Reference
              </p>
              <p className="text-sm font-mono text-slate-700 break-all">
                {qrCodeReference}
              </p>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-medium text-slate-600 mb-1">
                Fiscalization Status
              </p>
              <div className="flex items-center gap-2">
                {fiscalizationStatus === "VALIDATED" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Validated by NRS
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-slate-700">
                    {fiscalizationStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 leading-relaxed">
              <p className="font-semibold mb-1">NRS Compliance Verification</p>
              <p>
                This QR code is digitally signed by the Nigerian Revenue Service
                and can be scanned to verify the invoice&apos;s authenticity and
                fiscalization status.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Print QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
