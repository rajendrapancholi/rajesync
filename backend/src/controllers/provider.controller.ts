import type { Response, Request } from "express";
import ProviderModel, { type IProvider } from "../models/Provider";
import asyncHandler from "../utils/asyncHandler";
import AppointmentModel from "../models/Appointment";

export const getProviders = asyncHandler(
  async (_req: Request, res: Response) => {
    const providers = await ProviderModel.find().populate(
      "userId",
      "name image_url",
    );

    const cleanedProviders = providers.map((p: any) => ({
      id: p._id.toString(),
      name: p.userId?.name || "Unknown Provider",
      image:
        p.userId?.image_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(p.userId?.name || "Provider")}&background=006065&color=fff`,
      category: p.category,
      rating: p.rating || 5.0,
      bio: p.bio,
      price: p.price || 300,
      availableSlots: p.availableSlots || [],
    }));
    return res.json({
      status: "success",
      providers: cleanedProviders,
    });
  },
);

export const getProvider = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Missing provider id!" });

  const provider = await ProviderModel.findById(id).populate("userId");

  if (!provider)
    return res.status(404).json({ message: "Provider not found!" });

  const p = provider as any;

  return res.json({
    status: "success",
    provider: {
      id: provider.id,
      name: p.userId?.name || "Unknown Provider",
      image:
        p.userId?.image_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(p.userId?.name || "Provider")}&background=38bdf8&color=fff&size=512`,
      category: p.category,
      rating: p.rating || 5.0,
      bio: p.bio,
      price: p.price || 3000,
      availableSlots: p.availableSlots,
    },
  });
});

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await ProviderModel.distinct("category");
    return res.json({ status: "success", categories: ["All", ...categories] });
  },
);

export const getProviderSlots = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const provider = await ProviderModel.findById(id);
  if (!provider) return res.status(404).json({ message: "Provider not found" });

  const bookedAppointments = await AppointmentModel.find({
    providerId: id,
    date: date as string,
    status: { $ne: "cancelled" },
  });

  const bookedTimeSlots = bookedAppointments.map((appt) => appt.timeSlot);

  const availableSlots = provider.availableSlots.filter(
    (slot) => !bookedTimeSlots.includes(slot),
  );

  return res.json({
    status: "success",
    availableSlots,
  });
});
