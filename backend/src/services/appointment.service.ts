import Appointment, { AppointmentStatus } from "../models/Appointment";

export const createAppointment = async (data: {
  userId: string;
  providerId: string;
  date: string;
  time: string;
}) => {
  return await Appointment.create({
    userId: data.userId,
    providerId: data.providerId,
    date: data.date,
    timeSlot: data.time,
    status: AppointmentStatus.UPCOMING
  });
};

export const fetchUserAppointments = async (userId: string) => {
  const appointments = await Appointment.find({ userId })
    .populate({
      path: "providerId",
      select: "category image_url",
      populate: { 
        path: "userId", 
        select: "name image_url" 
      }
    })
    .sort({ createdAt: -1 });

  return appointments.map(appt => {
    const p = appt.providerId as any;
    return {
      id: appt._id,
      providerId: p._id,
      date: appt.date,
      timeSlot: appt.timeSlot,
      status: appt.status,
      providerName: p?.userId?.name || "Unknown Provider",
      providerImage: p?.userId?.image_url || p?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p?.userId?.name || "Provider")}&background=38bdf8&color=fff&size=512`,
      category: p?.category || "Service"
    };
  });
};

export const updateAppointmentStatus = async (id: string | string[], status: string) => {
  const safeId = Array.isArray(id) ? id[0] : id;

  return await Appointment.findByIdAndUpdate(
    safeId, 
    { status }, 
    { returnDocument: 'after'  }
  );
};

// Check if a slot is already taken 
export const isSlotAvailable = async (providerId: string, date: string, time: string) => {
  const existingAppointment = await Appointment.findOne({
    providerId,
    date,
    timeSlot: time,
    status: { $ne: AppointmentStatus.CANCELLED } 
  });

  return !existingAppointment;
};


