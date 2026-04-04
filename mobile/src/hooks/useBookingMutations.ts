import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";

export const useBookAppointment = (
  onSuccess: (data: any) => void,
  onError: (errorMsg: string) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: {
      providerId: string;
      date: string;
      time: string;
    }) => {
      const { data } = await api.post("/appointments/book", bookingData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["provider"] });
      onSuccess(data);
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message || "Booking failed. Please try again.";
      onError(message);
    },
  });
};
