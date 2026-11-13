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
