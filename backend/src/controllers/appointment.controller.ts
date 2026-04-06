import type { Response } from "express";
import type { AuthRequest } from "../types/express"; // Use your AuthRequest type
import asyncHandler from "../utils/asyncHandler";
import {
  createAppointment,
  fetchUserAppointments,
  isSlotAvailable,
  updateAppointmentStatus,
  rescheduleAppointment as rescheduleAppointmentService,
} from "../services/appointment.service";
import { isValidId } from "../utils/isValidId";
import AppointmentModel from "../models/Appointment";

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

    if (!appointments)
      return res.status(404).json({ message: "Appointment not found!" });

    return res.json({ status: "success", appointments });
  },
);

export const cancelAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id || !userId)
      return res.status(401).json({ messsage: "Unauthorized user!" });

    const appointment = await AppointmentModel.findOne({ _id: id, userId });
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or not authorized!",
      });
    }

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

export const rescheduleAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { providerId, date, time } = req.body;
    const userId = req.user?.id;
    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    // Validation
    if (!userId) return res.status(400).json({ message: "User not found!" });
    if (!id)
      return res.status(400).json({ message: "Appointment ID is required!" });
    if (!providerId || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidId(providerId))
      return res.status(400).json({ message: "Invalid provider!" });

    if (!appointmentId || !isValidId(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID!" });
    }
    // Check if appointment exists and belongs to user
    const appointment = await AppointmentModel.findOne({ _id: id, userId });
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found or not authorized!",
      });
    }

    // Check slot availability
    const available = await isSlotAvailable(providerId, date, time);
    if (!available) {
      return res.status(409).json({
        status: "error",
        message: "This slot is already booked. Please choose a different time.",
      });
    }

    try {
      // Reschedule the appointment
      const updatedAppointment = await rescheduleAppointmentService(
        appointmentId,
        {
          providerId,
          date,
          time,
        },
      );

      return res.status(200).json({
        status: "success",
        appointment: updatedAppointment,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(409).json({
          status: "error",
          message:
            "This slot is already booked. Please choose a different time.",
        });
      }
      throw error;
    }
  },
);
