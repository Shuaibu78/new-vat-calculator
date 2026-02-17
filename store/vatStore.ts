import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VatPeriod, InvoiceFilter } from '@/lib/types';
import { mockVatPeriods } from '@/lib/mockData';

interface VatStore {
  selectedPeriod: VatPeriod;
  invoiceFilter: InvoiceFilter;
  isLoading: boolean;
  error: string | null;
  setSelectedPeriod: (period: VatPeriod) => void;
  setInvoiceFilter: (filter: InvoiceFilter) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  selectedPeriod: mockVatPeriods[0],
  invoiceFilter: 'ALL' as InvoiceFilter,
  isLoading: false,
  error: null,
};

export const useVatStore = create<VatStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedPeriod: (period) => set({ selectedPeriod: period }),
      
      setInvoiceFilter: (filter) => set({ invoiceFilter: filter }),
      
      setIsLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'vat-calculator-storage',
      partialize: (state) => ({
        selectedPeriod: state.selectedPeriod,
        invoiceFilter: state.invoiceFilter,
      }),
    }
  )
);
