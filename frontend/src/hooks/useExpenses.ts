import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExpenses, createExpense, deleteExpense } from '../api/expensesApi';
import type { Expense, ExpenseCreate } from '../types/types';

export const EXPENSES_QUERY_KEY = ['expenses'];

export const useExpenses = () => {
  return useQuery<Expense[], Error>({
    queryKey: EXPENSES_QUERY_KEY,
    queryFn: fetchExpenses,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<Expense, Error, ExpenseCreate>({
    mutationFn: (data: ExpenseCreate) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
    },
  });
};
