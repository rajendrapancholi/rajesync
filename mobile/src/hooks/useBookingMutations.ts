import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { RescheduleData } from "@/types/Appointment";

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



export const useRescheduleAppointment = (
  onSuccess: (data: any) => void,
  onError: (errorMsg: string) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rescheduleData: RescheduleData) => {
      const { data } = await api.patch(
        `/appointments/${rescheduleData.appointmentId}/reschedule`,
        {
          providerId: rescheduleData.providerId,
          date: rescheduleData.date,
          time: rescheduleData.time,
        },
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["provider"] });
      onSuccess(data);
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message || "Rescheduling failed. Please try again.";
      onError(message);
    },
  });
};