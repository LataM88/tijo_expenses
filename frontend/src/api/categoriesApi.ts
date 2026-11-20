import type { Category, CategoryCreate } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || 'Błąd podczas pobierania kategorii');
  }
  return response.json();
}

export async function createCategory(data: CategoryCreate): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || 'Błąd podczas tworzenia kategorii');
  }
  return response.json();
}
