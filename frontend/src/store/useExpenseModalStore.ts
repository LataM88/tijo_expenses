import { create } from 'zustand';
import type { Expense } from '../types/types';

interface ExpenseModalState {
  isOpen: boolean;
  expenseToEdit: Expense | null;
  openModal: (expense?: Expense) => void;
  closeModal: () => void;
}

export const useExpenseModalStore = create<ExpenseModalState>((set) => ({
  isOpen: false,
  expenseToEdit: null,
  openModal: (expense) => set({ isOpen: true, expenseToEdit: expense || null }),
  closeModal: () => set({ isOpen: false, expenseToEdit: null }),
}));
