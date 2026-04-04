import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { FetchAppointment } from "@/types/Appointment";

export const useUserAppointments = <TData = FetchAppointment[]>(
  options?: Omit<UseQueryOptions<FetchAppointment[], Error, TData>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<FetchAppointment[], Error, TData>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data } = await api.get("/appointments");
      return data.appointments;
    },
    ...options,
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data } = await api.patch(`/appointments/${appointmentId}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};
