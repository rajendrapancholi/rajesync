import { useMutation } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { IUser, LoginData, RegisterData } from "@/types/User";

export const useLogin = (onSuccess: (data: { token: string, user: IUser }) => void) => {
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess,
  });
}

export const useLogout = (onSuccess: (data: { token: string}) => void) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/logout');
      return data;
    },
    onSuccess,
  });
}

export const useRegister = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post('/auth/register', userData);
      return data;
    },
    onSuccess,
  });
};


