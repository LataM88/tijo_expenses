import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory } from '../api/categoriesApi';
import type { Category, CategoryCreate } from '../types/types';

export const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CategoryCreate>({
    mutationFn: (data: CategoryCreate) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
