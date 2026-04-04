import type { Request, Response } from "express";
import { ENV } from "../config/env";
import UserModel, { UserRole } from "../models/User";
import ProviderModel from "../models/Provider";

export const SEED_DATA = [
  {
    name: "Ram's Quick Repairs",
    email: "rams@provider.com",
    category: "Repair",
    password_hash:
      "$2b$10$NnKVgswhtZEyKvOLlF9F3OWCeqyrnQ3LP9cAs3zueUQU9g9NF.whO",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 25,
  },
  {
    name: "Sparky Electric",
    email: "sparky@provider.com",
    category: "Electrician",
    password_hash:
      "$2b$10$Y6NeQ5WTdfSmQxWrWrzG5uVBZVxCwJB8yrHKhfnK/tBV.G4wQCfGq",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 40,
  },
  {
    name: "Clean & Shine",
    email: "cleanshine@provider.com",
    category: "Cleaning",
    password_hash:
      "$2b$10$JLjYDr1XPUpODENyaegPCe3T7T/mqczfExyob6z7SCDCDKSvKhjn2",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 20,
  },
  {
    name: "Pipes & Flow",
    email: "pipes@provider.com",
    category: "Plumbing",
    password_hash:
      "$2b$10$3M31PzVccpnMNre2HKAJ0.u8KlvluaJQUiddBeW3eR39UnT./sqNi",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 35,
  },
  {
    name: "Donald Maid Service",
    email: "donald@provider.com",
    category: "Cleaning",
    password_hash:
      "$2b$10$ddSOJ9qgGZ22j4/S7vIEM.SlH8aaQN1DBjGZNU.1421sEdGQiCk02",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 30,
  },
];

export const seedDatabase = async (req: Request, res: Response) => {
  if (ENV.SEED_ENABLED !== "true") {
    return res.status(403).json({ message: "Seeding is disabled!" });
  }

  // Check the custom security header
  const adminSecret = req.headers["x-admin-secret"];
  if (!adminSecret || adminSecret !== ENV.ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Unathorized!" });
  }

  try {
    await UserModel.deleteMany({ role: UserRole.PROVIDER });
    await ProviderModel.deleteMany({});

    // Seed logic (using your SEED_DATA)
    for (const data of SEED_DATA) {
      const newUser = await UserModel.create({
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        image_url: data.image,
        role: UserRole.PROVIDER,
      });

      await ProviderModel.create({
        userId: newUser._id,
        category: data.category,
        rating: data.rating,
        bio: `Professional ${data.category} service with guaranteed satisfaction.`,
        price: data.price,
        availableSlots: [
          "09:00 AM",
          "10:30 AM",
          "12:00 PM",
          "02:00 PM",
          "03:30 PM",
          "05:00 PM",
        ],
      });
    }

    return res
      .status(201)
      .json({ message: "Database Seeded Successfully! 🌱" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Seed Error", error: error.message });
  }
};
