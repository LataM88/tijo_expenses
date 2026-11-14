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
