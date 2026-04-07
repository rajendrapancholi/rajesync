import type { Request, Response } from "express";
import { ENV } from "../config/env";
import UserModel, { UserRole } from "../models/User";
import ProviderModel from "../models/Provider";

export const SEED_DATA = [
  {
    name: "Dr. Anita Verma",
    email: "anita.verma@provider.com",
    category: "Doctor",
    password_hash:
      "$2b$10$EqErZdwMeL0M5nD1Y4m/MOOErtlf0WxPeeM2yTSaaZnsM3tHbERrG",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=800&auto=format&fit=crop",
    price: 1200,
  },
  {
    name: "Advocate Rahul Mehra",
    email: "rahul.mehra@provider.com",
    category: "Lawyer",
    password_hash:
      "$2b$10$Ri03X14DDFXJvtAONIV9ROujkFpeDBPx/KTH00K4hZTFBbHPQ/.w.",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
    price: 1600,
  },
  {
    name: "FitLife Trainer - Karan",
    email: "karan.trainer@provider.com",
    category: "Fitness Trainer",
    password_hash:
      "$2b$10$Oc8GYrR1ANfTrDzb6iEH1.W1owbNHwV20.tKcD16FSvLPZBhuDbze",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abad1?q=80&w=800&auto=format&fit=crop",
    price: 650,
  },
  {
    name: "PeaceMind Therapy",
    email: "therapy@provider.com",
    category: "Therapist",
    password_hash:
      "$2b$10$ThL5E8wQ7muM2nRZb18FQejnmrF7F4v/6Va.m9jGCLzqET95SOxJC",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    price: 1400,
  },
  {
    name: "SpeedFix Auto Care",
    email: "autocare@provider.com",
    category: "Mechanic",
    password_hash:
      "$2b$10$/qW289KT.o1igBERfl6RqeFtzSrx.eTuZbmNIiS/2RpI9t245c6j.",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1542365887-1f1a1a1a4a1a?q=80&w=800&auto=format&fit=crop",
    price: 500,
  },
  {
    name: "Elite Home Chef – Priya",
    email: "priya.chef@provider.com",
    category: "Chef",
    password_hash:
      "$2b$10$u5oN7xRpZYv2oYCJSRrNAeTjP5rHOeNVx3g.mXuj4SwAmhIJU9MQi",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    price: 950,
  },
  {
    name: "BrightLens Photography",
    email: "photography@provider.com",
    category: "Photographer",
    password_hash:
      "$2b$10$kt6ifhYsMbK31ih6CASaQeccAuIRiSB1GSFvBkTy.adJT.IQ/Znqu",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
    price: 1800,
  },
  {
    name: "SmartTutor – Rohan",
    email: "rohan.tutor@provider.com",
    category: "Tutor",
    password_hash:
      "$2b$10$lrZKQ155e9joGykpzeBqI.dEapDK7QMJVNLlWwpmnZbOnRKfF6TDG",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    price: 700,
  },
  {
    name: "Harmony Spa & Wellness",
    email: "spa@provider.com",
    category: "Spa",
    password_hash:
      "$2b$10$T/zvEtwK93sPNw6IQoAyeujuaLOsAeLgfUkOUPaxpDN/7gnsPdfPO",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1556228453-efd6b9e644de?q=80&w=800&auto=format&fit=crop",
    price: 900,
  },
  {
    name: "TechPro IT Support",
    email: "techpro@provider.com",
    category: "IT Support",
    password_hash:
      "$2b$10$rCPhoE2snl46.fwxlZe2zOSUnNvBBClxXxwzE80dWU2M6PcDzGhCu",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1495727034151-8fdc73e332a8?q=80&w=800&auto=format&fit=crop",
    price: 550,
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
