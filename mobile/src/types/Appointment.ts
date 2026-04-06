export type FetchAppointment = {
  id: string;
  date: string;
  timeSlot: string;
  status: "upcoming" | "completed" | "cancelled";
  providerName: string;
  providerImage: string;
  providerId: string;
  providerPhone?: string;
  category: string;
};

export interface RescheduleData {
  appointmentId: string;
  providerId: string;
  date: string;
  time: string;
}