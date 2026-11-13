import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/registerApi';
import type { Signup, UserResponse } from '../types/types';

export const useRegister = () => {
  return useMutation<UserResponse, Error, Signup>({
    mutationFn: (userData: Signup) => registerUser(userData),
  });
};