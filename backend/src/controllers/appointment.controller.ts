import type { Response } from "express";
import type { AuthRequest } from "../types/express"; // Use your AuthRequest type
import asyncHandler from "../utils/asyncHandler";
import {
  createAppointment,
  fetchUserAppointments,
  isSlotAvailable,
  updateAppointmentStatus,
} from "../services/appointment.service";
import { isValidId } from "../utils/isValidId";

export const bookAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { providerId, date, time } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(400).json({ message: "User not found!" });

    // Validation
    if (!providerId || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidId(providerId))
      return res.status(400).json({ message: "Invalid provider!" });

    // Check Availability
    const available = await isSlotAvailable(providerId, date, time);

    if (!available) {
      return res.status(409).json({
        status: "error",
        message: "This slot is already booked. Please refresh and try another.",
      });
    }

    try {
      // Create the appointment
      const newAppointment = await createAppointment({
        userId,
        providerId,
        date,
        time,
      });

      return res.status(201).json({
        status: "success",
        appointment: newAppointment,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(409).json({
          status: "error",
          message:
            "Someone just booked this slot! Please choose a different time.",
        });
      }
      // Re-throwo ther unexpected errors to the global handler
      throw error;
    }
  },
);

export const getUserAppointments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ messsage: "Unathorize user or userid missing!" });

    const appointments = await fetchUserAppointments(userId);
    console.log("Debug appoinme: ", appointments);
    
    if (!appointments)
      return res.status(404).json({ message: "Appointment not found!" });

    return res.json({ status: "success", appointments });
  },
);

export const cancelAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(401).json({ messsage: "Unauthorized user!" });

    const updated = await updateAppointmentStatus(id, "Cancelled");

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found!" });
    }

    return res.json({ status: "success", message: "Appointment cancelled" });
  },
);

export const checkAvailability = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { providerId, date, time } = req.query;

    if (!providerId || !date || !time) {
      return res
        .status(400)
        .json({ message: "Missing required query parameters" });
    }

    const available = await isSlotAvailable(
      providerId as string,
      date as string,
      time as string,
    );

    return res.json({
      status: "success",
      available: !!available,
    });
  },
);
