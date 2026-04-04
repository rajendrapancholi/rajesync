export type FetchAppointment = {
  id: string;
  date: string;
  timeSlot: string;
  status: "upcoming" | "completed" | "cancelled";
  providerName: string;
  providerImage: string;
  providerId: string;
  category: string;
};
