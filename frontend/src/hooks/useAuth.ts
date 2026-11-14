import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/loginApi';
import { registerUser } from '../api/registerApi';
import type { LoginRequest, Signup, TokenResponse, UserResponse } from '../types/types';

export const useRegister = () => {
  return useMutation<UserResponse, Error, Signup>({
    mutationFn: (userData: Signup) => registerUser(userData),
  });
};

export const useLogin = () => {
  return useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
    },
  });
};
