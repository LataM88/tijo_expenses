export type Signup = {
  first_name: string;
  email: string;
  password: string;
};

export type UserResponse = {
  id: number;
  email: string;
  first_name: string;
  created_at: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type Category = {
  id: number;
  name: string;
  color: string;
};

export type CategoryCreate = {
  name: string;
  color: string;
};

export type Expense = {
  id: number;
  amount: number | string;
  date: string;
  description?: string | null;
  category_id: number;
  category: Category;
};

export type ExpenseCreate = {
  amount: number;
  date: string;
  description?: string;
  category_id: number;
};
