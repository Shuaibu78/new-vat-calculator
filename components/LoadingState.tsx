import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading VAT Calculator...</p>
        <p className="text-sm text-slate-500 mt-2">Fetching invoice data</p>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-96 bg-slate-100 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-full max-w-md bg-slate-100 rounded animate-pulse"></div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 h-24 bg-blue-50 border-2 border-blue-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-white border-2 border-slate-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-48 bg-white border border-slate-200 rounded-lg animate-pulse mb-8"></div>
        <div className="h-96 bg-white border border-slate-200 rounded-lg animate-pulse"></div>
      </main>
    </div>
  );
}
